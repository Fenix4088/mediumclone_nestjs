import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection71689522280491 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection71689522280491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-16T15:44:41.917Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-16T15:44:41.917Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-14 20:22:48.556'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-14 20:22:48.556'`);
    }

}
