import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskNameIndex1615129482207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create index task_name_idx on task (name) where deleted is null and finished is null;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
