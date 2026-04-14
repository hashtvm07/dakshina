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
exports.MuallimsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const muallim_entity_1 = require("./entities/muallim.entity");
let MuallimsService = class MuallimsService {
    muallimRepository;
    usersService;
    constructor(muallimRepository, usersService) {
        this.muallimRepository = muallimRepository;
        this.usersService = usersService;
    }
    async registerMuallim(dto) {
        const total = await this.muallimRepository.count();
        const publicId = `MUA-${String(total + 1).padStart(4, '0')}`;
        const muallim = await this.muallimRepository.save(this.muallimRepository.create({
            ...dto,
            publicId,
        }));
        await this.usersService.createMuallimUser({
            muallimId: muallim.publicId,
            name: muallim.name,
            username: muallim.username,
            email: muallim.email,
            phone: muallim.phone,
            address: muallim.address,
        });
        return muallim;
    }
    async listMuallims(query) {
        const qb = this.muallimRepository.createQueryBuilder('muallim');
        if (query) {
            qb.where('LOWER(muallim.publicId) LIKE LOWER(:query) OR LOWER(muallim.name) LIKE LOWER(:query)', { query: `%${query}%` });
        }
        return qb.orderBy('muallim.createdAt', 'DESC').getMany();
    }
    async findByPublicId(publicId) {
        const muallim = await this.muallimRepository.findOne({ where: { publicId } });
        if (!muallim) {
            throw new common_1.NotFoundException('Muallim not found');
        }
        return muallim;
    }
};
exports.MuallimsService = MuallimsService;
exports.MuallimsService = MuallimsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(muallim_entity_1.Muallim)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MuallimsService);
//# sourceMappingURL=muallims.service.js.map