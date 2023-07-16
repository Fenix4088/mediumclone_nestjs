import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection21689362973859 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection21689362973859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2023-07-14T19:29:35.151Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2023-07-14T19:29:35.151Z"', "body" character varying NOT NULL, "article_id" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
