import { Logger } from 'tslog';
import Database from './database';
import process from 'process';
import {config} from 'dotenv';

config()

export const logger = new Logger({
    hideLogPositionForProduction: true,
    minLevel: process.env.LOG_LEVEL
        ? Number.parseInt(process.env.LOG_LEVEL)
        : 3,
});

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error(
        'Username and password for database need to be set in .env file'
    );
}
export const db = new Database(
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
    process.env.DB_HOST,
    process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : undefined
);
