import { MigrationInterface, QueryRunner } from "typeorm";

export class name1674798337098 implements MigrationInterface {
    name = 'name1674798337098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_8abad5fb430218ef8af88a034f2"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstLogin"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstScore"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstAnswers"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondLogin"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondScore"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondAnswers"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "correctAnswers"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstPlayerLogin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstPlayerScore" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstPlayerAnswers" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondPlayerLogin" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondPlayerScore" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondPlayerAnswers" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "questions" json`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_8abad5fb430218ef8af88a034f2" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1" FOREIGN KEY ("secondPlayerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_8abad5fb430218ef8af88a034f2"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "questions"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondPlayerAnswers"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondPlayerScore"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "secondPlayerLogin"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstPlayerAnswers"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstPlayerScore"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "firstPlayerLogin"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "correctAnswers" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondAnswers" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondScore" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "secondLogin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstAnswers" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstScore" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "firstLogin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1" FOREIGN KEY ("secondPlayerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_8abad5fb430218ef8af88a034f2" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
