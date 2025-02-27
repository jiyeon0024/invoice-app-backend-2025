import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11739617894318 implements MigrationInterface {
    name = 'Migration11739617894318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
