import { MigrationInterface, QueryRunner } from "typeorm";

export class name1674644576323 implements MigrationInterface {
    name = 'name1674644576323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_8abad5fb430218ef8af88a034f2"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_8abad5fb430218ef8af88a034f2" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_8abad5fb430218ef8af88a034f2"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_8abad5fb430218ef8af88a034f2" FOREIGN KEY ("firstPlayerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
