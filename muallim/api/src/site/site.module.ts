import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentBlock } from './entities/content-block.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { SiteSettings } from './entities/site-settings.entity';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings, ContentBlock, MediaAsset])],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
