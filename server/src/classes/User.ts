import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import ContractData from './ContractData';

/**
 * A User of the tool
 */
@Entity()
export default class User {
    /**
     * The user's ID
     */
    @PrimaryColumn()
    id: string;

    /**
     * The user's E-Mail
     */
    @Column()
    email: string;

    /**
     * The user's name
     */
    @Column()
    name: string;

    /**
     * The contract data of the user
     */
    @OneToMany(() => ContractData, (contractData) => contractData.user)
    contractData: ContractData[];
}
