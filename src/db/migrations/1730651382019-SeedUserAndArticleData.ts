import { getHash } from '../../common/utils/hash.utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// ! **** удалить
export class SeedUserAndArticleData1730651382019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await getHash('55555');
    await queryRunner.query(`
      INSERT INTO "user" (login, name, email, password)
      VALUES 
      ('user1', 'Test User One', 'user1@example.com', '${password}'),
      ('user2', 'Test User Two', 'user2@example.com', '${password}'),
      ('user3', 'Test User Three', 'user3@example.com', '${password}');
    `);

    await queryRunner.query(`
      INSERT INTO "article" (title, content, date, "authorUserId")
      VALUES 
      ('Article 1', 'Content of Article 1', '2024-01-01', 1),
      ('Article 2', 'Content of Article 2', '2024-01-02', 1),
      ('Article 3', 'Content of Article 3', '2024-01-03', 1),
      ('Article 4', 'Content of Article 4', '2024-01-04', 1),
      
      ('Article 5', 'Content of Article 5', '2024-01-01', 2),
      ('Article 6', 'Content of Article 6', '2024-01-02', 2),
      ('Article 7', 'Content of Article 7', '2024-01-03', 2),
      ('Article 8', 'Content of Article 8', '2024-01-04', 2),
      
      ('Article 9', 'Content of Article 9', '2024-01-01', 3),
      ('Article 10', 'Content of Article 10', '2024-01-02', 3),
      ('Article 11', 'Content of Article 11', '2024-01-03', 3),
      ('Article 12', 'Content of Article 12', '2024-01-04', 3);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "article"`);
    await queryRunner.query(`DELETE FROM "user"`);
    await queryRunner.commitTransaction();
  }
}
