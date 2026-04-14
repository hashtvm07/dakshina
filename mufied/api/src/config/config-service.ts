import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly cfg: any;
  public readonly firebase: any;
  public readonly server: any;
  public readonly cors: any;

  constructor() {
    const file = path.join(process.cwd(), 'config', 'config.json');
    this.cfg = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    this.firebase = {
      ...this.get('firebase', {}),
      databaseUrl: process.env.FIREBASE_DATABASE_URL || this.get('firebase.databaseUrl', ''),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || this.get('firebase.storageBucket', ''),
      serviceAccountPath:
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH || this.get('firebase.serviceAccountPath', ''),
      projectId: process.env.FIREBASE_PROJECT_ID || this.get('firebase.projectId', ''),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || this.get('firebase.clientEmail', ''),
      privateKey: process.env.FIREBASE_PRIVATE_KEY || this.get('firebase.privateKey', ''),
    };
    this.server = {
      ...this.get('server', {}),
      port: Number(process.env.PORT || process.env.SERVER_PORT || this.get('server.port', 8080)),
    };
    this.cors = {
      ...this.get('cors', {}),
      origins: this.resolveCorsOrigins(),
    };
  }

  get<T = any>(lookupPath: string, fallback?: T): T {
    const value = lookupPath
      .split('.')
      .reduce<any>((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), this.cfg);
    return (value === undefined ? fallback : value) as T;
  }

  private resolveCorsOrigins(): string[] {
    const envOrigins = process.env.CORS_ORIGINS;
    const configOrigins = this.get<string[]>('cors.origins', ['*']);
    const normalizedConfigOrigins = Array.isArray(configOrigins)
      ? configOrigins.map((origin) => origin.trim()).filter(Boolean)
      : ['*'];

    if (envOrigins) {
      const parsedOrigins = envOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

      if (parsedOrigins.length) {
        return Array.from(new Set([...normalizedConfigOrigins, ...parsedOrigins]));
      }
    }

    return normalizedConfigOrigins.length ? normalizedConfigOrigins : ['*'];
  }
}
