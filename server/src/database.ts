import { DataSource, Repository } from 'typeorm';
import type { QueryRunner } from 'typeorm';
import type { FindManyOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import type { Logger } from 'typeorm';
import { logger } from './globals';
import { User, Activity, Task, ContractData, WorkingHours } from './classes';

class TypeOrmLogger implements Logger {
    log(
        level: 'log' | 'info' | 'warn',
        message: any,
        // @ts-ignore
        queryRunner?: QueryRunner,
    ): any {
        switch (level) {
            case 'log':
                logger.debug(message);
                break;
            case 'info':
                logger.info(message);
                break;
            case 'warn':
                logger.warn(message);
                break;
        }
    }

    // @ts-ignore
    logMigration(message: string, queryRunner?: QueryRunner): any {
        logger.info(message);
    }

    // @ts-ignore
    logQuery(
        query: string,
        parameters?: any[],
        // @ts-ignore
        queryRunner?: QueryRunner,
    ): any {
        logger.debug(query, parameters);
    }

    // @ts-ignore
    logQueryError(
        error: string | Error,
        query: string,
        parameters?: any[],
        // @ts-ignore
        queryRunner?: QueryRunner,
    ): any {
        logger.error(error, query, parameters);
    }

    // @ts-ignore
    logQuerySlow(
        time: number,
        query: string,
        // @ts-ignore
        parameters?: any[],
        // @ts-ignore
        queryRunner?: QueryRunner,
    ): any {
        logger.debug('Slow query: ' + query + `\n(${time}ms)`);
    }

    // @ts-ignore
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        logger.debug(message);
    }
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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
    private hoursRepository: Repository<WorkingHours>;
    private contractDataRepository: Repository<ContractData>;

    constructor(
        username: string,
        password: string,
        database: string = 'timeclicker',
        host: string = 'localhost',
        port: number = 5432,
    ) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }

    async init() {
        this.AppDataSource = new DataSource({
            type: 'postgres',
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            database: this.database,
            entities: [User, Activity, Task, ContractData, WorkingHours],
            migrations: [
                __dirname + '/../migrations/*.js',
            ],
            migrationsTransactionMode: 'all',
            logging: 'all',
            logger: new TypeOrmLogger(),
        });

        await createDatabase({
            ifNotExist: true,
            options: this.AppDataSource.options,
        });

        await this.AppDataSource.initialize();
        logger.info('Run migrations...');
        await this.AppDataSource.runMigrations();
        this.userRepository = this.AppDataSource.getRepository(User);
        this.tasksRepository = this.AppDataSource.getRepository(Task);
        this.activityRepository = this.AppDataSource.getRepository(Activity);
        this.hoursRepository = this.AppDataSource.getRepository(WorkingHours);
        this.contractDataRepository = this.AppDataSource.getRepository(ContractData);
    }

    async getUser(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }

    async getUsers(): Promise<Array<User>> {
        return await this.userRepository.find();
    }

    async saveUser(user: User) {
        await this.userRepository.save(user);
    }

    async getTask(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOneBy({ id });
    }

    async getAllTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find({ order: { title: 'ASC' } });
    }

    async getOpenTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find({
            where: { open: true },
            order: { title: 'ASC' },
        });
    }

    async getClosedTasks(): Promise<Array<Task>> {
        return await this.tasksRepository.find({
            where: { open: false },
            order: { title: 'ASC' },
        });
    }

    async saveTask(id: string, details: Omit<Task, 'id' | 'activities'>) {
        let existing = await this.getTask(id);
        if (existing) {
            existing = {
                ...existing,
                ...details,
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

    async getActivity(id: string): Promise<Activity | null> {
        return await this.activityRepository.findOne({
            where: { id },
            relations: {
                user: true,
                task: true,
            },
        });
    }

    async saveActivity(activityData: PartialBy<Activity, 'id'>) {
        let activity = new Activity();
        activity = {
            ...activity,
            ...activityData,
        };
        await this.activityRepository.save(activity);
    }

    async deleteActivity(activity: Activity) {
        await this.activityRepository.delete({ id: activity.id });
    }

     async getMultipleHours(options?: FindManyOptions<WorkingHours>) {
        return this.hoursRepository.find(options);
    }

    async getHours(id: string): Promise<WorkingHours | null> {
        return await this.hoursRepository.findOne({
            where: { id },
            relations: {
                user: true
            }
        });
    }

    async deleteHour(hours: WorkingHours) {
        await this.hoursRepository.delete({ id: hours.id });
    }

    async saveHour(hours: PartialBy<WorkingHours, 'id'>) {
        let workingHour = new WorkingHours();
        workingHour = {
            ...workingHour,
            ...hours,
        };
        await this.hoursRepository.save(workingHour);
    }

    async getContractData(options?: FindManyOptions<ContractData>) {
        return this.contractDataRepository.find(options);
    }

    async saveContractData(requestBody: PartialBy<ContractData, 'id'>) {
        await this.contractDataRepository.save(requestBody);
    }
}
