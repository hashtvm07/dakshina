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
exports.HomeContentController = void 0;
const common_1 = require("@nestjs/common");
const admin_session_guard_1 = require("../admin-users/admin-session.guard");
const home_content_service_1 = require("./home-content.service");
const home_content_dto_1 = require("./dto/home-content.dto");
let HomeContentController = class HomeContentController {
    homeContentService;
    constructor(homeContentService) {
        this.homeContentService = homeContentService;
    }
    getHomeContent() {
        return this.homeContentService.getHomeContent();
    }
    updateHomeContent(content) {
        return this.homeContentService.updateHomeContent(content);
    }
};
exports.HomeContentController = HomeContentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeContentController.prototype, "getHomeContent", null);
__decorate([
    (0, common_1.UseGuards)(admin_session_guard_1.AdminSessionGuard),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_content_dto_1.HomeContentDto]),
    __metadata("design:returntype", Promise)
], HomeContentController.prototype, "updateHomeContent", null);
exports.HomeContentController = HomeContentController = __decorate([
    (0, common_1.Controller)('api/home-content'),
    __metadata("design:paramtypes", [home_content_service_1.HomeContentService])
], HomeContentController);
//# sourceMappingURL=home-content.controller.js.map