import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class addBreaktime1680163968689 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("activity", new TableColumn({name: "breakMins", type: "int", default: 0, comment: "Break time in minutes during this tasks"}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("activity","breakMins")
    }

}
