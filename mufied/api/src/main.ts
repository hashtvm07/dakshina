import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config-service';
import { loadEnvFile } from './config/load-env';
import * as express from 'express';

async function bootstrap() {
  loadEnvFile();
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = Number(process.env.PORT || config.server?.port || 8080);

  app.enableCors({
    origin: config.cors?.origins ?? ['*'],
  });
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
}
bootstrap();
