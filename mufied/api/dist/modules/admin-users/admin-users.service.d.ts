import { FirebaseService } from 'src/core/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AdminUsersService {
    private readonly firebase;
    constructor(firebase: FirebaseService);
    login(username: string, password: string): Promise<{
        token: string;
        user: {
            username: string;
            role: "admin";
        };
    }>;
    validateSession(token: string): Promise<{
        username: string;
        role: "mentor" | "student" | "admin";
    }>;
    listUsers(): Promise<{
        items: {
            username: string;
            role: "mentor" | "student" | "admin";
            createdAt: string;
            createdBy: string;
        }[];
        updatedAt: string;
    }>;
    createUser(dto: CreateUserDto, createdBy: string): Promise<{
        message: string;
        user: {
            username: string;
            role: "mentor" | "student" | "admin";
            createdAt: string;
            createdBy: string;
        };
    }>;
    ensureDefaultAdminExists(): Promise<void>;
    private getStoredUser;
    private normalizeUsername;
    private hashPassword;
    private verifyPassword;
    private hashToken;
}
