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
exports.VacanciesController = void 0;
const common_1 = require("@nestjs/common");
const create_vacancy_dto_1 = require("./dto/create-vacancy.dto");
const update_vacancy_dto_1 = require("./dto/update-vacancy.dto");
const vacancies_service_1 = require("./vacancies.service");
let VacanciesController = class VacanciesController {
    vacanciesService;
    constructor(vacanciesService) {
        this.vacanciesService = vacanciesService;
    }
    listVacancies(query) {
        return this.vacanciesService.listVacancies(query);
    }
    createVacancy(dto) {
        return this.vacanciesService.createVacancy(dto);
    }
    updateVacancy(id, dto) {
        return this.vacanciesService.updateVacancy(id, dto);
    }
    removeVacancy(id) {
        return this.vacanciesService.removeVacancy(id);
    }
};
exports.VacanciesController = VacanciesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "listVacancies", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vacancy_dto_1.CreateVacancyDto]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "createVacancy", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_vacancy_dto_1.UpdateVacancyDto]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "updateVacancy", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "removeVacancy", null);
exports.VacanciesController = VacanciesController = __decorate([
    (0, common_1.Controller)('vacancies'),
    __metadata("design:paramtypes", [vacancies_service_1.VacanciesService])
], VacanciesController);
//# sourceMappingURL=vacancies.controller.js.map