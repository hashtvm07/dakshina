"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_type_enum_1 = require("../common/enums/user-type.enum");
const menu_defaults_1 = require("../common/utils/menu-defaults");
const content_block_entity_1 = require("../site/entities/content-block.entity");
const media_asset_entity_1 = require("../site/entities/media-asset.entity");
const site_settings_entity_1 = require("../site/entities/site-settings.entity");
const user_entity_1 = require("../users/entities/user.entity");
let BootstrapService = class BootstrapService {
    userRepository;
    siteSettingsRepository;
    contentBlockRepository;
    mediaAssetRepository;
    constructor(userRepository, siteSettingsRepository, contentBlockRepository, mediaAssetRepository) {
        this.userRepository = userRepository;
        this.siteSettingsRepository = siteSettingsRepository;
        this.contentBlockRepository = contentBlockRepository;
        this.mediaAssetRepository = mediaAssetRepository;
    }
    async onApplicationBootstrap() {
        await this.seedSuperAdmin();
        await this.seedSiteSettings();
        await this.seedLandingContent();
    }
    async seedSuperAdmin() {
        const existing = await this.userRepository.findOne({
            where: { userType: user_type_enum_1.UserType.SUPERADMIN },
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
        await this.userRepository.save(this.userRepository.create({
            name: 'System Super Admin',
            username: 'superadmin',
            email: 'superadmin@muallim.local',
            phone: '0000000000',
            address: 'System generated account',
            password: 'StrongPass123',
            userType: user_type_enum_1.UserType.SUPERADMIN,
            allowedMenus: (0, menu_defaults_1.getDefaultMenusForUserType)(user_type_enum_1.UserType.SUPERADMIN),
        }));
    }
    async seedSiteSettings() {
        const existing = await this.siteSettingsRepository.findOne({
            where: { slug: 'default' },
        });
        if (existing) {
            return;
        }
        await this.siteSettingsRepository.save(this.siteSettingsRepository.create({
            slug: 'default',
            registerEnabled: true,
            heroTitle: 'Trusted Muallim Registration and Vacancy Portal',
            heroSubtitle: 'Green, clean, and mobile-first for the Dakshina Muallim network.',
            heroDescription: 'Manage public content, publish vacancies, and onboard Muallim profiles from one structured platform.',
            heroImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            bannerImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
            aboutTitle: 'Professional portal for registration, discovery, and vacancy management',
            aboutBody: 'The portal combines a polished public experience with an operational admin dashboard for colleges, vacancies, and user permissions.',
        }));
    }
    async seedLandingContent() {
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
                    imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
                }),
                this.contentBlockRepository.create({
                    title: 'Role-aware Administration',
                    body: 'Superadmin can assign menu visibility and operational pages for each admin account.',
                    sortOrder: 2,
                    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
                }),
                this.contentBlockRepository.create({
                    title: 'Vacancy Publishing',
                    body: 'Maintain colleges and publish live Muallim vacancies with searchable public access.',
                    sortOrder: 3,
                    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
                }),
            ]);
        }
        if (!mediaCount) {
            await this.mediaAssetRepository.save([
                this.mediaAssetRepository.create({
                    title: 'Campus coordination',
                    category: 'gallery',
                    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
                }),
                this.mediaAssetRepository.create({
                    title: 'Student guidance',
                    category: 'gallery',
                    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
                }),
                this.mediaAssetRepository.create({
                    title: 'Learning environment',
                    category: 'banner',
                    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
                }),
            ]);
        }
    }
};
exports.BootstrapService = BootstrapService;
exports.BootstrapService = BootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(site_settings_entity_1.SiteSettings)),
    __param(2, (0, typeorm_1.InjectRepository)(content_block_entity_1.ContentBlock)),
    __param(3, (0, typeorm_1.InjectRepository)(media_asset_entity_1.MediaAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BootstrapService);
//# sourceMappingURL=bootstrap.service.js.map