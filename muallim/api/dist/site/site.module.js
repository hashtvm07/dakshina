"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const content_block_entity_1 = require("./entities/content-block.entity");
const media_asset_entity_1 = require("./entities/media-asset.entity");
const site_settings_entity_1 = require("./entities/site-settings.entity");
const site_controller_1 = require("./site.controller");
const site_service_1 = require("./site.service");
let SiteModule = class SiteModule {
};
exports.SiteModule = SiteModule;
exports.SiteModule = SiteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([site_settings_entity_1.SiteSettings, content_block_entity_1.ContentBlock, media_asset_entity_1.MediaAsset])],
        controllers: [site_controller_1.SiteController],
        providers: [site_service_1.SiteService],
        exports: [site_service_1.SiteService],
    })
], SiteModule);
//# sourceMappingURL=site.module.js.map