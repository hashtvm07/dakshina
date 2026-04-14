import { Module } from '@nestjs/common';
import { ConfigService } from './config/config-service';
import { CoreModule } from './core/core.module';
import { AdmissionModule } from './modules/admission/admission.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { HomeContentModule } from './modules/home-content/home-content.module';

@Module({
  imports: [CoreModule, AdmissionModule, HomeContentModule, AdminUsersModule],
  providers: [ConfigService],
})
export class AppModule {}
