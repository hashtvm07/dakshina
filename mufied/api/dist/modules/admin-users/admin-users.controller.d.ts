import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AdminUsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    listUsers(): Promise<{
        items: {
            username: string;
            role: "mentor" | "student" | "admin";
            createdAt: string;
            createdBy: string;
        }[];
        updatedAt: string;
    }>;
    createUser(dto: CreateUserDto, adminUser: {
        username: string;
    }): Promise<{
        message: string;
        user: {
            username: string;
            role: "mentor" | "student" | "admin";
            createdAt: string;
            createdBy: string;
        };
    }>;
}
