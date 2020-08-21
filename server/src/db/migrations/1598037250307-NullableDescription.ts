import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableDescription1598037250307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table task alter column description type varchar(2048);
      alter table task alter description drop not null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
