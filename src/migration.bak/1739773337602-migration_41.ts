import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration411739773337602 implements MigrationInterface {
  name = "Migration411739773337602";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // "user" 테이블에 "password" 컬럼을 NOT NULL로 추가하고 기본값 설정
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying DEFAULT 'default_password'`
    );

    // 기존에 "password"가 null인 레코드를 기본값으로 업데이트
    await queryRunner.query(
      `UPDATE "user" SET "password" = 'default_password' WHERE "password" IS NULL`
    );

    // "password" 컬럼을 NOT NULL로 변경
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`
    );

    // "items" 테이블 추가
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "total" numeric NOT NULL, "invoiceId" integer, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`
    );

    // "invoice" 테이블에서 불필요한 컬럼 제거
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

    // "user" 테이블에서 "username" 컬럼 재설정
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`
    );

    // "user" 테이블에서 "email" 컬럼 재설정
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`
    );

    // "invoice" 테이블에서 "createdAt" 컬럼 수정
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );

    // 외래 키 추가
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_a146908d664d571c4ce8e23749d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // down 메소드에서는 위에서 한 작업을 되돌립니다.
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
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
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
