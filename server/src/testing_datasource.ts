import { DataSource } from 'typeorm';
import { User, Activity, Task, ContractData, WorkingHours, Vacation } from './classes';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'superdupertest',
    database: 'timeclicker',
    entities: [User, Activity, Task, ContractData, WorkingHours, Vacation],
});
