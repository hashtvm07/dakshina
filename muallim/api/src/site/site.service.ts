import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { ContentBlock } from './entities/content-block.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { SiteSettings } from './entities/site-settings.entity';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly siteSettingsRepository: Repository<SiteSettings>,
    @InjectRepository(ContentBlock)
    private readonly contentBlockRepository: Repository<ContentBlock>,
    @InjectRepository(MediaAsset)
    private readonly mediaAssetRepository: Repository<MediaAsset>,
  ) {}

  async getPublicSitePayload() {
    const [settings, blocks, media] = await Promise.all([
      this.getSettings(),
      this.contentBlockRepository.find({ order: { sortOrder: 'ASC', id: 'ASC' } }),
      this.mediaAssetRepository.find({ order: { id: 'DESC' } }),
    ]);

    return { settings, blocks, media };
  }

  async getSettings() {
    const settings = await this.siteSettingsRepository.findOne({ where: { slug: 'default' } });

    if (!settings) {
      throw new NotFoundException('Site settings not found');
    }

    return settings;
  }

  async updateSettings(dto: UpdateSiteSettingsDto) {
    const settings = await this.getSettings();
    return this.siteSettingsRepository.save({ ...settings, ...dto });
  }

  listContentBlocks() {
    return this.contentBlockRepository.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  createContentBlock(dto: CreateContentBlockDto) {
    return this.contentBlockRepository.save(this.contentBlockRepository.create(dto));
  }

  async updateContentBlock(id: number, dto: UpdateContentBlockDto) {
    const block = await this.contentBlockRepository.findOne({ where: { id } });
    if (!block) {
      throw new NotFoundException('Content block not found');
    }

    return this.contentBlockRepository.save({ ...block, ...dto });
  }

  async removeContentBlock(id: number) {
    await this.contentBlockRepository.delete(id);
    return { success: true };
  }

  listMediaAssets() {
    return this.mediaAssetRepository.find({ order: { id: 'DESC' } });
  }

  createMediaAsset(dto: CreateMediaAssetDto) {
    return this.mediaAssetRepository.save(this.mediaAssetRepository.create(dto));
  }

  async updateMediaAsset(id: number, dto: UpdateMediaAssetDto) {
    const asset = await this.mediaAssetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    return this.mediaAssetRepository.save({ ...asset, ...dto });
  }

  async removeMediaAsset(id: number) {
    await this.mediaAssetRepository.delete(id);
    return { success: true };
  }
}
