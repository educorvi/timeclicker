import { Controller, Get, Route } from 'tsoa';

@Route('auth')
export class AuthDataController extends Controller {
    @Get()
    public auth() {
        return {
            url: process.env.KC_BASE_URL,
            realm: process.env.KC_REALM,
            client: process.env.KC_CLIENT,
        };
    }
}
