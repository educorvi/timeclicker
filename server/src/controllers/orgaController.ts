import { Controller } from '@tsoa/runtime';
import {
    Response,
    Route,
    Security,
    Request,
    Get,
    Query,
    Post,
    Body,
    Delete,
    Path,
} from 'tsoa';
import type express from 'express';
import { UnauthorizedError } from '../authentication';
import { db } from '../globals';
import { Any, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ContractData } from '../classes';
import { calculateAllTimeBalances, calculateTimeBalance } from '../timeBalanceCalculation';
import { getAllVacationDayData, VacationDayData } from '../vacationDayCalculation';

export type saveContractDataParams = Omit<ContractData, 'id' | 'user'> & {
    id?: string;
    userId: string;
};

function checkOrgaStatus(req: express.Request): void {
    const tokStr = req.rawHeaders[req.rawHeaders.indexOf('token') + 1];
    if (!tokStr || req.rawHeaders.indexOf('token') === -1) {
        throw new Error('could not read token');
    }
    const token = JSON.parse(tokStr);
    if (!token.isOrga) {
        throw new UnauthorizedError(
            'User does not have access to organizational information',
        );
    }
}

@Route('orga')
@Security('educorvi_sso')
@Response(401, 'Unauthorized')
export class OrgaController extends Controller {
    /**
     * Returns a list of all users that accessed timeclicker at least once
     * @param req
     */
    @Get('users')
    public async getUsers(@Request() req: express.Request) {
        checkOrgaStatus(req);
        return await db.getUsers();
    }

    /**
     * Returns a complete or optionally filtered list of saved activities
     * @param req
     * @param users Users that should be included (default: all)
     * @param from If given, all activities that started before this timestamp will be omitted
     * @param to If given, all activities that ended after this timestamp will be omitted
     * @param tasks Tasks that should be included (default: all)
     */
    @Get('activities')
    public async getAllActivities(
        @Request() req: express.Request,
        @Query() users?: Array<string>,
        @Query() from?: Date,
        @Query() to?: Date,
        @Query() tasks?: Array<string>,
    ) {
        checkOrgaStatus(req);

        // const dbTask = task ? await db.getTask(task) : undefined
        return (
            await db.getActivities({
                where: {
                    from: from ? MoreThanOrEqual(from) : undefined,
                    to: to ? LessThanOrEqual(to) : undefined,
                    task: tasks?.length ? Any(tasks) : undefined,
                    user: users?.length ? Any(users) : undefined,
                },
                relations: { task: true, user: true },
            })
        ).map((a) => {
            a.private_note = '';
            return a;
        });
    }

    /**
     * Create or update contractData. If `id` is passed in the body, the contractData with this id will be updated.
     * @param requestBody
     * @param req
     */
    @Post('contract-data')
    @Response(404, 'User not found')
    public async saveContractData(
        @Body() requestBody: saveContractDataParams,
        @Request() req: express.Request,
    ) {
        checkOrgaStatus(req);
        const user = await db.getUser(requestBody.userId);
        if (!user) {
            this.setStatus(404);
            return;
        }
        return db.saveContractData({
            ...requestBody,
            user,
        });
    }

    /**
     * Returns a list of all contracts associated with the given user
     * @param req
     * @param userId The id of the user
     **/
    @Get('contract-data')
    @Response(404, 'User not found')
    public async getContractData(
        @Query() userId: string,
        @Request() req: express.Request,
    ) {
        checkOrgaStatus(req);
        const user = await db.getUser(userId);
        if (!user) {
            this.setStatus(404);
            return;
        }
        return db.getContractData({
            where: { user },
            order: { startYear: 'ASC', startMonth: 'ASC' },
        });
    }

    /**
     * Deletes the contract data with the given id
     * @param req
     * @param contractId The id of the contract data
     */
    @Delete('contract-data/{contractId}')
    public async deleteContractData(
        @Request() req: express.Request,
        @Path() contractId: string,
    ) {
        checkOrgaStatus(req);
        const contractData = await db.getContractDataById(contractId);
        if (!contractData) {
            this.setStatus(404);
            return;
        }
        await db.deleteContractData(contractData);
    }

    /**
     * Calculate the time balance for all users
     * @param req
     * @param from Specifies from which date the time balance should be included in the response. This does not affect the calculation.
     * @param to Specifies until which date the time balance should be included in the response. This does not affect the calculation.
     */
    @Get('time-balance')
    public async getTimeBalance(@Request() req: express.Request, @Query() from?: Date, @Query() to?: Date){
        checkOrgaStatus(req);
        return await calculateAllTimeBalances(from, to);
    }


    /**
     * Calculates the time balance for the given user
     * @param req
     * @param userId The id of the user
     * @param from Specifies from which date the time balance should be included in the response. This does not affect the calculation.
     * @param to Specifies until which date the time balance should be included in the response. This does not affect the calculation.
     */
    @Get('time-balance/{userId}')
    @Response(404, 'User not found')
    public async getTimeBalanceForUser(@Request() req: express.Request, @Path() userId: string, @Query() from?: Date, @Query() to?: Date){
        checkOrgaStatus(req);
        const user = await db.getUser(userId);
        if (!user) {
            this.setStatus(404);
            return;
        }
        return await calculateTimeBalance(user, from, to);
    }

    /**
     * Get vacation day data for all users
     */
    @Get('vacation-days')
    public async getVacationDays(@Request() req: express.Request): Promise<Record<string, VacationDayData>> {
        checkOrgaStatus(req);
        return await getAllVacationDayData();
    }
}
