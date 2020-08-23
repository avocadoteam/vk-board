import { MigrationInterface, QueryRunner } from 'typeorm';

export class GList1598163513782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists g_list cascade;

      create table if not exists g_list (
        g_list_id text not null,
        list_id int4 not null,
        primary key (g_list_id)
      );

      select schema_create_fk_constraint('g_list', 'list_id', 'list', 'id');
      create index g_list_list_id_idx on g_list (list_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
