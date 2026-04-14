import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AdminUsersService } from './admin-users.service';

type AuthenticatedRequest = Request & {
  adminUser?: {
    username: string;
    role: string;
  };
};

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    const adminUser = await this.adminUsersService.validateSession(token);

    request.adminUser = adminUser;
    return true;
  }
}
