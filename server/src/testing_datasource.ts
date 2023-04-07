import User from './classes/User';
import Activity from './classes/Activity';
import Task from './classes/Task';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'superdupertest',
    database: 'timeclicker',
    entities: [User, Activity, Task],
});
