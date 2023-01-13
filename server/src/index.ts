import * as process from "process";

require('dotenv').config();

import Database from "./database";

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error("Username and password need to be set in .env file")
}

const db = new Database(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE, process.env.DB_HOST, process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : undefined);

async function start() {
    await db.init();
    console.log("Connected to database")
}

start();

