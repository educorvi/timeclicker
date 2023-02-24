require('dotenv').config();
import * as process from "process";
import rateLimit from 'express-rate-limit'
import express, {json, urlencoded, static as staticContent} from "express";
import axios from "axios";
import {db, logger} from "./globals";
import {RegisterRoutes} from "../build/routes";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../build/swagger.json"
import cors from "cors"
import {errorHandler} from "./errorHandler";
import path from "path";

const projectRoot = path.resolve(__dirname).split('server').slice(0, -1).join("server");
const vuePath = path.join(projectRoot, "client/dist");

const app = express();

// @ts-ignore
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(rateLimiter);

app.use(cors());
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());
RegisterRoutes(app);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(staticContent(vuePath))

app.use(errorHandler);

app.get('*', (_req, res) => {
    res.sendFile(path.join(vuePath, 'index.html'), e => console.error(e));
});

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
    try {
        await db.init();
        logger.info("Connected to database");
    } catch (e) {
        logger.fatal("Could not connect to database: ", e);
        process.exit(-1);
    }
    await synchronizeTasks();
    setInterval(synchronizeTasks, 1000 * 60 * 60)
    app.listen(port, () =>
        console.log(`App listening at http://localhost:${port}`)
    );
}

start();

