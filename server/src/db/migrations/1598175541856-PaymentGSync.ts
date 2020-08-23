import { MigrationInterface, QueryRunner } from 'typeorm';

export class GListSync1598175541856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table payment add column last_g_sync timestamp;

      insert into payment (created, user_id, amount)
        values 
          (now(), 11437372, 228::text);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
