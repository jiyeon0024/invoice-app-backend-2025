import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration271739718360665 implements MigrationInterface {
    name = 'Migration271739718360665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "createdAt" character varying NOT NULL, "paymentDue" character varying NOT NULL, "description" character varying NOT NULL, "paymentTerms" integer NOT NULL, "clientName" character varying NOT NULL, "status" character varying NOT NULL, "senderAddress" json NOT NULL, "clientAddress" json NOT NULL, "total" numeric NOT NULL, "clientEmail" character varying, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "total" numeric NOT NULL, "invoiceId" integer, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
    }

}
