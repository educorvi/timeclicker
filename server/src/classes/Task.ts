import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Activity from './Activity';

/**
 * A Task is a project that the user can work on
 */
@Entity()
export default class Task {
    /**
     * The tasks ID
     */
    @PrimaryColumn()
    id: string;

    /**
     * The tasks title
     */
    @Column()
    title: string;

    /**
     * Indicates whether a note is mandatory when creating activities relating to this task
     */
    @Column()
    note_mandatory: boolean;

    /**
     * Indicates whether a task can still be worked on
     */
    @Column({ comment: 'Indicates whether a task can still be worked on' })
    open: boolean;

    /**
     * The activities that reference this task
     */
    @OneToMany(() => Activity, (activity) => activity.task)
    activities: Activity[];
}
