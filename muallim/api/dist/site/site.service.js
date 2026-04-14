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
exports.SiteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_block_entity_1 = require("./entities/content-block.entity");
const media_asset_entity_1 = require("./entities/media-asset.entity");
const site_settings_entity_1 = require("./entities/site-settings.entity");
let SiteService = class SiteService {
    siteSettingsRepository;
    contentBlockRepository;
    mediaAssetRepository;
    constructor(siteSettingsRepository, contentBlockRepository, mediaAssetRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.contentBlockRepository = contentBlockRepository;
        this.mediaAssetRepository = mediaAssetRepository;
    }
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
            throw new common_1.NotFoundException('Site settings not found');
        }
        return settings;
    }
    async updateSettings(dto) {
        const settings = await this.getSettings();
        return this.siteSettingsRepository.save({ ...settings, ...dto });
    }
    listContentBlocks() {
        return this.contentBlockRepository.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
    }
    createContentBlock(dto) {
        return this.contentBlockRepository.save(this.contentBlockRepository.create(dto));
    }
    async updateContentBlock(id, dto) {
        const block = await this.contentBlockRepository.findOne({ where: { id } });
        if (!block) {
            throw new common_1.NotFoundException('Content block not found');
        }
        return this.contentBlockRepository.save({ ...block, ...dto });
    }
    async removeContentBlock(id) {
        await this.contentBlockRepository.delete(id);
        return { success: true };
    }
    listMediaAssets() {
        return this.mediaAssetRepository.find({ order: { id: 'DESC' } });
    }
    createMediaAsset(dto) {
        return this.mediaAssetRepository.save(this.mediaAssetRepository.create(dto));
    }
    async updateMediaAsset(id, dto) {
        const asset = await this.mediaAssetRepository.findOne({ where: { id } });
        if (!asset) {
            throw new common_1.NotFoundException('Media asset not found');
        }
        return this.mediaAssetRepository.save({ ...asset, ...dto });
    }
    async removeMediaAsset(id) {
        await this.mediaAssetRepository.delete(id);
        return { success: true };
    }
};
exports.SiteService = SiteService;
exports.SiteService = SiteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_settings_entity_1.SiteSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(content_block_entity_1.ContentBlock)),
    __param(2, (0, typeorm_1.InjectRepository)(media_asset_entity_1.MediaAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SiteService);
//# sourceMappingURL=site.service.js.map