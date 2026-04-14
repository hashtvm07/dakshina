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
exports.CollegesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const college_entity_1 = require("./entities/college.entity");
let CollegesService = class CollegesService {
    collegeRepository;
    constructor(collegeRepository) {
        this.collegeRepository = collegeRepository;
    }
    listColleges() {
        return this.collegeRepository.find({ order: { name: 'ASC' } });
    }
    createCollege(dto) {
        return this.collegeRepository.save(this.collegeRepository.create(dto));
    }
    async updateCollege(id, dto) {
        const college = await this.collegeRepository.findOne({ where: { id } });
        if (!college) {
            throw new common_1.NotFoundException('College not found');
        }
        return this.collegeRepository.save({ ...college, ...dto });
    }
    async removeCollege(id) {
        await this.collegeRepository.delete(id);
        return { success: true };
    }
};
exports.CollegesService = CollegesService;
exports.CollegesService = CollegesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(college_entity_1.College)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CollegesService);
//# sourceMappingURL=colleges.service.js.map