import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { LoginDto } from './dto/login.dto';
import { AdminSessionGuard } from './admin-session.guard';
import { AdminUser } from './admin-user.decorator';

@Controller('api/admin/auth')
export class AdminAuthController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.adminUsersService.login(dto.username, dto.password);
  }

  @UseGuards(AdminSessionGuard)
  @Get('me')
  me(@AdminUser() adminUser: { username: string; role: string }) {
    return { user: adminUser };
  }
}
