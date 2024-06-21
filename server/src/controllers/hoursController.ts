import { Body, Controller, Delete, Get, Post, Query, Request, Response, Route, Security, SuccessResponse } from 'tsoa';
import { WorkingHours } from '../classes';
import { getOrCreateUser } from './activityController';
import type express from 'express';
import { db } from '../globals';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export type saveHourParams = Omit<WorkingHours, 'id' | 'user'> & {
    id?: string;
};


@Route('hours')
@Security('educorvi_sso')
@Response(401, 'Unauthorized')
export class HoursController extends Controller {
    /**
     * Returns all working hours that are associated with the authenticated user
     * @param req
     * @param from Only return working hours after this date
     * @param to Only return working hours up to this date
     */
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
        return db.getMultipleHours({
            where: {
                user,
                date: dateFindOprator
            },
            order: { date: 'ASC' },
        })
    }

    /**
     * Delete an hour
     * @param req
     * @param hourId id of the hour to delete
     */
    @Delete('{hourId}')
    @Response(404, 'Not found')
    public async deleteHour(
        @Request() req: express.Request,
        @Query() hourId: string
    ) {
        const user = await getOrCreateUser(req);
        const hour = await db.getHours(hourId);
        if (!hour) {
            this.setStatus(404);
            return;
        }
        if (hour.user.id !== user.id) {
            this.setStatus(401);
            return;
        }
        await db.deleteHour(hour);
    }


    /**
     * Creates or updates an hour. If `id` is passed in the body, then the hour with this id will be updated, otherwise a new hour will be created.
     * @param requestBody
     * @param req
     */
    @SuccessResponse('201', 'Saved')
    @Response(400, 'Bad Request')
    @Post()
    public async saveHour(
        @Body() requestBody: saveHourParams,
        @Request() req: express.Request
    ) {
        const user = await getOrCreateUser(req);
        const hour = {
            ...requestBody,
            user,
        };
        await db.saveHour(hour);
        this.setStatus(201);
    }

}