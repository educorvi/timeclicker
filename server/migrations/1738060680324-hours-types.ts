import { MigrationInterface, QueryRunner } from "typeorm";

export class HoursTypes1738060680324 implements MigrationInterface {
    name = 'HoursTypes1738060680324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."working_hours_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD "type" "public"."working_hours_type_enum" NOT NULL DEFAULT '0'`);
        await queryRunner.query(`UPDATE "working_hours" SET type = '1' WHERE vacation IS TRUE`);
        await queryRunner.query(`ALTER TABLE "working_hours" DROP COLUMN "vacation"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ADD "vacation" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "working_hours" SET vacation = TRUE WHERE type = '1'`);
        await queryRunner.query(`ALTER TABLE "working_hours" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."working_hours_type_enum"`);
    }

}
