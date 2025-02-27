import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration131739624993519 implements MigrationInterface {
  name = "Migration131739624993519";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // "user" 테이블에 email 컬럼 추가 (NOT NULL은 제외)
    await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);

    // 기존 레코드에 email 값 채우기
    await queryRunner.query(
      `UPDATE "user" SET "email" = 'default@example.com' WHERE "email" IS NULL`
    );

    // 이제 email 컬럼을 NOT NULL로 설정
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`
    );

    // 고유 제약 조건 추가
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 다운 작업: 추가된 컬럼 및 제약조건 삭제
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
