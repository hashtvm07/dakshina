import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config-service';
import { EmailService } from './email.service';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [ConfigService, FirebaseService, EmailService],
  exports: [ConfigService, FirebaseService, EmailService],
})
export class CoreModule {}
