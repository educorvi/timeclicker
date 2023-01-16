import {DataSource, Repository} from "typeorm";
import User from "./classes/User";
import Activity from "./classes/Activity";
import Task from "./classes/Task";

export default class Database {
    readonly host: string;
    readonly port: number;
    readonly username: string;
    readonly password: string;
    readonly database: string;
    private AppDataSource: DataSource;
    private userRepository: Repository<User>;
    private tasksRepository: Repository<Task>;


    constructor(username: string, password: string, database: string = "timeclicker", host: string = "localhost", port: number = 5432) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }

    async init() {
        this.AppDataSource = new DataSource({
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

        await this.AppDataSource.initialize();
        this.userRepository = this.AppDataSource.getRepository(User);
        this.tasksRepository = this.AppDataSource.getRepository(Task);
    }

    async getUser(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({id})
    }

    async saveUser(id: string, email: string, name: string) {
        const user = new User();
        user.id = id;
        user.email = email;
        user.name = name;
        await this.userRepository.save(user);
    }

    async getTask(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOneBy({id})
    }

    async getAllTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find();
    }

    async saveTask(id: string, details: Omit<Task, "id" | "activities">) {
        let existing = await this.getTask(id);
        if (existing) {
            existing = {
                ...existing,
                ...details
            };
            await this.tasksRepository.save(existing);
        } else {
            const task = new Task();
            task.id = id;
            task.title = details.title;
            task.note_mandatory = details.note_mandatory;
            task.open = details.open;
            await this.tasksRepository.save(task);
        }
    }

};
