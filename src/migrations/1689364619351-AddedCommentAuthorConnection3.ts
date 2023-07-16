import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection31689364619351 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection31689364619351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-14T19:57:00.774Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-14T19:57:00.774Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-14 19:52:46.18'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-14 19:52:46.18'`);
    }

}
