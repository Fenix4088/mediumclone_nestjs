import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentAuthorConnection41689365273886 implements MigrationInterface {
    name = 'AddedCommentAuthorConnection41689365273886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '"2023-07-14T20:07:55.251Z"'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2023-07-14T20:07:55.251Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "updatedAt" SET DEFAULT '2023-07-14 19:57:00.774'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT '2023-07-14 19:57:00.774'`);
    }

}
