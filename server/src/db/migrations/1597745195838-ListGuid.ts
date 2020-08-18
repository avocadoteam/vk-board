import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListGuid1597745195838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      alter table list add column listguid uuid default uuid_generate_v4();
      alter table list alter listguid drop default;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
