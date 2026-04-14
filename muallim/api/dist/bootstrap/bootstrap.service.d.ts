import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContentBlock } from '../site/entities/content-block.entity';
import { MediaAsset } from '../site/entities/media-asset.entity';
import { SiteSettings } from '../site/entities/site-settings.entity';
import { User } from '../users/entities/user.entity';
export declare class BootstrapService implements OnApplicationBootstrap {
    private readonly userRepository;
    private readonly siteSettingsRepository;
    private readonly contentBlockRepository;
    private readonly mediaAssetRepository;
    constructor(userRepository: Repository<User>, siteSettingsRepository: Repository<SiteSettings>, contentBlockRepository: Repository<ContentBlock>, mediaAssetRepository: Repository<MediaAsset>);
    onApplicationBootstrap(): Promise<void>;
    private seedSuperAdmin;
    private seedSiteSettings;
    private seedLandingContent;
}
