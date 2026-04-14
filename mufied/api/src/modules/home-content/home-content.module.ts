import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { HomeContentAdminController } from './home-content-admin.controller';
import { HomeContentController } from './home-content.controller';
import { HomeContentService } from './home-content.service';

@Module({
  imports: [CoreModule, AdminUsersModule],
  controllers: [HomeContentController, HomeContentAdminController],
  providers: [HomeContentService],
})
export class HomeContentModule {}
