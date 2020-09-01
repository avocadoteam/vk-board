import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoTaskMember1598881569029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table task_membership;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
