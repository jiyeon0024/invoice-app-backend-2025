import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration501739775658018 implements MigrationInterface {
  name = "Migration501739775658018";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 'items' 테이블 생성
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "total" numeric NOT NULL, "invoiceId" integer, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`
    );

    // 'invoice' 테이블에서 불필요한 컬럼 삭제 (컬럼이 존재하는지 확인)
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "paymentdue"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "paymentterms"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "clientname"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "senderaddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "clientaddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN IF EXISTS "clientemail"`
    );

    // 'createdAt' 컬럼 기본값을 수정, 만약 컬럼이 존재하면 기본값만 수정
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice' AND column_name = 'createdAt') THEN
          ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now();
        END IF;
      END;
      $$;
    `);

    // 'items' 테이블과 'invoice' 테이블 간의 외래 키 제약조건 추가
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_a146908d664d571c4ce8e23749d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    // 'invoice' 테이블에 외래 키 제약조건 추가 (clientEmail 컬럼이 없으면 추가)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice' AND column_name = 'clientEmail') THEN
          ALTER TABLE "invoice" ADD "clientEmail" character varying;
        END IF;
      END;
      $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 외래 키 제약조건 삭제
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314"`
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_a146908d664d571c4ce8e23749d"`
    );

    // 'invoice' 테이블에서 컬럼 삭제 및 원래 값 복원
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" character varying NOT NULL DEFAULT CURRENT_TIMESTAMP`
    );

    // 'invoice' 테이블에 컬럼 복원
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

    // 'items' 테이블 삭제
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
