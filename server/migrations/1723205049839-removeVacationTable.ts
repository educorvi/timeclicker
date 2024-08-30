import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveVacationTable1723205049839 implements MigrationInterface {
    name = 'RemoveVacationTable1723205049839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ADD "vacation" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP COLUMN "vacation"`);
    }

}
