import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1597486571466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists list (
        id serial,
        name varchar(512) not null,
        created timestamp not null,
        created_by int8,
        primary key (id)
      );

      create table if not exists task (
        id bigserial,
        taskguid uuid not null,
        name varchar(1024) not null,
        description varchar(1024) not null,
        created timestamp not null,
        created_by int8 not null,
        finished timestamp,
        deleted timestamp,
        due_date timestamp,
        list_id int4 not null,
        primary key (id)
      );
      
      create table if not exists task_membership (
        id bigserial,
        joined timestamp not null,
        joined_id int8 not null,
        task_id int8 not null,
        primary key (id)
      );
    `);

    await queryRunner.query(`
      create function schema_create_fk_constraint(table_name text, column_name text, foreign_table_name text, foreign_column_name text) returns void as $$
        declare sql_text text;
        begin sql_text := format ('alter table %s add constraint fk_%s_%s foreign key (%s) references %s(%s)',
                                  table_name, table_name, column_name, column_name, foreign_table_name, foreign_column_name); execute sql_text;
        end
      $$ language plpgsql;

      select schema_create_fk_constraint('task', 'list_id', 'list', 'id');
      select schema_create_fk_constraint('task_membership', 'task_id', 'task', 'id');
    `);

    await queryRunner.query(`
      create index task_membership_task_id_idx on task_membership (task_id);
      create index task_list_id_idx on task (list_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
