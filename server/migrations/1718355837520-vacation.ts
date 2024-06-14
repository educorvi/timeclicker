import { MigrationInterface, QueryRunner } from "typeorm";

export class Vacation1718355837520 implements MigrationInterface {
    name = 'Vacation1718355837520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vacation_status_enum" AS ENUM('pending', 'approved', 'denied')`);
        await queryRunner.query(`CREATE TABLE "vacation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "public"."vacation_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_b98b2da5d138aa464c5d1431135" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "FK_697c910993690b1ee75b4c4c118" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "FK_697c910993690b1ee75b4c4c118"`);
        await queryRunner.query(`DROP TABLE "vacation"`);
        await queryRunner.query(`DROP TYPE "public"."vacation_status_enum"`);
        await queryRunner.query(`DROP TABLE "working_hours"`);
    }

}
