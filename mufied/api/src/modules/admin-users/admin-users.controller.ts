import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminUser } from './admin-user.decorator';
import { AdminSessionGuard } from './admin-session.guard';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(AdminSessionGuard)
@Controller('api/admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  listUsers() {
    return this.adminUsersService.listUsers();
  }

  @Post()
  createUser(@Body() dto: CreateUserDto, @AdminUser() adminUser: { username: string }) {
    return this.adminUsersService.createUser(dto, adminUser.username);
  }
}
