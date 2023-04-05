import type express from 'express';
import { Keycloak } from 'keycloak-backend';
import { logger } from './globals';

if (
    !process.env.KC_REALM ||
    !process.env.KC_BASE_URL ||
    !process.env.KC_CLIENT
) {
    logger.fatal(
        'Keycloak is not defined in server/.env. See server/.env.template'
    );
    process.exit(-2);
}

const keycloak = new Keycloak({
    realm: process.env.KC_REALM,
    keycloak_base_url: process.env.KC_BASE_URL,
    client_id: process.env.KC_CLIENT,
});

export class UnauthorizedError extends Error {
    public readonly status = 401;

    constructor(message: string) {
        super(message);
    }
}

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    // @ts-ignore
    scopes?: string[]
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (securityName === 'educorvi_sso') {
            const authHeader = request
                .header('Authorization')
                ?.replace('Bearer ', '');
            if (!authHeader) {
                reject(
                    new UnauthorizedError('No Authentication Header present')
                );
                return;
            }
            let token;
            try {
                token = await keycloak.jwt.verify(authHeader);
            } catch (e) {
                reject(new UnauthorizedError('Token is not valid'));
                return;
            }
            if (token.isExpired()) {
                reject(new UnauthorizedError('Token has expired'));
            }
            request.rawHeaders.push(
                'token',
                JSON.stringify({ ...token, isOrga: token.hasRealmRole('orga') })
            );
            resolve(null);
        } else {
            reject();
        }
    });
}
