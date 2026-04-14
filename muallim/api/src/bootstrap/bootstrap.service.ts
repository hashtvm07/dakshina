import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
  constructor(
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
    await this.seedSuperAdmin();
    await this.seedSiteSettings();
    await this.seedLandingContent();
  }

  private async seedSuperAdmin() {
    const existing = await this.userRepository.findOne({
      where: { userType: UserType.SUPERADMIN },
      select: ['id', 'userType', 'password'],
    });

    if (existing) {
      if (!existing.password) {
        await this.userRepository.update(existing.id, {
          password: 'StrongPass123',
        });
      }
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
        heroImageUrl:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        bannerImageUrl:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
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

    if (!blockCount) {
      await this.contentBlockRepository.save([
        this.contentBlockRepository.create({
          title: 'Structured Registration',
          body: 'Capture mandatory Muallim details with a clean public workflow and automatic user creation.',
          sortOrder: 1,
          imageUrl:
            'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
        }),
        this.contentBlockRepository.create({
          title: 'Role-aware Administration',
          body: 'Superadmin can assign menu visibility and operational pages for each admin account.',
          sortOrder: 2,
          imageUrl:
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        }),
        this.contentBlockRepository.create({
          title: 'Vacancy Publishing',
          body: 'Maintain colleges and publish live Muallim vacancies with searchable public access.',
          sortOrder: 3,
          imageUrl:
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
        }),
      ]);
    }

    if (!mediaCount) {
      await this.mediaAssetRepository.save([
        this.mediaAssetRepository.create({
          title: 'Campus coordination',
          category: 'gallery',
          imageUrl:
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
        }),
        this.mediaAssetRepository.create({
          title: 'Student guidance',
          category: 'gallery',
          imageUrl:
            'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
        }),
        this.mediaAssetRepository.create({
          title: 'Learning environment',
          category: 'banner',
          imageUrl:
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
        }),
      ]);
    }
  }
}
