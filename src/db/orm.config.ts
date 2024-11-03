import { DataSource } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { InitialMigration1730650002384 } from 'src/db/migrations/1730650002384-InitialMigration';
import { SeedUserAndArticleData1730651382019 } from './migrations/1730651382019-SeedUserAndArticleData';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.LOCAL_HOST || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'qtim_api_db',
  entities: [User, Article],
  migrations: [InitialMigration1730650002384],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log('>>> Data Source has been initialized!');
    await AppDataSource.runMigrations();
    console.log('>>> Migrations have been run!');
  })
  .catch((err) => console.error('>>> Error during Data Source initialization:', err));
