import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
     * The hours that were worked
     */
    @Column()
    duration: number;

    /**
     * The user that worked the hours
     */
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;
}