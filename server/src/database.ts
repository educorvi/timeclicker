import {DataSource} from "typeorm";
import User from "./classes/User";
import Activity from "./classes/Activity";
import Task from "./classes/Task";

export default class Database {
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly database: string;


    constructor(username: string, password: string, database: string = "timeclicker", host: string = "localhost", port: number = 5432) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }

    async init() {
        const AppDataSource = new DataSource({
            type: "postgres",
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            database: "timeclicker",
            entities: [User, Activity, Task],
            synchronize: true,
            logging: false,
        });

        await AppDataSource.initialize();
    }
};
