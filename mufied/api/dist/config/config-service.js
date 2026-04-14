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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let ConfigService = class ConfigService {
    cfg;
    firebase;
    server;
    cors;
    constructor() {
        const file = path.join(process.cwd(), 'config', 'config.json');
        this.cfg = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
        this.firebase = {
            ...this.get('firebase', {}),
            databaseUrl: process.env.FIREBASE_DATABASE_URL || this.get('firebase.databaseUrl', ''),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || this.get('firebase.storageBucket', ''),
            serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || this.get('firebase.serviceAccountPath', ''),
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
    get(lookupPath, fallback) {
        const value = lookupPath
            .split('.')
            .reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), this.cfg);
        return (value === undefined ? fallback : value);
    }
    resolveCorsOrigins() {
        const envOrigins = process.env.CORS_ORIGINS;
        const configOrigins = this.get('cors.origins', ['*']);
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
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigService);
//# sourceMappingURL=config-service.js.map