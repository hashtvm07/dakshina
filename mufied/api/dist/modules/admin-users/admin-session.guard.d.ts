import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
export declare class AdminSessionGuard implements CanActivate {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
