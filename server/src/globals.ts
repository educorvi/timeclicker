import {Logger} from "tslog";
import Database from "./database";
import process from "process";

export const logger = new Logger({hideLogPositionForProduction: true});


if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error("Username and password need to be set in .env file")
}
export const db = new Database(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_DATABASE, process.env.DB_HOST, process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : undefined);
