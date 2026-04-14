import { Repository } from 'typeorm';
import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { ContentBlock } from './entities/content-block.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { SiteSettings } from './entities/site-settings.entity';
export declare class SiteService {
    private readonly siteSettingsRepository;
    private readonly contentBlockRepository;
    private readonly mediaAssetRepository;
    constructor(siteSettingsRepository: Repository<SiteSettings>, contentBlockRepository: Repository<ContentBlock>, mediaAssetRepository: Repository<MediaAsset>);
    getPublicSitePayload(): Promise<{
        settings: SiteSettings;
        blocks: ContentBlock[];
        media: MediaAsset[];
    }>;
    getSettings(): Promise<SiteSettings>;
    updateSettings(dto: UpdateSiteSettingsDto): Promise<{
        registerEnabled: boolean;
        heroTitle: string;
        heroSubtitle: string;
        heroDescription: string;
        heroImageUrl: string;
        bannerImageUrl: string;
        aboutTitle: string;
        aboutBody: string;
        id: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    } & SiteSettings>;
    listContentBlocks(): Promise<ContentBlock[]>;
    createContentBlock(dto: CreateContentBlockDto): Promise<ContentBlock>;
    updateContentBlock(id: number, dto: UpdateContentBlockDto): Promise<{
        title: string;
        body: string;
        sortOrder: number;
        imageUrl?: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } & ContentBlock>;
    removeContentBlock(id: number): Promise<{
        success: boolean;
    }>;
    listMediaAssets(): Promise<MediaAsset[]>;
    createMediaAsset(dto: CreateMediaAssetDto): Promise<MediaAsset>;
    updateMediaAsset(id: number, dto: UpdateMediaAssetDto): Promise<{
        title: string;
        imageUrl: string;
        category: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } & MediaAsset>;
    removeMediaAsset(id: number): Promise<{
        success: boolean;
    }>;
}
