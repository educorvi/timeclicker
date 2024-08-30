import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';
import Task from './Task';

/**
 * Represents a time interval during which the user worked on a specific task
 */
@Entity()
export default class Activity {
    /**
     * The activities ID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * The timestamp on which the activity starts
     */
    @Column({
        type: 'timestamptz',
        nullable: true,
        comment: 'The timestamp on which the activity starts',
    })
    from: Date | null;

    /**
     * The timestamp on which the activity ends
     */
    @Column({
        type: 'timestamptz',
        nullable: true,
        comment: 'The timestamp on which the activity ends',
    })
    to: Date | null;

    /**
     * A note about the activity
     */
    @Column()
    note: string;

    /**
     * A private note about the activity, that will not be shown in the orga ui
     */
    @Column()
    private_note: string;

    /**
     * Break time during this task in minutes
     */
    @Column({
        type: 'int',
        comment: 'Break time during this task in minutes',
        default: 0,
    })
    breakMins: number;

    /**
     * The User that created this activity
     */
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    /**
     * The Task that was being worked on by the user during this activity
     */
    @ManyToOne(() => Task, (task) => task.activities, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    task: Task;
}
