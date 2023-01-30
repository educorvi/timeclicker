import express from "express";
import Keycloak from "keycloak-backend-ts";

const keycloak = new Keycloak({
    "realm": "educorvi",
    "keycloak_base_url": "https://sso.educorvi.de",
    "client_id": "timeclicker"
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
        if (securityName === "educorvi_sso") {
            const authHeader = request.header('Authorization')?.replace("Bearer ", "");
            if (!authHeader) {
                reject(new UnauthorizedError("No Authentication Header present"));
                return;
            }
            let token;
            try {
                token = await keycloak.jwt.verify(authHeader);
            } catch (e){
                reject(new UnauthorizedError("Token is not valid"));
                return;
            }
            if (token.isExpired()) {
                reject(new UnauthorizedError("Token has expired"));
            }
            request.rawHeaders.push("token", JSON.stringify(token));
            resolve(null);
        } else {
            reject();
        }
    });
}
