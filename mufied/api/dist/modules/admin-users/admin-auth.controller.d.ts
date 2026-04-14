import { AdminUsersService } from './admin-users.service';
import { LoginDto } from './dto/login.dto';
export declare class AdminAuthController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            username: string;
            role: "admin";
        };
    }>;
    me(adminUser: {
        username: string;
        role: string;
    }): {
        user: {
            username: string;
            role: string;
        };
    };
}
