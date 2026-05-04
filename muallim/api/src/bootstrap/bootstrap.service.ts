import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../common/enums/user-type.enum';
import { getDefaultMenusForUserType } from '../common/utils/menu-defaults';
import { ContentBlock } from '../site/entities/content-block.entity';
import { MediaAsset } from '../site/entities/media-asset.entity';
import { SiteSettings } from '../site/entities/site-settings.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SiteSettings)
    private readonly siteSettingsRepository: Repository<SiteSettings>,
    @InjectRepository(ContentBlock)
    private readonly contentBlockRepository: Repository<ContentBlock>,
    @InjectRepository(MediaAsset)
    private readonly mediaAssetRepository: Repository<MediaAsset>,
  ) {}

  async onApplicationBootstrap() {
    const shouldSeed = this.configService.get<string>('DB_SEED', 'true') === 'true';

    if (!shouldSeed) {
      this.logger.log('Skipping bootstrap seed because DB_SEED=false');
      return;
    }

    try {
      await this.seedSuperAdmin();
      await this.seedSiteSettings();
      await this.seedLandingContent();
      this.logger.log('Bootstrap seed completed');
    } catch (error) {
      const shouldFail =
        this.configService.get<string>('BOOTSTRAP_FAIL_FAST', 'false') === 'true';
      const message = error instanceof Error ? error.stack ?? error.message : String(error);

      this.logger.error(`Bootstrap seed failed: ${message}`);

      if (shouldFail) {
        throw error;
      }
    }
  }

  private async seedSuperAdmin() {
    const existing = await this.userRepository.findOne({
      where: { username: 'superadmin' },
      select: ['id', 'userType', 'password'],
    });

    if (existing) {
      await this.userRepository.update(existing.id, {
        name: 'System Super Admin',
        username: 'superadmin',
        email: 'superadmin@muallim.local',
        phone: '0000000000',
        address: 'System generated account',
        password: 'StrongPass123',
        userType: UserType.SUPERADMIN,
        allowedMenus: getDefaultMenusForUserType(UserType.SUPERADMIN),
        isActive: true,
      });
      return;
    }

    await this.userRepository.save(
      this.userRepository.create({
        name: 'System Super Admin',
        username: 'superadmin',
        email: 'superadmin@muallim.local',
        phone: '0000000000',
        address: 'System generated account',
        password: 'StrongPass123',
        userType: UserType.SUPERADMIN,
        allowedMenus: getDefaultMenusForUserType(UserType.SUPERADMIN),
      }),
    );
  }

  private async seedSiteSettings() {
    const existing = await this.siteSettingsRepository.findOne({
      where: { slug: 'default' },
    });

    if (existing) {
      await this.siteSettingsRepository.update(existing.id, {
        heroImageUrl: '/web-ui/assets/images/landing/boys-reading-quran-mosque.jpg',
        bannerImageUrl: '/web-ui/assets/images/landing/beautiful-masjid-school.jpg',
      });
      return;
    }

    await this.siteSettingsRepository.save(
      this.siteSettingsRepository.create({
        slug: 'default',
        registerEnabled: true,
        heroTitle: 'Trusted Muallim Registration and Vacancy Portal',
        heroSubtitle: 'Green, clean, and mobile-first for the Dakshina Muallim network.',
        heroDescription:
          'Manage public content, publish vacancies, and onboard Muallim profiles from one structured platform.',
        heroImageUrl: '/web-ui/assets/images/landing/boys-reading-quran-mosque.jpg',
        bannerImageUrl: '/web-ui/assets/images/landing/beautiful-masjid-school.jpg',
        aboutTitle: 'Professional portal for registration, discovery, and vacancy management',
        aboutBody:
          'The portal combines a polished public experience with an operational admin dashboard for colleges, vacancies, and user permissions.',
      }),
    );
  }

  private async seedLandingContent() {
    const [blockCount, mediaCount] = await Promise.all([
      this.contentBlockRepository.count(),
      this.mediaAssetRepository.count(),
    ]);

    const defaultBlocks = [
      this.contentBlockRepository.create({
        title: 'Structured Registration',
        body: 'Capture mandatory Muallim details with a clean public workflow and automatic user creation.',
        sortOrder: 1,
        imageUrl: '/web-ui/assets/images/landing/boy-white-thobe-quran.jpg',
      }),
      this.contentBlockRepository.create({
        title: 'Role-aware Administration',
        body: 'Superadmin can assign menu visibility and operational pages for each admin account.',
        sortOrder: 2,
        imageUrl: '/web-ui/assets/images/landing/children-studying-mosque.jpg',
      }),
      this.contentBlockRepository.create({
        title: 'Vacancy Publishing',
        body: 'Maintain colleges and publish live Muallim vacancies with searchable public access.',
        sortOrder: 3,
        imageUrl: '/web-ui/assets/images/landing/masjid-architecture-campus.jpg',
      }),
    ];

    if (!blockCount) {
      await this.contentBlockRepository.save(defaultBlocks);
    } else {
      await Promise.all(
        defaultBlocks.map((block) =>
          this.contentBlockRepository.update({ title: block.title }, { imageUrl: block.imageUrl }),
        ),
      );
    }

    const defaultMediaAssets = [
      this.mediaAssetRepository.create({
        title: 'Campus coordination',
        category: 'gallery',
        imageUrl: '/web-ui/assets/images/landing/beautiful-masjid-school.jpg',
      }),
      this.mediaAssetRepository.create({
        title: 'Student guidance',
        category: 'gallery',
        imageUrl: '/web-ui/assets/images/landing/boys-studying-globe.jpg',
      }),
      this.mediaAssetRepository.create({
        title: 'Learning environment',
        category: 'banner',
        imageUrl: '/web-ui/assets/images/landing/1.jpg',
      }),
    ];

    if (!mediaCount) {
      await this.mediaAssetRepository.save(defaultMediaAssets);
    } else {
      await Promise.all(
        defaultMediaAssets.map((asset) =>
          this.mediaAssetRepository.update({ title: asset.title }, { imageUrl: asset.imageUrl }),
        ),
      );
    }
  }
}
