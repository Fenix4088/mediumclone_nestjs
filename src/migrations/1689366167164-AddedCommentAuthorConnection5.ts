import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection51689366167164 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection51689366167164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-14T20:22:48.556Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-14T20:22:48.556Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-14 20:07:55.251'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-14 20:07:55.251'`);
    }

}
