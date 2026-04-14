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
exports.Muallim = void 0;
const typeorm_1 = require("typeorm");
let Muallim = class Muallim {
    id;
    publicId;
    name;
    username;
    email;
    phone;
    address;
    bio;
    createdAt;
    updatedAt;
};
exports.Muallim = Muallim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Muallim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 32 }),
    __metadata("design:type", String)
], Muallim.prototype, "publicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Muallim.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120, unique: true }),
    __metadata("design:type", String)
], Muallim.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 160, unique: true }),
    __metadata("design:type", String)
], Muallim.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Muallim.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Muallim.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Muallim.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Muallim.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Muallim.prototype, "updatedAt", void 0);
exports.Muallim = Muallim = __decorate([
    (0, typeorm_1.Entity)('muallims')
], Muallim);
//# sourceMappingURL=muallim.entity.js.map