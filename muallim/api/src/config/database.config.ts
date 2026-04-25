import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { College } from '../colleges/entities/college.entity';
import { Muallim } from '../muallims/entities/muallim.entity';
import { ContentBlock } from '../site/entities/content-block.entity';
import { MediaAsset } from '../site/entities/media-asset.entity';
import { SiteSettings } from '../site/entities/site-settings.entity';
import { User } from '../users/entities/user.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';

const DEFAULT_DEV_DB_HOST = '127.0.0.1';
const DEFAULT_DB_PORT = 5432;
const DEFAULT_DB_USER = 'postgres';
const DEFAULT_DB_NAME = 'muallim_portal';

function getNumberConfig(
  configService: ConfigService,
  key: string,
  fallback: number,
): number {
  const rawValue = configService.get<string>(key);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function getBooleanConfig(
  configService: ConfigService,
  key: string,
  fallback: boolean,
): boolean {
  const rawValue = configService.get<string>(key);

  if (!rawValue) {
    return fallback;
  }

  return rawValue === 'true';
}

export function createDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const isManagedRuntime =
    configService.get<string>('NODE_ENV') === 'production' ||
    Boolean(configService.get<string>('K_SERVICE')) ||
    Boolean(configService.get<string>('K_REVISION')) ||
    Boolean(configService.get<string>('GOOGLE_CLOUD_PROJECT'));
  const databaseUrl = configService.get<string>('DATABASE_URL')?.trim();
  const dbSocketPath = configService.get<string>('DB_SOCKET_PATH')?.trim();
  const dbHost = configService.get<string>('DB_HOST')?.trim();
  const dbPort = getNumberConfig(configService, 'DB_PORT', DEFAULT_DB_PORT);
  const sslEnabled = getBooleanConfig(configService, 'DB_SSL', false);

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    entities: [User, Muallim, SiteSettings, ContentBlock, MediaAsset, College, Vacancy],
    synchronize: getBooleanConfig(configService, 'DB_SYNC', true),
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    retryAttempts: isManagedRuntime ? 3 : 10,
    retryDelay: isManagedRuntime ? 1000 : 3000,
  };

  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
    };
  }

  const resolvedHost = dbSocketPath || dbHost;

  if (!resolvedHost && isManagedRuntime) {
    throw new Error(
      'Database configuration is missing. Set DATABASE_URL, DB_HOST, or DB_SOCKET_PATH before starting the API in production.',
    );
  }

  return {
    ...baseConfig,
    host: resolvedHost || DEFAULT_DEV_DB_HOST,
    port: dbPort,
    username: configService.get<string>('DB_USERNAME', DEFAULT_DB_USER),
    password: configService.get<string>('DB_PASSWORD', DEFAULT_DB_USER),
    database: configService.get<string>('DB_NAME', DEFAULT_DB_NAME),
  };
}
