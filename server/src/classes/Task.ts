import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import Activity from "./Activity";

@Entity()
export default class Task {
    @PrimaryColumn()
    id: string

    @Column()
    title: string

    @Column()
    note_mandatory: boolean

    @Column()
    open: boolean

    @OneToMany(() => Activity, (activity) => activity.task)
    activities: Activity[];
};
