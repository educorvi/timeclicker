import * as process from "process";

require('dotenv').config();
import express, {json, urlencoded} from "express";

import axios from "axios";
import {db, logger} from "./globals";
import {RegisterRoutes} from "../build/routes";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../build/swagger.json"
import cors from "cors"
import {errorHandler} from "./errorHandler";

const app = express();


app.use(cors());
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());
RegisterRoutes(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const port = process.env.PORT || 3000;


async function synchronizeTasks() {
    if (process.env.TASKS_ENDPOINT) {
        try {
            const data = (await axios.get(process.env.TASKS_ENDPOINT)).data;
            // check for closed entries
            const allTasks = await db.getAllTasks();
            for (const task of allTasks) {
                if (!(data.filter((t: any) => t.id === task.id).length === 1)) {
                    task.open = false;
                    await db.saveTask(task.id, task);
                }
            }

            // update tasks
            for (const remoteTask of data) {
                await db.saveTask(remoteTask.id, {title: remoteTask.title, note_mandatory: remoteTask.note, open: true})
            }

            logger.info("Synchronized tasks")
        } catch (e: any) {
            logger.error("Could not synchronize tasks: ", e?.message)
        }
    } else {
        logger.warn("No tasks endpoint defined, so tasks could not be synchronized")
    }
}

async function start() {
    await db.init();
    logger.info("Connected to database")
    await synchronizeTasks();
    setInterval(synchronizeTasks, 1000*60*60)
    app.listen(port, () =>
        console.log(`Example app listening at http://localhost:${port}`)
    );
}

start();

