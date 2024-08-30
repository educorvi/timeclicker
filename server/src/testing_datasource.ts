import { DataSource } from 'typeorm';
import { User, Activity, Task, ContractData, WorkingHours } from './classes';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'timeclicker',
    password: 'superdupertest',
    database: 'timeclicker',
    entities: [User, Activity, Task, ContractData, WorkingHours],
});
