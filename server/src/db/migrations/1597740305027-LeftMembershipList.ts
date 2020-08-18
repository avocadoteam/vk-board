import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeftMembershipList1597740305027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table list_membership add column left_date timestamp, add column left_by int8;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
