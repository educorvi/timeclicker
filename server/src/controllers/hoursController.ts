import { Controller, Get, Query, Request, Response, Route, Security } from 'tsoa';
import { WorkingHours } from '../classes';
import { getOrCreateUser } from './activityController';
import type express from 'express';
import { db } from '../globals';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Route('hours')
@Security('educorvi_sso')
@Response(401, 'Unauthorized')
export class HoursController extends Controller {
    @Get()
    public async getHours(
        @Request() req: express.Request,
        @Query() from?: Date,
        @Query() to?: Date
    ): Promise<WorkingHours[]> {
        const user = await getOrCreateUser(req);
        let dateFindOprator = undefined;
        if(from && to){
            dateFindOprator = And(
                MoreThanOrEqual(from),
                LessThanOrEqual(to)
            );
        }else if(from){
            dateFindOprator = MoreThanOrEqual(from);
        }else if(to){
            dateFindOprator = LessThanOrEqual(to);

        }
        return db.getHours({
            where: {
                user,
                date: dateFindOprator
            },
            order: { date: 'ASC' },
        })
    }
}