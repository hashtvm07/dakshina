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
exports.HomeContentAdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_session_guard_1 = require("../admin-users/admin-session.guard");
const home_content_service_1 = require("./home-content.service");
const home_content_dto_1 = require("./dto/home-content.dto");
let HomeContentAdminController = class HomeContentAdminController {
    homeContentService;
    constructor(homeContentService) {
        this.homeContentService = homeContentService;
    }
    getHomeContent() {
        return this.homeContentService.getAdminSnapshot();
    }
    updateHomeContent(content) {
        return this.homeContentService.updateHomeContent(content);
    }
    deletePublicationCard(payload) {
        return this.homeContentService.deletePublicationCard(payload.index);
    }
    uploadPublicationPdf(file, index, kind) {
        if (!file) {
            throw new common_1.BadRequestException('Choose a PDF file to upload.');
        }
        if (kind !== 'question-bank' && kind !== 'other-docs') {
            throw new common_1.BadRequestException('Invalid document type.');
        }
        return this.homeContentService.uploadPublicationPdf(index, kind, file);
    }
    createPublicationPdfUpload(index, kind, fileName) {
        if (!fileName?.trim()) {
            throw new common_1.BadRequestException('File name is required.');
        }
        if (kind !== 'question-bank' && kind !== 'other-docs') {
            throw new common_1.BadRequestException('Invalid document type.');
        }
        return this.homeContentService.createPublicationPdfUpload(index, kind, fileName);
    }
    finalizePublicationPdfUpload(index, kind, storagePath, fileName) {
        if (!storagePath?.trim() || !fileName?.trim()) {
            throw new common_1.BadRequestException('storagePath and fileName are required.');
        }
        if (kind !== 'question-bank' && kind !== 'other-docs') {
            throw new common_1.BadRequestException('Invalid document type.');
        }
        return this.homeContentService.finalizePublicationPdfUpload(index, kind, storagePath, fileName);
    }
    uploadEventImage(file, eventIndex) {
        if (!file) {
            throw new common_1.BadRequestException('Choose an image file to upload.');
        }
        return this.homeContentService.uploadEventImage(eventIndex, file);
    }
    uploadEventPdf(file, eventIndex, pdfIndex) {
        if (!file) {
            throw new common_1.BadRequestException('Choose a PDF file to upload.');
        }
        return this.homeContentService.uploadEventPdf(eventIndex, pdfIndex, file);
    }
    createEventPdfUpload(eventIndex, pdfIndex, fileName) {
        if (!fileName?.trim()) {
            throw new common_1.BadRequestException('File name is required.');
        }
        return this.homeContentService.createEventPdfUpload(eventIndex, pdfIndex, fileName);
    }
    finalizeEventPdfUpload(eventIndex, pdfIndex, storagePath, fileName) {
        if (!storagePath?.trim() || !fileName?.trim()) {
            throw new common_1.BadRequestException('storagePath and fileName are required.');
        }
        return this.homeContentService.finalizeEventPdfUpload(eventIndex, pdfIndex, storagePath, fileName);
    }
    deleteEventPdf(payload) {
        return this.homeContentService.deleteEventPdf(payload.eventIndex, payload.pdfIndex);
    }
    deleteEventCard(payload) {
        return this.homeContentService.deleteEventCard(payload.eventIndex);
    }
};
exports.HomeContentAdminController = HomeContentAdminController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeContentAdminController.prototype, "getHomeContent", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_content_dto_1.HomeContentDto]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "updateHomeContent", null);
__decorate([
    (0, common_1.Post)('publications/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_content_dto_1.DeletePublicationCardDto]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "deletePublicationCard", null);
__decorate([
    (0, common_1.Post)('publications/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 12 * 1024 * 1024 },
        fileFilter: (_request, file, callback) => {
            const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
            callback(isPdf ? null : new common_1.BadRequestException('Only PDF files are allowed.'), isPdf);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('index', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "uploadPublicationPdf", null);
__decorate([
    (0, common_1.Post)('publications/upload-direct/init'),
    __param(0, (0, common_1.Body)('index', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('kind')),
    __param(2, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "createPublicationPdfUpload", null);
__decorate([
    (0, common_1.Post)('publications/upload-direct/finalize'),
    __param(0, (0, common_1.Body)('index', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('kind')),
    __param(2, (0, common_1.Body)('storagePath')),
    __param(3, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "finalizePublicationPdfUpload", null);
__decorate([
    (0, common_1.Post)('events/image/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (_request, file, callback) => {
            const isAllowedImage = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype);
            callback(isAllowedImage ? null : new common_1.BadRequestException('Only JPG, PNG, WEBP, or GIF images are allowed.'), isAllowedImage);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('eventIndex', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "uploadEventImage", null);
__decorate([
    (0, common_1.Post)('events/pdf/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 12 * 1024 * 1024 },
        fileFilter: (_request, file, callback) => {
            const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
            callback(isPdf ? null : new common_1.BadRequestException('Only PDF files are allowed.'), isPdf);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('eventIndex', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('pdfIndex', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "uploadEventPdf", null);
__decorate([
    (0, common_1.Post)('events/pdf/upload-direct/init'),
    __param(0, (0, common_1.Body)('eventIndex', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('pdfIndex', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "createEventPdfUpload", null);
__decorate([
    (0, common_1.Post)('events/pdf/upload-direct/finalize'),
    __param(0, (0, common_1.Body)('eventIndex', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('pdfIndex', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('storagePath')),
    __param(3, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "finalizeEventPdfUpload", null);
__decorate([
    (0, common_1.Post)('events/pdf/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_content_dto_1.DeleteEventPdfDto]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "deleteEventPdf", null);
__decorate([
    (0, common_1.Post)('events/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_content_dto_1.DeleteEventCardDto]),
    __metadata("design:returntype", Promise)
], HomeContentAdminController.prototype, "deleteEventCard", null);
exports.HomeContentAdminController = HomeContentAdminController = __decorate([
    (0, common_1.UseGuards)(admin_session_guard_1.AdminSessionGuard),
    (0, common_1.Controller)('api/admin/home-content'),
    __metadata("design:paramtypes", [home_content_service_1.HomeContentService])
], HomeContentAdminController);
//# sourceMappingURL=home-content-admin.controller.js.map