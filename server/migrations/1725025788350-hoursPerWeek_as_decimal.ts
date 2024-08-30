import { MigrationInterface, QueryRunner } from "typeorm";

export class HoursPerWeekAsDecimal1725025788350 implements MigrationInterface {
    name = 'HoursPerWeekAsDecimal1725025788350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_data" ALTER COLUMN "hoursPerWeek" SET DATA TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_data" ALTER COLUMN "hoursPerWeek" SET DATA TYPE integer`);
    }

}
