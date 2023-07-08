import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB21688217654632 implements MigrationInterface {
  name = 'SeedDB21688217654632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('nestjs'), ('cofee')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
