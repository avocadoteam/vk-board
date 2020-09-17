import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1598605452445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists notification (
        id bigserial,
        user_id int8 not null,
        vk_notification bool not null,
        tasks int8[],
        primary key (id)
      );

      create index notification_user_id_idx on notification (user_id);

      create or replace function array_diff(array1 anyarray, array2 anyarray)
      returns anyarray language sql immutable as $$
          select coalesce(array_agg(elem), '{}')
          from unnest(array1) elem
          where elem <> all(array2)
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
