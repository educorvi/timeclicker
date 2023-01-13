import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class User {
    @PrimaryColumn()
    id: string

    @Column()
    email: string

    @Column()
    name: string
}
