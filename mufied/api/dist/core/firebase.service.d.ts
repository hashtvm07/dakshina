import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from 'src/config/config-service';
type FirebaseValue = Record<string, unknown> | string | number | boolean | null | FirebaseValue[] | {
    [key: string]: FirebaseValue;
};
export declare class FirebaseService implements OnModuleInit {
    private readonly cfg;
    private readonly logger;
    private app;
    private database;
    private storage;
    private storageBucket;
    private initError;
    private corsConfigured;
    constructor(cfg: ConfigService);
    onModuleInit(): void;
    get<T>(dbPath: string): Promise<T | null>;
    set(dbPath: string, value: FirebaseValue): Promise<void>;
    list<T>(dbPath: string): Promise<Record<string, T>>;
    remove(dbPath: string): Promise<void>;
    nextSequence(dbPath: string): Promise<number>;
    uploadPublicFile(storagePath: string, content: Buffer, contentType: string, metadata?: Record<string, string>): Promise<string>;
    createSignedUploadUrl(storagePath: string, contentType: string, expiresInMinutes?: number): Promise<string>;
    publishUploadedFile(storagePath: string): Promise<string>;
    deletePublicFileByUrl(fileUrl: string): Promise<void>;
    isAvailable(): boolean;
    isStorageAvailable(): boolean;
    private sanitizeValue;
    private getServiceAccount;
    private normalizeServiceAccount;
    private ensureInitialized;
    private ensureStorageInitialized;
    resolveStorageBucket(): Promise<boolean>;
    private ensureBrowserUploadCors;
    private resolveBucketFilePath;
}
export {};
