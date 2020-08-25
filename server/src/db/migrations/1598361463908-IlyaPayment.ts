import { MigrationInterface, QueryRunner } from 'typeorm';

export class IlyaPayment1598361463908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        update payment set amount = 228::text where user_id = 245481845;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
