import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1730650002384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
        CREATE TABLE "user" (
          "userId" SERIAL PRIMARY KEY,
          "login" VARCHAR(32) NOT NULL UNIQUE,
          "name" VARCHAR(256) NOT NULL,
          "email" VARCHAR(128) NOT NULL,
          "password" VARCHAR(256) NOT NULL,
          "refreshToken" VARCHAR,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `);

      await queryRunner.query(`
        CREATE TABLE "article" (
          "articleId" SERIAL PRIMARY KEY,
          "title" VARCHAR NOT NULL,
          "content" TEXT NOT NULL,
          "date" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now(),
          "authorUserId" INT NOT NULL,
          CONSTRAINT "FK_authorUser" FOREIGN KEY ("authorUserId") REFERENCES "user"("userId") ON DELETE SET NULL
        );
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`DROP TABLE "article"`);
      await queryRunner.query(`DROP TABLE "user"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
