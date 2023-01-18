import express from "express";
import Keycloak from "keycloak-backend";

const keycloak = new Keycloak({
    "realm": "educorvi",
    "keycloak_base_url": "https://sso.educorvi.de",
    "client_id": "timeclicker"
});

export class UnauthorizedError extends Error {
    public readonly status = 401;
    constructor(message: string) {
        super("Unauthorized: "+message);
    }
}

export function expressAuthentication(
    request: express.Request,
    securityName: string,
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
                console.error(e);
                reject(new UnauthorizedError("Token is not valid"));
                return;
            }
            if (token.isExpired()) {
                reject(new UnauthorizedError("Token has expired"));
            }
            if (scopes?.includes("orga") && !token.hasRealmRole("orga")) {
                //TODO test
                reject(new UnauthorizedError("Missing orga Role"));
            }
            request.rawHeaders.push("token", JSON.stringify(token));
            resolve(null);
        } else {
            reject();
        }
    });
}
