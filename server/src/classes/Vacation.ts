import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    DENIED = 'denied',
}

/**
 * Data about a user's vacations
 */
@Entity()
export default class Vacation {
    /**
     * The ID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * The date on which the vacation starts
     */
    @Column()
    startDate: Date;

    /**
     * The date on which the vacation ends
     */
    @Column()
    endDate: Date;

    /**
     * The status of the vacation
     */
    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    status: ApprovalStatus;

}