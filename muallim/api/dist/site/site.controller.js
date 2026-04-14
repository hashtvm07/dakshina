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
exports.SiteController = void 0;
const common_1 = require("@nestjs/common");
const create_content_block_dto_1 = require("./dto/create-content-block.dto");
const create_media_asset_dto_1 = require("./dto/create-media-asset.dto");
const update_content_block_dto_1 = require("./dto/update-content-block.dto");
const update_media_asset_dto_1 = require("./dto/update-media-asset.dto");
const update_site_settings_dto_1 = require("./dto/update-site-settings.dto");
const site_service_1 = require("./site.service");
let SiteController = class SiteController {
    siteService;
    constructor(siteService) {
        this.siteService = siteService;
    }
    getPublicSitePayload() {
        return this.siteService.getPublicSitePayload();
    }
    getSettings() {
        return this.siteService.getSettings();
    }
    updateSettings(dto) {
        return this.siteService.updateSettings(dto);
    }
    listContentBlocks() {
        return this.siteService.listContentBlocks();
    }
    createContentBlock(dto) {
        return this.siteService.createContentBlock(dto);
    }
    updateContentBlock(id, dto) {
        return this.siteService.updateContentBlock(id, dto);
    }
    removeContentBlock(id) {
        return this.siteService.removeContentBlock(id);
    }
    listMediaAssets() {
        return this.siteService.listMediaAssets();
    }
    createMediaAsset(dto) {
        return this.siteService.createMediaAsset(dto);
    }
    updateMediaAsset(id, dto) {
        return this.siteService.updateMediaAsset(id, dto);
    }
    removeMediaAsset(id) {
        return this.siteService.removeMediaAsset(id);
    }
};
exports.SiteController = SiteController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "getPublicSitePayload", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_site_settings_dto_1.UpdateSiteSettingsDto]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('content-blocks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "listContentBlocks", null);
__decorate([
    (0, common_1.Post)('content-blocks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_content_block_dto_1.CreateContentBlockDto]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "createContentBlock", null);
__decorate([
    (0, common_1.Put)('content-blocks/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_content_block_dto_1.UpdateContentBlockDto]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "updateContentBlock", null);
__decorate([
    (0, common_1.Delete)('content-blocks/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "removeContentBlock", null);
__decorate([
    (0, common_1.Get)('media-assets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "listMediaAssets", null);
__decorate([
    (0, common_1.Post)('media-assets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_asset_dto_1.CreateMediaAssetDto]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "createMediaAsset", null);
__decorate([
    (0, common_1.Put)('media-assets/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_media_asset_dto_1.UpdateMediaAssetDto]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "updateMediaAsset", null);
__decorate([
    (0, common_1.Delete)('media-assets/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SiteController.prototype, "removeMediaAsset", null);
exports.SiteController = SiteController = __decorate([
    (0, common_1.Controller)('site'),
    __metadata("design:paramtypes", [site_service_1.SiteService])
], SiteController);
//# sourceMappingURL=site.controller.js.map