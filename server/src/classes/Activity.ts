import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Task from "./Task";

@Entity()
export default class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamptz', nullable: true })
    from: Date | null

    @Column({ type: 'timestamptz', nullable: true })
    to: Date | null

    @Column()
    note: string

    @Column()
    private_note: string

    /**
     * Break time during this task in minutes
     */
    @Column({type: "int"})
    breakMins: number

    @ManyToOne(()=> User, {nullable: false, onDelete: "CASCADE"})
    user: User

    @ManyToOne(()=>Task, (task)=>task.activities,{nullable: false, onDelete: "CASCADE"})
    task: Task

};
