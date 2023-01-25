import { MigrationInterface, QueryRunner } from "typeorm";

export class name1674644304729 implements MigrationInterface {
    name = 'name1674644304729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."games_status_enum" AS ENUM('PendingSecondPlayer', 'Active', 'Finished')`);
        await queryRunner.query(`CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstPlayerId" character varying NOT NULL, "firstLogin" character varying NOT NULL, "firstScore" integer NOT NULL DEFAULT '0', "firstAnswers" json NOT NULL, "secondPlayerId" character varying, "secondLogin" character varying NOT NULL, "secondScore" integer NOT NULL DEFAULT '0', "secondAnswers" json NOT NULL, "correctAnswers" json NOT NULL, "status" "public"."games_status_enum" NOT NULL DEFAULT 'PendingSecondPlayer', "pairCreatedDate" character varying NOT NULL, "startGameDate" character varying, "finishGameDate" character varying, "winnerId" character varying, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_8abad5fb430218ef8af88a034f2" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1" FOREIGN KEY ("secondPlayerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_e528275f53e8f4a97f1b2e7dfb8"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c2c349d15f2ae8e0aae83f044d1"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_8abad5fb430218ef8af88a034f2"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TYPE "public"."games_status_enum"`);
    }

}
