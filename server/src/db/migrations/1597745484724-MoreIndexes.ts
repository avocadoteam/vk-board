import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreIndexes1597745484724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create index list_list_guid_idx on list (listguid);
        create index list_created_by_idx on list (created_by);

        create index list_membership_joined_id_idx on list_membership (joined_id);

        create index task_created_by_idx on task (created_by);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
