import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection71689522517633 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection71689522517633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-16T15:48:39.097Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-16T15:48:39.097Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-16 15:44:41.917'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-16 15:44:41.917'`);
    }

}
