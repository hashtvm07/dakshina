import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = Number(process.env.PORT ?? 3000);
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  app.enableCors();

  const webPath = join(__dirname, '..', 'public', 'web-ui');

  expressApp.get('/', (_req, res) => {
    res.json({
      name: 'muallim-api',
      status: 'starting',
      timestamp: new Date().toISOString(),
    });
  });

  if (existsSync(webPath)) {
    app.use('/web-ui', express.static(webPath));

    expressApp.get('/web-ui/*path', (_req, res) => {
      res.sendFile(join(webPath, 'index.html'));
    });

    expressApp.get('/admin-ui', (_req, res) => {
      res.redirect(301, '/web-ui/admin');
    });

    expressApp.get('/admin-ui/*path', (_req, res) => {
      res.redirect(301, '/web-ui/admin');
    });
  } else {
    logger.warn(`Web UI bundle not found at ${webPath}`);
  }

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
  logger.log(`HTTP server listening on 0.0.0.0:${port}`);
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  logger.error(`Application bootstrap failed: ${message}`);
  process.exit(1);
});
