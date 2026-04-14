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
exports.College = void 0;
const typeorm_1 = require("typeorm");
const vacancy_entity_1 = require("../../vacancies/entities/vacancy.entity");
let College = class College {
    id;
    name;
    location;
    district;
    state;
    isActive;
    vacancies;
    createdAt;
    updatedAt;
};
exports.College = College;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], College.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160 }),
    __metadata("design:type", String)
], College.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], College.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], College.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], College.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], College.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vacancy_entity_1.Vacancy, (vacancy) => vacancy.college),
    __metadata("design:type", Array)
], College.prototype, "vacancies", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], College.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], College.prototype, "updatedAt", void 0);
exports.College = College = __decorate([
    (0, typeorm_1.Entity)('colleges')
], College);
//# sourceMappingURL=college.entity.js.map