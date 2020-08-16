import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListMemb1597571629429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists list_membership (
        id bigserial,
        joined timestamp not null,
        joined_id int8 not null,
        list_id int8 not null,
        primary key (id)
      );

      select schema_create_fk_constraint('list_membership', 'list_id', 'list', 'id');
      create index list_membership_list_id_idx on list_membership (list_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
