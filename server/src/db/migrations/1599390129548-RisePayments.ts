import {MigrationInterface, QueryRunner} from "typeorm";

export class RisePayments1599390129548 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        update payment set amount = 228::text where amount = 1::text;
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
