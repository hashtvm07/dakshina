import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteService } from './site.service';
export declare class SiteController {
    private readonly siteService;
    constructor(siteService: SiteService);
    getPublicSitePayload(): Promise<{
        settings: import("./entities/site-settings.entity").SiteSettings;
        blocks: import("./entities/content-block.entity").ContentBlock[];
        media: import("./entities/media-asset.entity").MediaAsset[];
    }>;
    getSettings(): Promise<import("./entities/site-settings.entity").SiteSettings>;
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
    } & import("./entities/site-settings.entity").SiteSettings>;
    listContentBlocks(): Promise<import("./entities/content-block.entity").ContentBlock[]>;
    createContentBlock(dto: CreateContentBlockDto): Promise<import("./entities/content-block.entity").ContentBlock>;
    updateContentBlock(id: number, dto: UpdateContentBlockDto): Promise<{
        title: string;
        body: string;
        sortOrder: number;
        imageUrl?: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } & import("./entities/content-block.entity").ContentBlock>;
    removeContentBlock(id: number): Promise<{
        success: boolean;
    }>;
    listMediaAssets(): Promise<import("./entities/media-asset.entity").MediaAsset[]>;
    createMediaAsset(dto: CreateMediaAssetDto): Promise<import("./entities/media-asset.entity").MediaAsset>;
    updateMediaAsset(id: number, dto: UpdateMediaAssetDto): Promise<{
        title: string;
        imageUrl: string;
        category: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } & import("./entities/media-asset.entity").MediaAsset>;
    removeMediaAsset(id: number): Promise<{
        success: boolean;
    }>;
}
