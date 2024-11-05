import { readFile } from 'node:fs/promises';
import { load } from 'js-yaml';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api');

  const rootDirname = dirname(__dirname);
  const docAPI = await readFile(join(rootDirname, 'swagger', 'api-docs.yml'), 'utf-8');
  SwaggerModule.setup('doc', app, load(docAPI));

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => console.log(`Server started on port ${port}`));

  process
    .on('unhandledRejection', (reason, p) => {
      console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (error) => {
      console.error(error, 'Uncaught Exception thrown');
      process.exit(1);
    });
}
bootstrap();
