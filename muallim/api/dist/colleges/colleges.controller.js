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
exports.CollegesController = void 0;
const common_1 = require("@nestjs/common");
const colleges_service_1 = require("./colleges.service");
const create_college_dto_1 = require("./dto/create-college.dto");
const update_college_dto_1 = require("./dto/update-college.dto");
let CollegesController = class CollegesController {
    collegesService;
    constructor(collegesService) {
        this.collegesService = collegesService;
    }
    listColleges() {
        return this.collegesService.listColleges();
    }
    createCollege(dto) {
        return this.collegesService.createCollege(dto);
    }
    updateCollege(id, dto) {
        return this.collegesService.updateCollege(id, dto);
    }
    removeCollege(id) {
        return this.collegesService.removeCollege(id);
    }
};
exports.CollegesController = CollegesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CollegesController.prototype, "listColleges", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_college_dto_1.CreateCollegeDto]),
    __metadata("design:returntype", void 0)
], CollegesController.prototype, "createCollege", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_college_dto_1.UpdateCollegeDto]),
    __metadata("design:returntype", void 0)
], CollegesController.prototype, "updateCollege", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CollegesController.prototype, "removeCollege", null);
exports.CollegesController = CollegesController = __decorate([
    (0, common_1.Controller)('colleges'),
    __metadata("design:paramtypes", [colleges_service_1.CollegesService])
], CollegesController);
//# sourceMappingURL=colleges.controller.js.map