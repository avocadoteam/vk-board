import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payments1598087718896 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists payment (
        id serial,
        created timestamp not null,
        user_id int8 not null,
        primary key (id)
      );

      create index payment_user_id_idx on payment (user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
