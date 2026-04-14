import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from 'src/config/config-service';

type FirebaseValue =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | FirebaseValue[]
  | { [key: string]: FirebaseValue };

type ServiceAccountShape = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app!: admin.app.App;
  private database!: admin.database.Database;
  private storage: admin.storage.Storage | null = null;
  private storageBucket: any = null;
  private initError: string | null = null;
  private corsConfigured = false;

  constructor(private readonly cfg: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.cfg.firebase?.databaseUrl;
    const storageBucket = this.cfg.firebase?.storageBucket;

    if (!databaseUrl) {
      this.initError = 'Firebase databaseUrl is not configured.';
      this.logger.warn(this.initError);
      return;
    }

    try {
      const appName = 'mannaniyya-admission-api';
      const existingApp = admin.apps.find((app) => app?.name === appName);

      this.app = existingApp
        ? admin.app(appName)
        : admin.initializeApp(
            {
              credential: admin.credential.cert(this.getServiceAccount()),
              databaseURL: databaseUrl,
              storageBucket: storageBucket || undefined,
            },
            appName,
          );

      this.database = admin.database(this.app);
      this.storage = admin.storage(this.app);
      this.storageBucket = storageBucket ? this.storage.bucket(storageBucket) : null;
      this.initError = null;
    } catch (error) {
      this.initError = error instanceof Error ? error.message : 'Unknown Firebase initialization error.';
      this.logger.warn(`Firebase disabled: ${this.initError}`);
    }
  }

  async get<T>(dbPath: string): Promise<T | null> {
    this.ensureInitialized();

    try {
      const snapshot = await this.database.ref(dbPath).get();
      return snapshot.exists() ? (snapshot.val() as T) : null;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase read failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async set(dbPath: string, value: FirebaseValue): Promise<void> {
    this.ensureInitialized();

    try {
      await this.database.ref(dbPath).set(this.sanitizeValue(value));
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase write failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async list<T>(dbPath: string): Promise<Record<string, T>> {
    this.ensureInitialized();

    try {
      const snapshot = await this.database.ref(dbPath).get();
      return snapshot.exists() ? (snapshot.val() as Record<string, T>) : {};
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase list read failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async remove(dbPath: string): Promise<void> {
    this.ensureInitialized();

    try {
      await this.database.ref(dbPath).remove();
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase delete failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async nextSequence(dbPath: string): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.database.ref(dbPath).transaction((currentValue) =>
        typeof currentValue === 'number' ? currentValue + 1 : 1,
      );

      if (!result.committed) {
        throw new InternalServerErrorException('Unable to generate the next application number.');
      }

      return result.snapshot.val() as number;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        `Firebase sequence update failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async uploadPublicFile(
    storagePath: string,
    content: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    this.ensureStorageInitialized();

    try {
      const target = this.storageBucket!.file(storagePath);
      await target.save(content, {
        resumable: false,
        metadata: {
          contentType,
          cacheControl: 'public, max-age=3600',
          metadata,
        },
      });
      await target.makePublic();
      return `https://storage.googleapis.com/${this.storageBucket!.name}/${encodeURI(storagePath)}`;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase storage upload failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async createSignedUploadUrl(
    storagePath: string,
    contentType: string,
    expiresInMinutes = 20,
  ): Promise<string> {
    this.ensureStorageInitialized();
    await this.ensureBrowserUploadCors();

    try {
      const target = this.storageBucket!.file(storagePath);
      const [signedUrl] = await target.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
        contentType,
      });
      return signedUrl;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase signed upload URL failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async publishUploadedFile(storagePath: string): Promise<string> {
    this.ensureStorageInitialized();

    try {
      const target = this.storageBucket!.file(storagePath);
      const [exists] = await target.exists();
      if (!exists) {
        throw new InternalServerErrorException('The uploaded file was not found in storage.');
      }

      await target.makePublic();
      return `https://storage.googleapis.com/${this.storageBucket!.name}/${encodeURI(storagePath)}`;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        `Firebase storage publish failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  async deletePublicFileByUrl(fileUrl: string): Promise<void> {
    if (!this.storageBucket || !fileUrl) {
      return;
    }

    const filePath = this.resolveBucketFilePath(fileUrl);
    if (!filePath) {
      return;
    }

    try {
      await this.storageBucket.file(filePath).delete({ ignoreNotFound: true });
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase storage delete failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  isAvailable(): boolean {
    return Boolean(this.database);
  }

  isStorageAvailable(): boolean {
    return Boolean(this.storageBucket);
  }

  private sanitizeValue(value: FirebaseValue): FirebaseValue {
    if (Array.isArray(value)) {
      return value
        .filter((entry) => entry !== undefined)
        .map((entry) => this.sanitizeValue(entry)) as FirebaseValue[];
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, entry]) => entry !== undefined)
          .map(([key, entry]) => [key, this.sanitizeValue(entry as FirebaseValue)]),
      ) as FirebaseValue;
    }

    return value;
  }

  private getServiceAccount(): admin.ServiceAccount {
    const serviceAccountPath =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || this.cfg.firebase?.serviceAccountPath;
    const projectId = process.env.FIREBASE_PROJECT_ID || this.cfg.firebase?.projectId;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || this.cfg.firebase?.clientEmail;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY || this.cfg.firebase?.privateKey;

    if (serviceAccountPath) {
      const resolvedPath = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.resolve(process.cwd(), serviceAccountPath);

      if (fs.existsSync(resolvedPath)) {
        const raw = fs.readFileSync(resolvedPath, 'utf8');
        const serviceAccount = JSON.parse(raw) as ServiceAccountShape;
        return this.normalizeServiceAccount(serviceAccount);
      }

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          `Firebase service account file not found at ${resolvedPath}. Configure the file or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.`,
        );
      }
    }

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Firebase Admin credentials are not configured. Set serviceAccountPath or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
      );
    }

    return this.normalizeServiceAccount({
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    });
  }

  private normalizeServiceAccount(serviceAccount: ServiceAccountShape) {
    if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error('Firebase service account is missing project_id, client_email, or private_key.');
    }

    return {
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    };
  }

  private ensureInitialized() {
    if (!this.database) {
      throw new ServiceUnavailableException(
        this.initError || 'Firebase is not initialized.',
      );
    }
  }

  private ensureStorageInitialized() {
    this.ensureInitialized();
    if (!this.storageBucket) {
      throw new ServiceUnavailableException(this.initError || 'Firebase storage is not configured.');
    }
  }

  async resolveStorageBucket(): Promise<boolean> {
    this.ensureInitialized();

    if (this.storageBucket) {
      return true;
    }

    if (!this.storage) {
      return false;
    }

    const explicitBucket = this.cfg.firebase?.storageBucket?.trim();
    const projectId =
      this.app?.options?.projectId ||
      this.cfg.firebase?.projectId ||
      process.env.FIREBASE_PROJECT_ID ||
      '';

    const candidates = [
      explicitBucket,
      projectId ? `${projectId}.firebasestorage.app` : '',
      projectId ? `${projectId}.appspot.com` : '',
    ].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index);

    for (const bucketName of candidates) {
      try {
        const bucket = this.storage.bucket(bucketName);
        const [exists] = await bucket.exists();
        if (exists) {
          this.storageBucket = bucket;
          this.initError = null;
          this.logger.log(`Using Firebase storage bucket: ${bucketName}`);
          return true;
        }
      } catch (error) {
        this.logger.warn(
          `Unable to validate storage bucket ${bucketName}: ${error instanceof Error ? error.message : 'unknown error'}`,
        );
      }
    }

    this.initError =
      'Firebase storage is not configured. Set FIREBASE_STORAGE_BUCKET on the server or use the default Firebase bucket for this project.';
    return false;
  }

  private async ensureBrowserUploadCors(): Promise<void> {
    if (!this.storageBucket || this.corsConfigured) {
      return;
    }

    try {
      await this.storageBucket.setCorsConfiguration([
        {
          maxAgeSeconds: 3600,
          method: ['GET', 'HEAD', 'PUT', 'POST', 'OPTIONS'],
          origin: ['*'],
          responseHeader: ['Content-Type', 'x-goog-resumable'],
        },
      ]);
      this.corsConfigured = true;
    } catch (error) {
      this.logger.warn(
        `Unable to update bucket CORS automatically: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  private resolveBucketFilePath(fileUrl: string): string | null {
    try {
      const parsed = new URL(fileUrl);
      if (parsed.hostname !== 'storage.googleapis.com') {
        return null;
      }

      const parts = parsed.pathname.split('/').filter(Boolean);
      if (!parts.length || parts[0] !== this.storageBucket?.name) {
        return null;
      }

      return decodeURIComponent(parts.slice(1).join('/'));
    } catch {
      return null;
    }
  }
}
