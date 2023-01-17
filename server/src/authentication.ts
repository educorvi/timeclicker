import express from "express";
import Keycloak from "keycloak-backend-ts";

const keycloak = new Keycloak({
    "realm": "educorvi",
    "keycloak_base_url": "https://sso.educorvi.de",
    "client_id": "timeclicker"
});

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    return new Promise(async (resolve, reject) => {

        if (securityName === "educorvi_sso") {
            const authHeader = request.header('Authorization')?.replace("Bearer ", "");
            if (!authHeader) {
                reject();
                return;
            }
            let token;
            try {
                token = await keycloak.jwt.verify(authHeader);
            } catch {
                reject();
                return;
            }
            if (token.isExpired()) {
                reject();
            }
            if (scopes?.includes("orga") && !token.hasRealmRole("orga")) {
                //TODO test
                reject();
            }
        } else {
            reject();
        }

        console.log(scopes);
        resolve(null);
    });
}
