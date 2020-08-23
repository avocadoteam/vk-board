import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskGTaskId1598170343635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table task add column g_task_id text, add column g_list_id text;

      select schema_create_fk_constraint('task', 'g_list_id', 'g_list', 'g_list_id');
      create index task_g_list_id_idx on task (g_list_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
