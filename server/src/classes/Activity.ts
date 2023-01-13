import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Task from "./Task";

@Entity()
export default class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamptz' })
    from: Date

    @Column({ type: 'timestamptz' })
    to: Date

    @Column()
    note: string

    @Column()
    private_note: string

    @ManyToOne(()=> User, {nullable: false, onDelete: "CASCADE"})
    user: User

    @ManyToOne(()=>Task, (task)=>task.activities,{nullable: false, onDelete: "CASCADE"})
    task: Task

};
