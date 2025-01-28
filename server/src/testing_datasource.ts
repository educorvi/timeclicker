import { DataSource } from 'typeorm';
import { User, Activity, Task, ContractData, WorkingHours } from './classes';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'timeclicker',
    password: process.env.DB_PASSWORD,
    database: 'timeclicker',
    entities: [User, Activity, Task, ContractData, WorkingHours],
});
