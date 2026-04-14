import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  app.enableCors();

  const webPath = join(__dirname, '..', 'public', 'web-ui');
  const adminPath = join(__dirname, '..', 'public', 'admin-ui');

  app.use('/web-ui', express.static(webPath));
  app.use('/admin-ui', express.static(adminPath));

  expressApp.get('/web-ui/*', (req, res) => {
    res.sendFile(join(webPath, 'index.html'));
  });

  expressApp.get('/admin-ui/*', (req, res) => {
    res.sendFile(join(adminPath, 'index.html'));
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
