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
exports.VacanciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vacancy_entity_1 = require("./entities/vacancy.entity");
let VacanciesService = class VacanciesService {
    vacancyRepository;
    constructor(vacancyRepository) {
        this.vacancyRepository = vacancyRepository;
    }
    async listVacancies(filters) {
        const qb = this.vacancyRepository
            .createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.college', 'college');
        if (filters.query) {
            qb.andWhere(`
          LOWER(vacancy.title) LIKE LOWER(:query)
          OR LOWER(vacancy.subject) LIKE LOWER(:query)
          OR LOWER(vacancy.location) LIKE LOWER(:query)
          OR LOWER(vacancy.qualification) LIKE LOWER(:query)
          OR LOWER(vacancy.contactInfo) LIKE LOWER(:query)
          OR LOWER(college.name) LIKE LOWER(:query)
        `, { query: `%${filters.query}%` });
        }
        if (filters.collegeId) {
            qb.andWhere('vacancy.collegeId = :collegeId', { collegeId: Number(filters.collegeId) });
        }
        if (filters.subject) {
            qb.andWhere('LOWER(vacancy.subject) LIKE LOWER(:subject)', {
                subject: `%${filters.subject}%`,
            });
        }
        if (filters.location) {
            qb.andWhere('LOWER(vacancy.location) LIKE LOWER(:location)', {
                location: `%${filters.location}%`,
            });
        }
        return qb.orderBy('vacancy.createdAt', 'DESC').getMany();
    }
    createVacancy(dto) {
        return this.vacancyRepository.save(this.vacancyRepository.create(dto));
    }
    async updateVacancy(id, dto) {
        const vacancy = await this.vacancyRepository.findOne({ where: { id } });
        if (!vacancy) {
            throw new common_1.NotFoundException('Vacancy not found');
        }
        return this.vacancyRepository.save({ ...vacancy, ...dto });
    }
    async removeVacancy(id) {
        await this.vacancyRepository.delete(id);
        return { success: true };
    }
};
exports.VacanciesService = VacanciesService;
exports.VacanciesService = VacanciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vacancy_entity_1.Vacancy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VacanciesService);
//# sourceMappingURL=vacancies.service.js.map