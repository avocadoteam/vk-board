import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentAmount1598127529476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table payment add column amount text not null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
