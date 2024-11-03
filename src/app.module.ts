import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/orm.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ArticleModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
