import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBreaktime1680163968689 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user"
                                 (
                                     "id"    character varying NOT NULL,
                                     "email" character varying NOT NULL,
                                     "name"  character varying NOT NULL,
                                     CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "task"
                                 (
                                     "id"             character varying NOT NULL,
                                     "title"          character varying NOT NULL,
                                     "note_mandatory" boolean           NOT NULL,
                                     "open"           boolean           NOT NULL,
                                     CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "activity"
                                 (
                                     "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                     "from"         TIMESTAMP WITH TIME ZONE,
                                     "to"           TIMESTAMP WITH TIME ZONE,
                                     "note"         character varying NOT NULL,
                                     "private_note" character varying NOT NULL,
                                     "breakMins"    integer           NOT NULL DEFAULT '0',
                                     "userId"       character varying NOT NULL,
                                     "taskId"       character varying NOT NULL,
                                     CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "activity"
            ADD CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity"
            ADD CONSTRAINT "FK_2743f8990fde12f9586287eb09f" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('activity', 'breakMins');

        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_2743f8990fde12f9586287eb09f"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
