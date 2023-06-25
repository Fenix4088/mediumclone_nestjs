import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsBetweenArticleAndUserJoinColumn1687690007187 implements MigrationInterface {
    name = 'AddRelationsBetweenArticleAndUserJoinColumn1687690007187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "authorId" TO "author"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_79baa8f63b0876df6194e326427" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_79baa8f63b0876df6194e326427"`);
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "author" TO "authorId"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
