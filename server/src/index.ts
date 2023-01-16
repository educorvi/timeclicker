import * as process from "process";

require('dotenv').config();

import Database from "./database";
import axios from "axios";
import {logger} from "./Logger";

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error("Username and password need to be set in .env file")
}

const db = new Database(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE, process.env.DB_HOST, process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : undefined);


async function synchronizeTasks() {
    if (process.env.TASKS_ENDPOINT) {
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
    } else {
        logger.warn("No tasks endpoint defined, so tasks could not be synchronized")
    }
}

async function start() {
    await db.init();
    await synchronizeTasks();
    logger.info("Connected to database")
}

start();

