import { MigrationInterface, QueryRunner } from 'typeorm';

export class BasicLists1597517483713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      insert into list (name, created, created_by)
        values 
          ('Основное', now(), 11437372),
          ('Второстепенное', now(), 11437372),
          ('Что-то ещё', now(), 11437372);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
