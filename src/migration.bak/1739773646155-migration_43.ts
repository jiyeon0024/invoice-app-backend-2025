import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration431739773646155 implements MigrationInterface {
  name = "Migration431739773646155";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // "items" 테이블 생성
    await queryRunner.query(`CREATE TABLE "items" (
            "id" SERIAL NOT NULL, 
            "name" character varying NOT NULL, 
            "quantity" integer NOT NULL, 
            "price" numeric NOT NULL, 
            "total" numeric NOT NULL, 
            "invoiceId" integer, 
            CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")
        )`);

    // "invoice" 테이블에서 불필요한 컬럼 삭제
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

    // "user" 테이블에서 "username" 컬럼 처리
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`
    );

    // "password" 컬럼의 속성 변경 (기존 컬럼이 있으면 수정)
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`
    );

    // "user" 테이블에서 "email" 컬럼 처리
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`
    );

    // "invoice" 테이블에서 "createdAt" 컬럼 수정
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );

    // "items" 테이블과 "invoice" 테이블 외래키 제약조건 추가
    await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_a146908d664d571c4ce8e23749d" 
            FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // "invoice" 테이블에 외래키 제약조건 추가
    await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_f01ef3072068d2bf9834b9ff314" 
            FOREIGN KEY ("clientEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 다운 마이그레이션 (rollback) 과정
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

    // "user" 테이블에서 "email" 컬럼 수정
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`
    );

    // "password" 컬럼의 기본값을 설정 (기존 컬럼에 기본값 설정)
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET DEFAULT 'default_password'`
    );

    // "user" 테이블에서 "username" 컬럼 처리
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`
    );

    // "invoice" 테이블에 컬럼 복구
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

    // "items" 테이블 삭제
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
