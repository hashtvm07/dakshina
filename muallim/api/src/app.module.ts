import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './health/health.controller';
import { BootstrapService } from './bootstrap/bootstrap.service';
import { CollegesModule } from './colleges/colleges.module';
import { College } from './colleges/entities/college.entity';
import { createDatabaseConfig } from './config/database.config';
import { MuallimsModule } from './muallims/muallims.module';
import { Muallim } from './muallims/entities/muallim.entity';
import { ContentBlock } from './site/entities/content-block.entity';
import { MediaAsset } from './site/entities/media-asset.entity';
import { SiteSettings } from './site/entities/site-settings.entity';
import { SiteModule } from './site/site.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Vacancy } from './vacancies/entities/vacancy.entity';
import { VacanciesModule } from './vacancies/vacancies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createDatabaseConfig(configService),
    }),
    TypeOrmModule.forFeature([User, Muallim, SiteSettings, ContentBlock, MediaAsset, College, Vacancy]),
    SiteModule,
    MuallimsModule,
    UsersModule,
    CollegesModule,
    VacanciesModule,
  ],
  controllers: [AppController],
  providers: [BootstrapService],
})
export class AppModule {}
