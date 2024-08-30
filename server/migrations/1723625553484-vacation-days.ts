import { MigrationInterface, QueryRunner } from "typeorm";

export class VacationDays1723625553484 implements MigrationInterface {
    name = 'VacationDays1723625553484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_data" DROP COLUMN "hoursPerMonth"`);
        await queryRunner.query(`ALTER TABLE "contract_data" ADD "hoursPerWeek" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_data" ADD "daysPerWeek" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_data" ADD "vacationDays" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_data" DROP COLUMN "vacationDays"`);
        await queryRunner.query(`ALTER TABLE "contract_data" DROP COLUMN "daysPerWeek"`);
        await queryRunner.query(`ALTER TABLE "contract_data" DROP COLUMN "hoursPerWeek"`);
        await queryRunner.query(`ALTER TABLE "contract_data" ADD "hoursPerMonth" integer NOT NULL`);
    }

}
