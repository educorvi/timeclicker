import { Get, Response, Route, Security, Request } from 'tsoa';
import { Controller } from '@tsoa/runtime';
import { db } from '../globals';
import { getOrCreateUser } from './activityController';
import express from 'express';

@Route('contract_data')
@Security('educorvi_sso')
@Response(401, 'Unauthorized')
export class ContractDataController extends Controller {
    /**
     * Returns a list of all contracts associated with the authenticated user
     * @param req
     **/
    @Get()
    public async getContractData(@Request() req: express.Request) {
        const user = await getOrCreateUser(req);
        return db.getContractData({ where: { user } });
    }
}
