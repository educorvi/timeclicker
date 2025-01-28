import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HoursType } from '../enums';
import User from './User';

/**
 * Hours that a user has worked on a specific day
 */
@Entity()
export default class WorkingHours {
     /**
     * The ID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * The date on which the hours were worked
     */
    @Column()
    date: Date;

    /**
     * The minutes that were worked
     */
    @Column("decimal")
    duration: number;

    /**
     * The user that worked the hours
     */
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    /**
     * Is this time worked/vacation/...
     */
    @Column({ type: 'enum', enum: HoursType, default: HoursType.WORK })
    type: HoursType;


    @Column({ default: '' })
    note: string;
}