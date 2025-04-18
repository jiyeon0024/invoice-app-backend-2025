import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11740808605233 implements MigrationInterface {
  name = "Migration11740808605233";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // User 테이블 생성
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);

    // Invoice 테이블 생성
    await queryRunner.query(`
            CREATE TABLE "invoice" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "paymentDue" character varying NOT NULL,
                "description" character varying NOT NULL,
                "paymentTerms" integer NOT NULL,
                "clientName" character varying NOT NULL,
                "status" character varying,
                "senderAddress" json NOT NULL,
                "clientAddress" json NOT NULL,
                "total" decimal NOT NULL,
                "clientEmail" character varying NOT NULL,
                CONSTRAINT "PK_invoice" PRIMARY KEY ("id")
            )
        `);

    // Item 테이블 생성
    await queryRunner.query(`
            CREATE TABLE "item" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" decimal NOT NULL,
                "total" decimal NOT NULL,
                "invoiceId" integer,
                "tempColumn" character varying,
                CONSTRAINT "PK_item" PRIMARY KEY ("id"),
                CONSTRAINT "FK_item_invoice" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백 시 각 테이블을 삭제
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
