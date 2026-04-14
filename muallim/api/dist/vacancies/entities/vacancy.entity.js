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
exports.Vacancy = void 0;
const typeorm_1 = require("typeorm");
const college_entity_1 = require("../../colleges/entities/college.entity");
let Vacancy = class Vacancy {
    id;
    title;
    subject;
    totalPositions;
    location;
    qualification;
    lastDate;
    contactInfo;
    notes;
    collegeId;
    college;
    createdAt;
    updatedAt;
};
exports.Vacancy = Vacancy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vacancy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160 }),
    __metadata("design:type", String)
], Vacancy.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Vacancy.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Vacancy.prototype, "totalPositions", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Vacancy.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 180 }),
    __metadata("design:type", String)
], Vacancy.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Vacancy.prototype, "lastDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160 }),
    __metadata("design:type", String)
], Vacancy.prototype, "contactInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Vacancy.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vacancy.prototype, "collegeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => college_entity_1.College, (college) => college.vacancies, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'collegeId' }),
    __metadata("design:type", college_entity_1.College)
], Vacancy.prototype, "college", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vacancy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vacancy.prototype, "updatedAt", void 0);
exports.Vacancy = Vacancy = __decorate([
    (0, typeorm_1.Entity)('vacancies')
], Vacancy);
//# sourceMappingURL=vacancy.entity.js.map