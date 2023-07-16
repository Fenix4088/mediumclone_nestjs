import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection31689364364870 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection31689364364870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "author" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-14T19:52:46.180Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-14T19:52:46.180Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_af666e17be0789c3be94b77e8aa" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_af666e17be0789c3be94b77e8aa"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-14 19:29:35.151'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-14 19:29:35.151'`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "author"`);
    }

}
