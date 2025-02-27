import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration301739770697801 implements MigrationInterface {
  name = "Migration301739770697801";

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // 기존 username 컬럼에 NULL 값이 있다면 기본값 설정
    await queryRunner.query(
      `UPDATE "user" SET "username" = 'default_user' WHERE "username" IS NULL`
    );

    // username 컬럼을 NOT NULL로 변경
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`
    );

    // password 컬럼이 이미 존재한다면, 기존 컬럼의 수정만 진행
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" TYPE character varying NOT NULL`
    );

    // 기존 password 컬럼에 대한 기본값 제거
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT`
    );

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`
    );
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
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`
    );

    // password 컬럼의 기본값을 다시 설정
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET DEFAULT ''`
    );

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`
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
  }
}
