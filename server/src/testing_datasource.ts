import { DataSource } from 'typeorm';
import { User, Activity, Task} from './classes';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'timeclicker',
    password: 'superdupertest',
    database: 'timeclicker',
    entities: [User, Activity, Task],
});
