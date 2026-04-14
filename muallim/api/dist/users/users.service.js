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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_options_1 = require("../common/constants/menu-options");
const user_type_enum_1 = require("../common/enums/user-type.enum");
const menu_defaults_1 = require("../common/utils/menu-defaults");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    listUsers() {
        return this.userRepository.find({ order: { createdAt: 'DESC' } });
    }
    async createUser(dto) {
        const defaults = (0, menu_defaults_1.getDefaultMenusForUserType)(dto.userType);
        const mergedMenus = Array.from(new Set([...(dto.allowedMenus ?? []), ...defaults]));
        return this.userRepository.save(this.userRepository.create({
            ...dto,
            allowedMenus: mergedMenus,
        }));
    }
    async updateUser(id, dto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const nextUserType = dto.userType ?? user.userType;
        const defaultMenus = (0, menu_defaults_1.getDefaultMenusForUserType)(nextUserType);
        const mergedMenus = dto.allowedMenus
            ? Array.from(new Set([...dto.allowedMenus, ...defaultMenus]))
            : user.allowedMenus;
        return this.userRepository.save({
            ...user,
            ...dto,
            allowedMenus: mergedMenus,
        });
    }
    async removeUser(id) {
        await this.userRepository.delete(id);
        return { success: true };
    }
    async createMuallimUser(input) {
        const exists = await this.userRepository.findOne({ where: { muallimId: input.muallimId } });
        if (exists) {
            return exists;
        }
        return this.userRepository.save(this.userRepository.create({
            ...input,
            userType: user_type_enum_1.UserType.MUALLIM,
            allowedMenus: (0, menu_defaults_1.getDefaultMenusForUserType)(user_type_enum_1.UserType.MUALLIM),
        }));
    }
    getUserMetadata() {
        return {
            userTypes: Object.values(user_type_enum_1.UserType),
            menuOptions: menu_options_1.MENU_OPTIONS,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map