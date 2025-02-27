import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration461739774009971 implements MigrationInterface {
  name = "Migration461739774009971";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // user 테이블이 이미 존재하는지 확인하고, 없으면 생성
    const userTableExist = await queryRunner.query(`
        SELECT to_regclass('public.user');
    `);

    if (!userTableExist[0].to_regclass) {
      // user 테이블이 없으면 생성
      await queryRunner.query(`CREATE TABLE "user" (
            "id" SERIAL NOT NULL, 
            "username" character varying NOT NULL, 
            "password" character varying NOT NULL, 
            "email" character varying NOT NULL, 
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )`);
    }

    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "total" numeric NOT NULL, "invoiceId" integer, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentdue"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentterms"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "clientname"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "senderaddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "clientaddress"`
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "clientemail"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_a146908d664d571c4ce8e23749d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314"`
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_a146908d664d571c4ce8e23749d"`
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" character varying NOT NULL DEFAULT CURRENT_TIMESTAMP`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "clientemail" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "clientaddress" json NOT NULL DEFAULT '{}'`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "senderaddress" json NOT NULL DEFAULT '{}'`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "clientname" character varying NOT NULL DEFAULT 'Unknown Client'`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "paymentterms" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "paymentdue" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
