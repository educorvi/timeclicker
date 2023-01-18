import {Body, Controller, Get, Post, Route, Security, SuccessResponse, Response, Delete, Path} from "tsoa";
import Activity from "../classes/Activity";
import {db} from "../globals";
import {Request} from "tsoa";
import express from "express";
import {User} from "../classes";

async function getOrCreateUser(req: express.Request): Promise<User> {
    const tokStr = req.rawHeaders[req.rawHeaders.indexOf("token") + 1];
    if (!tokStr || req.rawHeaders.indexOf("token") === -1) {
        throw new Error("could not read token");
    }
    const token = JSON.parse(tokStr);
    let user: User | null = await db.getUser(token.content.sub);
    if (!user) {
        user = new User();
        user.id = token.content.sub;
        user.name = token.content.name;
        user.email = token.content.email;
        await db.saveUser(user);
    }
    return user;
}

type ActivityCreationAdditionalParams = {
    taskId: string
}

@Route("activities")
@Security("educorvi_sso")
@Response(401, "Unauthorized")
export class ActivityController extends Controller {
    @Get()
    public async getActivities(@Request() req: express.Request): Promise<Array<Activity>> {
        const user = await getOrCreateUser(req);
        return db.getActivities({where: {user}, relations: {task: true, user: true}});
    }

    @Delete("{activityId}")
    @Response(404, "Not found")
    public async deleteActivity(@Request() req: express.Request,  @Path() activityId: string) {
        const user = await getOrCreateUser(req);
        const activity = await db.getActivity(activityId);
        if (!activity) {
            this.setStatus(404);
            return;
        }
        if (activity.user.id !== user.id) {
            this.setStatus(401);
            return;
        }
        await db.deleteActivity(activity);

    }

    @SuccessResponse("201", "Created")
    @Response(400, "Bad Request")
    @Post("create")
    public async createActivity(
        @Body() requestBody: Omit<Activity, "id" | "user" | "task"> & ActivityCreationAdditionalParams,
        @Request() req: express.Request) {
        const user = await getOrCreateUser(req);
        const task = await db.getTask(requestBody.taskId);
        if (!(user && task)) {
            this.setStatus(400);
            return;
        }
        const activityData = {
            ...requestBody,
            user,
            task
        }
        await db.createActivity(activityData);
        this.setStatus(201);
    }
}
