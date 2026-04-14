import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { AdmissionController } from './admission.controller';
import { AdmissionService } from './admission.service';

@Module({
  imports: [CoreModule, AdminUsersModule],
  controllers: [AdmissionController],
  providers: [AdmissionService],
})
export class AdmissionModule {}
