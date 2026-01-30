import { MigrationInterface, QueryRunner } from "typeorm";

export class VacationAndWorkingHours1718358438809 implements MigrationInterface {
    name = 'VacationAndWorkingHours1718358438809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "FK_697c910993690b1ee75b4c4c118" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "FK_697c910993690b1ee75b4c4c118"`);
        await queryRunner.query(`DROP TABLE "working_hours"`);
    }

}
