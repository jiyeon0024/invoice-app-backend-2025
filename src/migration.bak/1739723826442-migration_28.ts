import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration281739723826442 implements MigrationInterface {
  name = "Migration281739723826442";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 패스워드 컬럼이 이미 존재할 경우, 해당 컬럼을 NOT NULL로 변경하기 전에 null 값을 처리
    await queryRunner.query(`
      UPDATE "user" 
      SET "password" = '' 
      WHERE "password" IS NULL;
    `);

    // 패스워드 컬럼이 존재하는지 확인 후, 없으면 추가, 이미 있으면 NOT NULL 제약 추가
    const columnExists = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user' AND column_name = 'password';
    `);

    if (columnExists.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "user" 
        ADD COLUMN "password" character varying NOT NULL DEFAULT '';
      `);
    } else {
      await queryRunner.query(`
        ALTER TABLE "user" 
        ALTER COLUMN "password" SET NOT NULL;
      `);
    }

    // 나머지 테이블 및 컬럼 변경
    await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "fk_invoice"`);
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
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "invoiceid"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "name" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 패스워드 컬럼을 삭제하려면 'down'에서 기존 컬럼을 삭제
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);

    // 나머지 테이블 및 컬럼 원복
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_67e5ec3f9c69c91c3f444d8bb6c"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314"`
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "name" character varying(255) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" character varying NOT NULL DEFAULT CURRENT_TIMESTAMP`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(255) NULL`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "item" ADD "invoiceid" integer`);
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
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "fk_invoice" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
