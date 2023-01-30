import {DataSource, Repository} from "typeorm";
import type {FindManyOptions} from "typeorm"
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
    private activityRepository: Repository<Activity>;


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
        this.activityRepository = this.AppDataSource.getRepository(Activity);
    }

    async getUser(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({id})
    }

    async getUsers(): Promise<Array<User>> {
        return await this.userRepository.find();
    }

    async saveUser(user: User) {
        await this.userRepository.save(user);
    }

    async getTask(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOneBy({id})
    }

    async getAllTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find();
    }

    async getOpenTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find({where: {open: true}});
    }
    async getClosedTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find({where: {open: false}});
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

    async getActivities(options?: FindManyOptions<Activity>) {
        return this.activityRepository.find(options);
    }

    async getActivity(id: string):Promise<Activity | null> {
        return await this.activityRepository.findOne({
            where: {id},
            relations: {
                user: true,
                task: true
            }
        })
    }

    async createActivity(activityData: Omit<Activity, "id"> & {id?: string}) {
        let activity = new Activity();
        activity = {
            ...activity,
            ...activityData
        };
        await this.activityRepository.save(activity);
    }


    async deleteActivity(activity: Activity) {
        await this.activityRepository.delete({id: activity.id})
    }
};
