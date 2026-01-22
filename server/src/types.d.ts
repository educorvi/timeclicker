declare global {
    namespace Express {
        interface Request {
            authToken: {token: Token, isOrga: boolean };
        }
    }
}

export {}
