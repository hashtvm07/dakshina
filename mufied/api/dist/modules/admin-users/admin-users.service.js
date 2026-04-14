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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const firebase_service_1 = require("../../core/firebase.service");
const USERS_DB_PATH = 'adminUsers';
const SESSIONS_DB_PATH = 'adminSessions';
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';
let AdminUsersService = class AdminUsersService {
    firebase;
    constructor(firebase) {
        this.firebase = firebase;
    }
    async login(username, password) {
        await this.ensureDefaultAdminExists();
        const user = await this.getStoredUser(username);
        if (!user || !this.verifyPassword(password, user.passwordHash)) {
            throw new common_1.UnauthorizedException('Invalid username or password.');
        }
        if (user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admin users can log in to the admin UI.');
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const now = new Date().toISOString();
        await this.firebase.set(`${SESSIONS_DB_PATH}/${this.hashToken(token)}`, {
            username: user.username,
            role: user.role,
            createdAt: now,
        });
        return {
            token,
            user: {
                username: user.username,
                role: user.role,
            },
        };
    }
    async validateSession(token) {
        if (!token) {
            throw new common_1.UnauthorizedException('Missing admin session token.');
        }
        const session = await this.firebase.get(`${SESSIONS_DB_PATH}/${this.hashToken(token)}`);
        if (!session) {
            throw new common_1.UnauthorizedException('Admin session is invalid or expired.');
        }
        if (session.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admin users can access the admin UI.');
        }
        const user = await this.getStoredUser(session.username);
        if (!user) {
            throw new common_1.UnauthorizedException('Admin user no longer exists.');
        }
        return {
            username: user.username,
            role: user.role,
        };
    }
    async listUsers() {
        await this.ensureDefaultAdminExists();
        const users = await this.firebase.list(USERS_DB_PATH);
        return {
            items: Object.values(users)
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((user) => ({
                username: user.username,
                role: user.role,
                createdAt: user.createdAt,
                createdBy: user.createdBy,
            })),
            updatedAt: new Date().toISOString(),
        };
    }
    async createUser(dto, createdBy) {
        await this.ensureDefaultAdminExists();
        const normalizedUsername = this.normalizeUsername(dto.username);
        const existing = await this.firebase.get(`${USERS_DB_PATH}/${normalizedUsername}`);
        if (existing) {
            throw new common_1.BadRequestException('A user with this username already exists.');
        }
        const now = new Date().toISOString();
        const document = {
            username: dto.username.trim(),
            normalizedUsername,
            passwordHash: this.hashPassword(dto.password),
            role: dto.role,
            createdAt: now,
            createdBy,
        };
        await this.firebase.set(`${USERS_DB_PATH}/${normalizedUsername}`, document);
        return {
            message: 'User created successfully.',
            user: {
                username: document.username,
                role: document.role,
                createdAt: document.createdAt,
                createdBy: document.createdBy,
            },
        };
    }
    async ensureDefaultAdminExists() {
        const users = await this.firebase.list(USERS_DB_PATH);
        const hasUsers = Object.keys(users).length > 0;
        if (hasUsers) {
            return;
        }
        const now = new Date().toISOString();
        const adminUser = {
            username: DEFAULT_ADMIN_USERNAME,
            normalizedUsername: DEFAULT_ADMIN_USERNAME,
            passwordHash: this.hashPassword(DEFAULT_ADMIN_PASSWORD),
            role: 'admin',
            createdAt: now,
            createdBy: 'system',
        };
        await this.firebase.set(`${USERS_DB_PATH}/${DEFAULT_ADMIN_USERNAME}`, adminUser);
    }
    async getStoredUser(username) {
        const normalizedUsername = this.normalizeUsername(username);
        return this.firebase.get(`${USERS_DB_PATH}/${normalizedUsername}`);
    }
    normalizeUsername(username) {
        const normalized = username.trim().toLowerCase();
        if (!normalized) {
            throw new common_1.BadRequestException('Username is required.');
        }
        if (!/^[a-z0-9._-]+$/.test(normalized)) {
            throw new common_1.BadRequestException('Username can only contain letters, numbers, dot, underscore, and hyphen.');
        }
        return normalized;
    }
    hashPassword(password) {
        const trimmed = password.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Password is required.');
        }
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const hash = (0, crypto_1.scryptSync)(trimmed, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }
    verifyPassword(password, storedHash) {
        const [salt, expectedHash] = storedHash.split(':');
        if (!salt || !expectedHash) {
            throw new common_1.InternalServerErrorException('Stored password hash is invalid.');
        }
        const candidateHash = (0, crypto_1.scryptSync)(password.trim(), salt, 64);
        const expectedBuffer = Buffer.from(expectedHash, 'hex');
        if (candidateHash.length !== expectedBuffer.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(candidateHash, expectedBuffer);
    }
    hashToken(token) {
        if (!token.trim()) {
            throw new common_1.NotFoundException('Admin session token is missing.');
        }
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map