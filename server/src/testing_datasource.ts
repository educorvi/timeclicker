import User from './classes/User';
import Activity from './classes/Activity';
import Task from './classes/Task';
import { DataSource } from 'typeorm';
import ContractData from './classes/ContractData';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'superdupertest',
    database: 'timeclicker',
    entities: [User, Activity, Task, ContractData],
});
