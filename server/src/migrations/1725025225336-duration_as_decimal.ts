import { MigrationInterface, QueryRunner } from "typeorm";

export class DurationAsDecimal1725025225336 implements MigrationInterface {
    name = 'DurationAsDecimal1725025225336'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "duration" SET DATA TYPE numeric`);
        await queryRunner.query(`CREATE TYPE "public"."contract_data_startmonth_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')`);
        await queryRunner.query(`ALTER TABLE "contract_data" ALTER COLUMN "startMonth" SET DATA TYPE "public"."contract_data_startmonth_enum" USING ("startMonth"::text::contract_data_startmonth_enum)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "duration" SET DATA TYPE integer`);
        await queryRunner.query(`ALTER TABLE "contract_data" ALTER COLUMN "startMonth" SET DATA TYPE integer USING ("startMonth"::integer)`);
        await queryRunner.query(`DROP TYPE "public"."contract_data_startmonth_enum"`);
    }

}