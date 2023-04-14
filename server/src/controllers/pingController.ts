import { Controller, Get, Route } from 'tsoa';
import { version } from '../../package.json';

@Route('/')
export class PingController extends Controller {
    @Get()
    public hello() {
        return {
            message:
                'This is the timeclicker server. Documentation can be found under ./docs',
            version,
        };
    }
}
