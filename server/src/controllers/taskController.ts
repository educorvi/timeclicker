import {Controller, Get, Path, Query, Route, Response, Security} from "tsoa";
import Task from "../classes/Task";
import {db} from "../globals";

@Route("tasks")
@Security("educorvi_sso")
export class TaskController extends Controller {
    /**
     * Get tasks
     */
    @Get("/")
    public async getTasks(
        /**
         * Return open, closed or all tasks
         */
        @Query() open: "true" | "false" | "all" = "all"
    ): Promise<Array<Task>>{
        switch (open) {
            case "all":
                return db.getAllTasks();
            case "true":
                return db.getOpenTasks()
            case "false":
                return db.getClosedTasks();
        }

    }
    /**
     * Get specific task
     */
    @Get("{taskId}")
    @Response(404, "Not found")
    public async getTask(
        /**
         * Return open, closed or all tasks
         */
        @Path() taskId: string
    ): Promise<Task|null>{
        const t = await db.getTask(taskId);
        if (t) {
            return t;
        } else {
            this.setStatus(404);
            return null;
        }
    }




}
