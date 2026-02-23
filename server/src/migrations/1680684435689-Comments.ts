import { MigrationInterface, QueryRunner } from "typeorm";

export class Comments1680684435689 implements MigrationInterface {
    name = 'Comments1680684435689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "task"."open" IS 'Indicates whether a task can still be worked on'`);
        await queryRunner.query(`COMMENT ON COLUMN "activity"."from" IS 'The timestamp on which the activity starts'`);
        await queryRunner.query(`COMMENT ON COLUMN "activity"."to" IS 'The timestamp on which the activity ends'`);
        await queryRunner.query(`COMMENT ON COLUMN "activity"."breakMins" IS 'Break time during this task in minutes'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "activity"."breakMins" IS 'Break time in minutes during this tasks'`);
        await queryRunner.query(`COMMENT ON COLUMN "activity"."to" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "activity"."from" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "task"."open" IS NULL`);
    }

}
