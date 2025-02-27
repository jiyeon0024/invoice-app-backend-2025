import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration511739859272313 implements MigrationInterface {
    name = 'Migration511739859272313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "fk_invoice"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "invoiceid"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentdue"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentterms"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "clientname"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "senderaddress"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "clientaddress"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "clientemail"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "unique_email"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "createdAt" character varying NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "unique_email" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "clientemail" character varying`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "clientaddress" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "senderaddress" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "clientname" character varying NOT NULL DEFAULT 'Unknown Client'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentterms" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentdue" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "item" ADD "invoiceid" integer`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "fk_invoice" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
