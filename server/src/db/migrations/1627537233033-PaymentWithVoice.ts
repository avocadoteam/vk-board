import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentWithVoice1627537233033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table payment add column voices text default 50;
      alter table payment alter voices drop default;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
