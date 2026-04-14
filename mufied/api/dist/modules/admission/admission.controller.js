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
exports.AdmissionController = void 0;
const common_1 = require("@nestjs/common");
const admin_session_guard_1 = require("../admin-users/admin-session.guard");
const create_admission_dto_1 = require("./dto/create-admission.dto");
const admission_service_1 = require("./admission.service");
let AdmissionController = class AdmissionController {
    admissionService;
    constructor(admissionService) {
        this.admissionService = admissionService;
    }
    create(dto) {
        return this.admissionService.createAdmission(dto);
    }
    list() {
        return this.admissionService.listAdmissions();
    }
    update(applicationNo, dto) {
        return this.admissionService.updateAdmission(applicationNo, dto);
    }
    remove(applicationNo) {
        return this.admissionService.deleteAdmission(applicationNo);
    }
    lookup(email, studentDateOfBirth) {
        return this.admissionService.findAdmissionByEmail(email, studentDateOfBirth);
    }
    getHallTicket(applicationNo, studentDateOfBirth) {
        return this.admissionService.getHallTicket(applicationNo, studentDateOfBirth);
    }
    getExamResult(applicationNo, studentDateOfBirth) {
        return this.admissionService.getExamResult(applicationNo, studentDateOfBirth);
    }
};
exports.AdmissionController = AdmissionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admission_dto_1.CreateAdmissionDto]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_session_guard_1.AdminSessionGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(admin_session_guard_1.AdminSessionGuard),
    (0, common_1.Put)(':applicationNo'),
    __param(0, (0, common_1.Param)('applicationNo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_admission_dto_1.CreateAdmissionDto]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_session_guard_1.AdminSessionGuard),
    (0, common_1.Delete)(':applicationNo'),
    __param(0, (0, common_1.Param)('applicationNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('lookup'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('studentDateOfBirth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "lookup", null);
__decorate([
    (0, common_1.Get)('hall-ticket'),
    __param(0, (0, common_1.Query)('applicationNo')),
    __param(1, (0, common_1.Query)('studentDateOfBirth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "getHallTicket", null);
__decorate([
    (0, common_1.Get)('exam-result'),
    __param(0, (0, common_1.Query)('applicationNo')),
    __param(1, (0, common_1.Query)('studentDateOfBirth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdmissionController.prototype, "getExamResult", null);
exports.AdmissionController = AdmissionController = __decorate([
    (0, common_1.Controller)('api/admissions'),
    __metadata("design:paramtypes", [admission_service_1.AdmissionService])
], AdmissionController);
//# sourceMappingURL=admission.controller.js.map