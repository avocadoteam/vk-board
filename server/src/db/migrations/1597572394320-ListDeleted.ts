import { MigrationInterface, QueryRunner } from 'typeorm';

export class ListDeleted1597572394320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table list add column deleted timestamp default now();
      alter table list alter deleted drop default;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
