import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminSessionGuard } from './admin-session.guard';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [CoreModule],
  controllers: [AdminAuthController, AdminUsersController],
  providers: [AdminUsersService, AdminSessionGuard],
  exports: [AdminUsersService, AdminSessionGuard],
})
export class AdminUsersModule {}
