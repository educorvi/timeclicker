import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

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
     * Hours that the user is supposed to work per month
     */
    @Column()
    hoursPerMonth: number;

    /**
     * The month in which the contract starts
     */
    @Column({type: 'int'})
    startMonth: number;

    /**
     * The year in which the contract starts
     */
    @Column({type: 'int'})
    startYear: number;
}