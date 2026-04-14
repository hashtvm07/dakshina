"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeContentModule = void 0;
const common_1 = require("@nestjs/common");
const core_module_1 = require("../../core/core.module");
const admin_users_module_1 = require("../admin-users/admin-users.module");
const home_content_admin_controller_1 = require("./home-content-admin.controller");
const home_content_controller_1 = require("./home-content.controller");
const home_content_service_1 = require("./home-content.service");
let HomeContentModule = class HomeContentModule {
};
exports.HomeContentModule = HomeContentModule;
exports.HomeContentModule = HomeContentModule = __decorate([
    (0, common_1.Module)({
        imports: [core_module_1.CoreModule, admin_users_module_1.AdminUsersModule],
        controllers: [home_content_controller_1.HomeContentController, home_content_admin_controller_1.HomeContentAdminController],
        providers: [home_content_service_1.HomeContentService],
    })
], HomeContentModule);
//# sourceMappingURL=home-content.module.js.map