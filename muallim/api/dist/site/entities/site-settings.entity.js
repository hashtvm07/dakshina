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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
const typeorm_1 = require("typeorm");
let SiteSettings = class SiteSettings {
    id;
    slug;
    registerEnabled;
    heroTitle;
    heroSubtitle;
    heroDescription;
    heroImageUrl;
    bannerImageUrl;
    aboutTitle;
    aboutBody;
    createdAt;
    updatedAt;
};
exports.SiteSettings = SiteSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SiteSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, default: 'default' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SiteSettings.prototype, "registerEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 180 }),
    __metadata("design:type", String)
], SiteSettings.prototype, "heroTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 220 }),
    __metadata("design:type", String)
], SiteSettings.prototype, "heroSubtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "heroDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], SiteSettings.prototype, "heroImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], SiteSettings.prototype, "bannerImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 180 }),
    __metadata("design:type", String)
], SiteSettings.prototype, "aboutTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "aboutBody", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SiteSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SiteSettings.prototype, "updatedAt", void 0);
exports.SiteSettings = SiteSettings = __decorate([
    (0, typeorm_1.Entity)('site_settings')
], SiteSettings);
//# sourceMappingURL=site-settings.entity.js.map