import {Body, Controller, Get, Post, Route, Security, SuccessResponse, Response, Delete, Path, Query} from "tsoa";
import type Activity from "../classes/Activity";
import {db} from "../globals";
import {Request} from "tsoa";
import type express from "express";
import {User} from "../classes";
import {LessThanOrEqual, MoreThanOrEqual} from "typeorm";

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

export type saveActivityParams = Omit<Activity, "id" | "user" | "task"> & { id?: string, taskId: string }

@Route("activities")
@Security("educorvi_sso")
@Response(401, "Unauthorized")
export class ActivityController extends Controller {
    /**
     * Returns all activities that are associated with the authenticated user
     * @param req
     * @param from Only return activities after this date
     * @param to Only return activities up to this date
     */
    @Get()
    public async getActivities(@Request() req: express.Request, @Query() from?: Date, @Query() to?: Date): Promise<Array<Activity>> {
        const user = await getOrCreateUser(req);
        return db.getActivities({
            where: {
                user,
                from: from ? MoreThanOrEqual(from) : undefined,
                to: to ? LessThanOrEqual(to) : undefined},
            relations: {task: true, user: true},
            order: { from: "ASC"}
        });
    }

    /**
     * Deletes the activity
     * @param req
     * @param activityId id of the activity to delete
     */
    @Delete("{activityId}")
    @Response(404, "Not found")
    public async deleteActivity(@Request() req: express.Request, @Path() activityId: string) {
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


    /**
     * Creates or updates an activity. If `id` is passed in the body, then the activity with this id will be updated, otherwise a new activity will be created.
     * @param requestBody
     * @param req
     */
    @SuccessResponse("201", "Created")
    @Response(400, "Bad Request")
    @Post()
    public async saveActivity(
        @Body() requestBody: saveActivityParams,
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
