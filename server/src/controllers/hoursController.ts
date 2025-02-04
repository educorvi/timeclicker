import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Query,
    Request,
    Response,
    Route,
    Security,
    SuccessResponse,
} from 'tsoa';
import { WorkingHours } from '../classes';
import { getOrCreateUser } from './activityController';
import type express from 'express';
import { db } from '../globals';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { calculateTimeBalance, type WeekTimeBalanceData } from '../timeBalanceCalculation';
import { getVacationDayData } from '../vacationDayCalculation';

export type saveHourParams = Omit<WorkingHours, 'id' | 'user'> & {
    id?: string;
};

export type TimeBalanceData = {
    saldo: number;
    vacationDaysLeft: number;
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
        @Query() to?: Date,
    ): Promise<WorkingHours[]> {
        const user = await getOrCreateUser(req);
        let dateFindOprator = undefined;
        if (from && to) {
            dateFindOprator = And(
                MoreThanOrEqual(from),
                LessThanOrEqual(to),
            );
        } else if (from) {
            dateFindOprator = MoreThanOrEqual(from);
        } else if (to) {
            dateFindOprator = LessThanOrEqual(to);

        }
        return db.getHours({
            where: {
                user,
                date: dateFindOprator,
            },
            order: { date: 'ASC' },
        });
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
        @Path() hourId: string,
    ) {
        const user = await getOrCreateUser(req);
        const hour = await db.getHoursById(hourId);
        if (!hour) {
            this.setStatus(404);
            return;
        }
        console.log(hour);
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
        @Request() req: express.Request,
    ) {
        const user = await getOrCreateUser(req);
        let origHour = null;
        if (requestBody.id) {
            origHour = await db.getHoursById(requestBody.id);
            if (origHour && origHour.user.id !== user.id) {
                this.setStatus(401);
                return;
            }
        }
        const vacationDayData = await getVacationDayData(user);
        if (!origHour && requestBody.vacation && vacationDayData.vacationDaysLeft <= 0) {
            this.setStatus(400);
            return;
        }
        const hour = {
            ...requestBody,
            user,
        };
        await db.saveHour(hour);
        this.setStatus(201);
    }

    /**
     * Get users time and vacation balance
     */
    @Get('balance')
    public async getBalance(
        @Request() req: express.Request,
    ): Promise<TimeBalanceData> {
        const user = await getOrCreateUser(req);
        const timeBalanceData = (await calculateTimeBalance(user));
        const saldo = timeBalanceData[timeBalanceData.length - 1].timeBalance;
        const vacationDaysLeft = (await getVacationDayData(user)).vacationDaysLeft;
        return {
            saldo,
            vacationDaysLeft,
        };
    }

    /**
     * Get working hour sums
     */
    @Get('sums')
    public async getSums(
        @Request() req: express.Request,
    ) {
        const user = await getOrCreateUser(req);
        const timeBalanceData = (await calculateTimeBalance(user));
        const workedHours = timeBalanceData.reduce((p: number, c: WeekTimeBalanceData) => {
            return p + c.workedHours;
        }, 0);
        const requiredHours = timeBalanceData.reduce((p: number, c: WeekTimeBalanceData) => {
            return p + c.requiredHours;
        }, 0);
        return {
            workedHours,
            requiredHours,
        }
    }

}