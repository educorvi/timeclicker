import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractData1717769075506 implements MigrationInterface {
    name = 'ContractData1717769075506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contract_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hoursPerMonth" integer NOT NULL, "startMonth" integer NOT NULL, "startYear" integer NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_985a59dd2661542977888bcd86c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contract_data" ADD CONSTRAINT "FK_b833a28189bb6cf0413b3094162" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_data" DROP CONSTRAINT "FK_b833a28189bb6cf0413b3094162"`);
        await queryRunner.query(`DROP TABLE "contract_data"`);
    }

}
