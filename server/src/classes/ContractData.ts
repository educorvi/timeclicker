import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

export enum Month {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12,
}

/**
 * Data about a user's contracts
 */
@Entity()
export default class ContractData {
    /**
     * The ID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * The user that this contract data belongs to
     */
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    /**
     * Hours that the user is supposed to work per week
     */
    @Column()
    hoursPerWeek: number;

    /**
     * Number of days a week the user is supposed to work
     */
    @Column()
    daysPerWeek: number;

    /**
     * vacation days per year
     */
    @Column()
    vacationDays: number;

    /**
     * The month in which the contract starts
     */
    @Column({ type: 'enum', enum: Month })
    startMonth: Month;

    /**
     * The year in which the contract starts
     */
    @Column({ type: 'int' })
    startYear: number;
}
