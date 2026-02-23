import { Controller, Get, Route, Tags } from 'tsoa';
import { version } from '../../package.json';

@Route('/')
@Tags("Backend Information")
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
