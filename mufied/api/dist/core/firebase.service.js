"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const config_service_1 = require("../config/config-service");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    cfg;
    logger = new common_1.Logger(FirebaseService_1.name);
    app;
    database;
    storage = null;
    storageBucket = null;
    initError = null;
    corsConfigured = false;
    constructor(cfg) {
        this.cfg = cfg;
    }
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
                : admin.initializeApp({
                    credential: admin.credential.cert(this.getServiceAccount()),
                    databaseURL: databaseUrl,
                    storageBucket: storageBucket || undefined,
                }, appName);
            this.database = admin.database(this.app);
            this.storage = admin.storage(this.app);
            this.storageBucket = storageBucket ? this.storage.bucket(storageBucket) : null;
            this.initError = null;
        }
        catch (error) {
            this.initError = error instanceof Error ? error.message : 'Unknown Firebase initialization error.';
            this.logger.warn(`Firebase disabled: ${this.initError}`);
        }
    }
    async get(dbPath) {
        this.ensureInitialized();
        try {
            const snapshot = await this.database.ref(dbPath).get();
            return snapshot.exists() ? snapshot.val() : null;
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async set(dbPath, value) {
        this.ensureInitialized();
        try {
            await this.database.ref(dbPath).set(this.sanitizeValue(value));
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase write failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async list(dbPath) {
        this.ensureInitialized();
        try {
            const snapshot = await this.database.ref(dbPath).get();
            return snapshot.exists() ? snapshot.val() : {};
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase list read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async remove(dbPath) {
        this.ensureInitialized();
        try {
            await this.database.ref(dbPath).remove();
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase delete failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async nextSequence(dbPath) {
        this.ensureInitialized();
        try {
            const result = await this.database.ref(dbPath).transaction((currentValue) => typeof currentValue === 'number' ? currentValue + 1 : 1);
            if (!result.committed) {
                throw new common_1.InternalServerErrorException('Unable to generate the next application number.');
            }
            return result.snapshot.val();
        }
        catch (error) {
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.ServiceUnavailableException(`Firebase sequence update failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async uploadPublicFile(storagePath, content, contentType, metadata) {
        this.ensureStorageInitialized();
        try {
            const target = this.storageBucket.file(storagePath);
            await target.save(content, {
                resumable: false,
                metadata: {
                    contentType,
                    cacheControl: 'public, max-age=3600',
                    metadata,
                },
            });
            await target.makePublic();
            return `https://storage.googleapis.com/${this.storageBucket.name}/${encodeURI(storagePath)}`;
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase storage upload failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async createSignedUploadUrl(storagePath, contentType, expiresInMinutes = 20) {
        this.ensureStorageInitialized();
        await this.ensureBrowserUploadCors();
        try {
            const target = this.storageBucket.file(storagePath);
            const [signedUrl] = await target.getSignedUrl({
                version: 'v4',
                action: 'write',
                expires: Date.now() + expiresInMinutes * 60 * 1000,
                contentType,
            });
            return signedUrl;
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase signed upload URL failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async publishUploadedFile(storagePath) {
        this.ensureStorageInitialized();
        try {
            const target = this.storageBucket.file(storagePath);
            const [exists] = await target.exists();
            if (!exists) {
                throw new common_1.InternalServerErrorException('The uploaded file was not found in storage.');
            }
            await target.makePublic();
            return `https://storage.googleapis.com/${this.storageBucket.name}/${encodeURI(storagePath)}`;
        }
        catch (error) {
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.ServiceUnavailableException(`Firebase storage publish failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    async deletePublicFileByUrl(fileUrl) {
        if (!this.storageBucket || !fileUrl) {
            return;
        }
        const filePath = this.resolveBucketFilePath(fileUrl);
        if (!filePath) {
            return;
        }
        try {
            await this.storageBucket.file(filePath).delete({ ignoreNotFound: true });
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`Firebase storage delete failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    isAvailable() {
        return Boolean(this.database);
    }
    isStorageAvailable() {
        return Boolean(this.storageBucket);
    }
    sanitizeValue(value) {
        if (Array.isArray(value)) {
            return value
                .filter((entry) => entry !== undefined)
                .map((entry) => this.sanitizeValue(entry));
        }
        if (value && typeof value === 'object') {
            return Object.fromEntries(Object.entries(value)
                .filter(([, entry]) => entry !== undefined)
                .map(([key, entry]) => [key, this.sanitizeValue(entry)]));
        }
        return value;
    }
    getServiceAccount() {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || this.cfg.firebase?.serviceAccountPath;
        const projectId = process.env.FIREBASE_PROJECT_ID || this.cfg.firebase?.projectId;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || this.cfg.firebase?.clientEmail;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY || this.cfg.firebase?.privateKey;
        if (serviceAccountPath) {
            const resolvedPath = path.isAbsolute(serviceAccountPath)
                ? serviceAccountPath
                : path.resolve(process.cwd(), serviceAccountPath);
            if (fs.existsSync(resolvedPath)) {
                const raw = fs.readFileSync(resolvedPath, 'utf8');
                const serviceAccount = JSON.parse(raw);
                return this.normalizeServiceAccount(serviceAccount);
            }
            if (!projectId || !clientEmail || !privateKey) {
                throw new Error(`Firebase service account file not found at ${resolvedPath}. Configure the file or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.`);
            }
        }
        if (!projectId || !clientEmail || !privateKey) {
            throw new Error('Firebase Admin credentials are not configured. Set serviceAccountPath or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
        }
        return this.normalizeServiceAccount({
            project_id: projectId,
            client_email: clientEmail,
            private_key: privateKey,
        });
    }
    normalizeServiceAccount(serviceAccount) {
        if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
            throw new Error('Firebase service account is missing project_id, client_email, or private_key.');
        }
        return {
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
        };
    }
    ensureInitialized() {
        if (!this.database) {
            throw new common_1.ServiceUnavailableException(this.initError || 'Firebase is not initialized.');
        }
    }
    ensureStorageInitialized() {
        this.ensureInitialized();
        if (!this.storageBucket) {
            throw new common_1.ServiceUnavailableException(this.initError || 'Firebase storage is not configured.');
        }
    }
    async resolveStorageBucket() {
        this.ensureInitialized();
        if (this.storageBucket) {
            return true;
        }
        if (!this.storage) {
            return false;
        }
        const explicitBucket = this.cfg.firebase?.storageBucket?.trim();
        const projectId = this.app?.options?.projectId ||
            this.cfg.firebase?.projectId ||
            process.env.FIREBASE_PROJECT_ID ||
            '';
        const candidates = [
            explicitBucket,
            projectId ? `${projectId}.firebasestorage.app` : '',
            projectId ? `${projectId}.appspot.com` : '',
        ].filter((value, index, list) => Boolean(value) && list.indexOf(value) === index);
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
            }
            catch (error) {
                this.logger.warn(`Unable to validate storage bucket ${bucketName}: ${error instanceof Error ? error.message : 'unknown error'}`);
            }
        }
        this.initError =
            'Firebase storage is not configured. Set FIREBASE_STORAGE_BUCKET on the server or use the default Firebase bucket for this project.';
        return false;
    }
    async ensureBrowserUploadCors() {
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
        }
        catch (error) {
            this.logger.warn(`Unable to update bucket CORS automatically: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    resolveBucketFilePath(fileUrl) {
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
        }
        catch {
            return null;
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map