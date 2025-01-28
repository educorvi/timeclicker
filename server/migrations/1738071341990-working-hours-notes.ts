import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkingHoursNotes1738071341990 implements MigrationInterface {
    name = 'WorkingHoursNotes1738071341990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ADD "note" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP COLUMN "note"`);
    }

}
