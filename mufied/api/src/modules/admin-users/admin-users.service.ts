import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import { FirebaseService } from 'src/core/firebase.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';

type StoredAdminUser = {
  username: string;
  normalizedUsername: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  createdBy: string;
};

type AdminSession = {
  username: string;
  role: UserRole;
  createdAt: string;
};

const USERS_DB_PATH = 'adminUsers';
const SESSIONS_DB_PATH = 'adminSessions';
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

@Injectable()
export class AdminUsersService {
  constructor(private readonly firebase: FirebaseService) {}

  async login(username: string, password: string) {
    await this.ensureDefaultAdminExists();

    const user = await this.getStoredUser(username);

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin users can log in to the admin UI.');
    }

    const token = randomBytes(32).toString('hex');
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

  async validateSession(token: string) {
    if (!token) {
      throw new UnauthorizedException('Missing admin session token.');
    }

    const session = await this.firebase.get<AdminSession>(`${SESSIONS_DB_PATH}/${this.hashToken(token)}`);

    if (!session) {
      throw new UnauthorizedException('Admin session is invalid or expired.');
    }

    if (session.role !== 'admin') {
      throw new ForbiddenException('Only admin users can access the admin UI.');
    }

    const user = await this.getStoredUser(session.username);

    if (!user) {
      throw new UnauthorizedException('Admin user no longer exists.');
    }

    return {
      username: user.username,
      role: user.role,
    };
  }

  async listUsers() {
    await this.ensureDefaultAdminExists();
    const users = await this.firebase.list<StoredAdminUser>(USERS_DB_PATH);

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

  async createUser(dto: CreateUserDto, createdBy: string) {
    await this.ensureDefaultAdminExists();
    const normalizedUsername = this.normalizeUsername(dto.username);
    const existing = await this.firebase.get<StoredAdminUser>(`${USERS_DB_PATH}/${normalizedUsername}`);

    if (existing) {
      throw new BadRequestException('A user with this username already exists.');
    }

    const now = new Date().toISOString();
    const document: StoredAdminUser = {
      username: dto.username.trim(),
      normalizedUsername,
      passwordHash: this.hashPassword(dto.password),
      role: dto.role,
      createdAt: now,
      createdBy,
    };

    await this.firebase.set(`${USERS_DB_PATH}/${normalizedUsername}`, document as unknown as Record<string, unknown>);

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
    const users = await this.firebase.list<StoredAdminUser>(USERS_DB_PATH);
    const hasUsers = Object.keys(users).length > 0;

    if (hasUsers) {
      return;
    }

    const now = new Date().toISOString();
    const adminUser: StoredAdminUser = {
      username: DEFAULT_ADMIN_USERNAME,
      normalizedUsername: DEFAULT_ADMIN_USERNAME,
      passwordHash: this.hashPassword(DEFAULT_ADMIN_PASSWORD),
      role: 'admin',
      createdAt: now,
      createdBy: 'system',
    };

    await this.firebase.set(`${USERS_DB_PATH}/${DEFAULT_ADMIN_USERNAME}`, adminUser as unknown as Record<string, unknown>);
  }

  private async getStoredUser(username: string) {
    const normalizedUsername = this.normalizeUsername(username);
    return this.firebase.get<StoredAdminUser>(`${USERS_DB_PATH}/${normalizedUsername}`);
  }

  private normalizeUsername(username: string) {
    const normalized = username.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Username is required.');
    }

    if (!/^[a-z0-9._-]+$/.test(normalized)) {
      throw new BadRequestException('Username can only contain letters, numbers, dot, underscore, and hyphen.');
    }

    return normalized;
  }

  private hashPassword(password: string) {
    const trimmed = password.trim();
    if (!trimmed) {
      throw new BadRequestException('Password is required.');
    }

    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(trimmed, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, expectedHash] = storedHash.split(':');

    if (!salt || !expectedHash) {
      throw new InternalServerErrorException('Stored password hash is invalid.');
    }

    const candidateHash = scryptSync(password.trim(), salt, 64);
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (candidateHash.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(candidateHash, expectedBuffer);
  }

  private hashToken(token: string) {
    if (!token.trim()) {
      throw new NotFoundException('Admin session token is missing.');
    }

    return createHash('sha256').update(token).digest('hex');
  }
}
