import { MigrationInterface, QueryRunner } from "typeorm";

export class name1674619085223 implements MigrationInterface {
    name = 'name1674619085223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" SERIAL NOT NULL, "tokenId" character varying NOT NULL, "deviceId" character varying NOT NULL, "userId" character varying NOT NULL, "issuedAt" character varying NOT NULL, "expiresIn" character varying NOT NULL, "ip" character varying NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogBannedUsers" ("id" SERIAL NOT NULL, "blogId" character varying NOT NULL, "userId" character varying NOT NULL, "login" character varying COLLATE "C" NOT NULL, "createdAt" character varying NOT NULL, "banReason" character varying NOT NULL, CONSTRAINT "PK_400f79a526fba27d5757a6c6a62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "postLikes" ("id" SERIAL NOT NULL, "postId" character varying NOT NULL, "userId" character varying NOT NULL, "userLogin" character varying NOT NULL, "likeStatus" character varying NOT NULL, "addedAt" character varying NOT NULL, CONSTRAINT "PK_29f4abfe59a4ba82c8371037a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "commentLikes" ("id" SERIAL NOT NULL, "commentId" character varying NOT NULL, "userId" character varying NOT NULL, "likeStatus" character varying NOT NULL, CONSTRAINT "PK_1ce9352bedf70e23a403615d9b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" character varying NOT NULL, "postId" character varying NOT NULL, "content" character varying NOT NULL, "userId" character varying NOT NULL, "userLogin" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" character varying NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "shortDescription" character varying NOT NULL, "blogId" character varying NOT NULL, "blogName" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" character varying NOT NULL, "name" character varying COLLATE "C" NOT NULL, "websiteUrl" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" character varying NOT NULL, "userId" character varying, "userLogin" character varying NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "banDate" character varying, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" character varying NOT NULL, "confirmationCode" character varying NOT NULL, "isEmailConfirmed" boolean NOT NULL, "recoveryCode" character varying NOT NULL, "isRecoveryCodeConfirmed" boolean NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "banDate" character varying, "banReason" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" character varying NOT NULL, "body" character varying COLLATE "C" NOT NULL, "correctAnswers" json NOT NULL, "published" boolean NOT NULL DEFAULT false, "createdAt" character varying NOT NULL, "updatedAt" character varying, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogBannedUsers" ADD CONSTRAINT "FK_e1563acb658aca7bf09ad63a492" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogBannedUsers" ADD CONSTRAINT "FK_578b8e3201ae681086de3680fb9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postLikes" ADD CONSTRAINT "FK_26b3ed62ec22e48b9be15663ab0" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postLikes" ADD CONSTRAINT "FK_d3a2b7367faf9b6bcf2428a2883" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentLikes" ADD CONSTRAINT "FK_fe6e01cc43c0e5b920055d47b64" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commentLikes" ADD CONSTRAINT "FK_6033b505c173866759868b4445c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_50205032574e0b039d655f6cfd3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_50205032574e0b039d655f6cfd3"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "commentLikes" DROP CONSTRAINT "FK_6033b505c173866759868b4445c"`);
        await queryRunner.query(`ALTER TABLE "commentLikes" DROP CONSTRAINT "FK_fe6e01cc43c0e5b920055d47b64"`);
        await queryRunner.query(`ALTER TABLE "postLikes" DROP CONSTRAINT "FK_d3a2b7367faf9b6bcf2428a2883"`);
        await queryRunner.query(`ALTER TABLE "postLikes" DROP CONSTRAINT "FK_26b3ed62ec22e48b9be15663ab0"`);
        await queryRunner.query(`ALTER TABLE "blogBannedUsers" DROP CONSTRAINT "FK_578b8e3201ae681086de3680fb9"`);
        await queryRunner.query(`ALTER TABLE "blogBannedUsers" DROP CONSTRAINT "FK_e1563acb658aca7bf09ad63a492"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "commentLikes"`);
        await queryRunner.query(`DROP TABLE "postLikes"`);
        await queryRunner.query(`DROP TABLE "blogBannedUsers"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
