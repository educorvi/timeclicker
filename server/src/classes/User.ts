import {Column, Entity, PrimaryColumn} from "typeorm";

/**
 * A User of the tool
 */
@Entity()
export default class User {
    /**
     * The user's ID
     */
    @PrimaryColumn()
    id: string

    /**
     * The user's E-Mail
     */
    @Column()
    email: string

    /**
     * The user's name
     */
    @Column()
    name: string
}
