"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuallimsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("../users/users.module");
const muallim_entity_1 = require("./entities/muallim.entity");
const muallims_controller_1 = require("./muallims.controller");
const muallims_service_1 = require("./muallims.service");
let MuallimsModule = class MuallimsModule {
};
exports.MuallimsModule = MuallimsModule;
exports.MuallimsModule = MuallimsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([muallim_entity_1.Muallim]), users_module_1.UsersModule],
        controllers: [muallims_controller_1.MuallimsController],
        providers: [muallims_service_1.MuallimsService],
    })
], MuallimsModule);
//# sourceMappingURL=muallims.module.js.map