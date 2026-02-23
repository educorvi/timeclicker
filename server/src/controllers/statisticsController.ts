import { Controller, Get, Request, Response, Route, Security, Tags } from 'tsoa';
import { getOrCreateUser } from './activityController';
import type express from 'express';
import { db } from '../globals';

@Route('statistics')
@Tags('Statistics')
@Security('educorvi_sso')
@Response(401, 'Unauthorized')
export class StatisticsController extends Controller {

    @Get('/hours-per-task')
    public async getHoursPerTask(
        @Request() req: express.Request,
    ) {
        const user = await getOrCreateUser(req);
        return db.getHoursPerTask(user);
    }

    @Get('/time-heatmap')
    public async getTimeHeatmap(
        @Request() req: express.Request,
    ) {
        const user = await getOrCreateUser(req);
        return db.getTimeHeatmap(user);
    }

}
