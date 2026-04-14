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
exports.AdmissionService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../../core/email.service");
const firebase_service_1 = require("../../core/firebase.service");
const DEFAULT_EXAM_CENTER_VENUE = 'Mannaniyya Umarul Farooq Academy Kilikolloor, Kollam';
const DEFAULT_EXAM_DATE = '2026-04-11';
const APPLICATION_PREFIX = 'MUFIED';
const HOME_CONTENT_DB_PATH = 'content/home';
const DEFAULT_AUTHORITY_EMAIL = 'admissions@mufied.in';
let AdmissionService = class AdmissionService {
    firebase;
    emailService;
    constructor(firebase, emailService) {
        this.firebase = firebase;
        this.emailService = emailService;
    }
    async createAdmission(dto) {
        if (!dto.guardianDeclarationAccepted) {
            throw new common_1.BadRequestException('Guardian declaration must be accepted.');
        }
        const admissions = await this.firebase.list('admissions');
        const normalizedEmail = dto.email.trim().toLowerCase();
        const existingAdmission = Object.values(admissions).find((candidate) => candidate.email.trim().toLowerCase() === normalizedEmail);
        if (existingAdmission) {
            const authorityEmail = await this.getAuthorityEmail();
            throw new common_1.BadRequestException(`An admission already exists for this email. Contact the admission authority at ${authorityEmail}.`);
        }
        const nextNumber = await this.firebase.nextSequence('meta/admissionSequence');
        const applicationNo = `${APPLICATION_PREFIX}-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
        const hallTicketNo = `HT-${applicationNo}`;
        const document = {
            ...dto,
            admissionFor: dto.admissionFor || 'Secondary (8-10)',
            examCenterVenue: dto.examCenterVenue || DEFAULT_EXAM_CENTER_VENUE,
            examDate: dto.examDate || DEFAULT_EXAM_DATE,
            applicationNo,
            hallTicketNo,
            createdAt: new Date().toISOString(),
        };
        await this.firebase.set(`admissions/${applicationNo}`, document);
        const applicantMessage = [
            `Admission submitted successfully.`,
            `Application No: ${applicationNo}`,
            `Hall Ticket No: ${hallTicketNo}`,
            `Candidate: ${dto.studentName}`,
            `Programme: ${document.admissionFor}`,
            `Exam Date: ${document.examDate}`,
        ].join('\n');
        const emailDelivery = await this.emailService.sendAdmissionConfirmation({
            to: document.email,
            applicationNo,
            hallTicketNo,
            studentName: document.studentName,
            guardianName: document.guardianName,
            admissionFor: document.admissionFor,
            examDate: document.examDate,
            examCenterVenue: document.examCenterVenue,
        });
        return {
            message: emailDelivery.sent
                ? 'Admission submitted successfully. Confirmation email sent.'
                : 'Admission submitted successfully.',
            applicationNo,
            hallTicketNo,
            candidate: {
                studentName: dto.studentName,
                studentDateOfBirth: dto.studentDateOfBirth,
                guardianName: dto.guardianName,
                admissionFor: document.admissionFor,
                examDate: document.examDate,
                examCenterVenue: document.examCenterVenue,
            },
            delivery: {
                whatsappNumber: document.whatsappNumber,
                email: document.email,
                emailSent: emailDelivery.sent,
                emailStatusMessage: emailDelivery.message,
                message: applicantMessage,
                whatsappShareUrl: `https://wa.me/91${document.whatsappNumber}?text=${encodeURIComponent(applicantMessage)}`,
            },
        };
    }
    async listAdmissions() {
        if (!this.firebase.isAvailable()) {
            return {
                items: [],
                total: 0,
                updatedAt: new Date().toISOString(),
            };
        }
        const admissions = await this.firebase.list('admissions');
        const items = Object.values(admissions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return {
            items,
            total: items.length,
            updatedAt: new Date().toISOString(),
        };
    }
    async findAdmissionByEmail(email, studentDateOfBirth) {
        const admissions = await this.firebase.list('admissions');
        const normalizedEmail = email.trim().toLowerCase();
        const matchingByEmail = Object.values(admissions).find((candidate) => candidate.email.trim().toLowerCase() === normalizedEmail);
        if (matchingByEmail && matchingByEmail.studentDateOfBirth !== studentDateOfBirth) {
            const authorityEmail = await this.getAuthorityEmail();
            throw new common_1.BadRequestException(`An application already exists for this email, but the date of birth does not match. Contact the admission authority at ${authorityEmail}.`);
        }
        const admission = matchingByEmail && matchingByEmail.studentDateOfBirth === studentDateOfBirth ? matchingByEmail : null;
        if (!admission) {
            return {
                found: false,
                admission: null,
            };
        }
        return {
            found: true,
            admission,
        };
    }
    async updateAdmission(applicationNo, dto) {
        const existing = await this.firebase.get(`admissions/${applicationNo}`);
        if (!existing) {
            throw new common_1.NotFoundException(`Admission ${applicationNo} not found.`);
        }
        const normalizedAdmissionFor = (dto.admissionFor || existing.admissionFor || 'Secondary (8-10)').trim();
        const normalizedRemarks = dto.remarks?.trim() || undefined;
        const normalizedResultSubject = dto.resultSubject?.trim() || undefined;
        const normalizedResultMark = dto.resultMark?.trim() || undefined;
        if (normalizedResultMark && !normalizedResultSubject) {
            throw new common_1.BadRequestException('Result subject is required before saving a mark.');
        }
        const updated = {
            ...existing,
            ...dto,
            admissionFor: normalizedAdmissionFor,
            remarks: normalizedRemarks,
            resultSubject: normalizedResultSubject,
            resultMark: normalizedResultMark,
            applicationNo: existing.applicationNo,
            hallTicketNo: existing.hallTicketNo,
            createdAt: existing.createdAt,
        };
        await this.firebase.set(`admissions/${applicationNo}`, updated);
        return {
            message: 'Admission updated successfully.',
            item: updated,
        };
    }
    async deleteAdmission(applicationNo) {
        const existing = await this.firebase.get(`admissions/${applicationNo}`);
        if (!existing) {
            throw new common_1.NotFoundException(`Admission ${applicationNo} not found.`);
        }
        await this.firebase.remove(`admissions/${applicationNo}`);
        return {
            message: 'Admission deleted successfully.',
            applicationNo,
        };
    }
    async getAuthorityEmail() {
        try {
            const content = await this.firebase.get(HOME_CONTENT_DB_PATH);
            return content?.admission?.campus?.authorityEmail || DEFAULT_AUTHORITY_EMAIL;
        }
        catch {
            return DEFAULT_AUTHORITY_EMAIL;
        }
    }
    async getHallTicket(applicationNo, studentDateOfBirth) {
        const admission = await this.firebase.get(`admissions/${applicationNo}`);
        const hallTicketSettings = await this.getHallTicketSettings();
        if (!admission || admission.studentDateOfBirth !== studentDateOfBirth) {
            throw new common_1.NotFoundException('Candidate not found for the provided application number and date of birth.');
        }
        return {
            institution: {
                title1: hallTicketSettings.title1,
                title2: hallTicketSettings.title2,
                footerLine1: hallTicketSettings.footerLine1,
                footerLine2: hallTicketSettings.footerLine2,
                footerLine3: hallTicketSettings.footerLine3,
                footerLine4: hallTicketSettings.footerLine4,
                footerLine5: hallTicketSettings.footerLine5,
            },
            hallTicket: {
                applicationNo: admission.applicationNo,
                hallTicketNo: admission.hallTicketNo,
                studentName: admission.studentName,
                fatherName: admission.fatherName,
                guardianName: admission.guardianName,
                admissionFor: admission.admissionFor,
                dateOfBirth: admission.studentDateOfBirth,
                examCenterVenue: admission.examCenterVenue,
                examDate: admission.examDate,
                guardianRelation: admission.guardianRelation,
                mobileNumber: admission.mobileNumber,
                whatsappNumber: admission.whatsappNumber,
                email: admission.email,
                photoDataUrl: admission.photoDataUrl,
                identificationMarks: [admission.identificationMark1, admission.identificationMark2],
            },
        };
    }
    async getExamResult(applicationNo, studentDateOfBirth) {
        const admission = await this.firebase.get(`admissions/${applicationNo}`);
        const hallTicketSettings = await this.getHallTicketSettings();
        if (!admission || admission.studentDateOfBirth !== studentDateOfBirth) {
            throw new common_1.NotFoundException('Candidate not found for the provided application number and date of birth.');
        }
        const marksObtained = (admission.resultMark ?? '').trim();
        const subject = (admission.resultSubject ?? '').trim();
        const numericMark = Number(marksObtained);
        const totalMark = 100;
        const hasNumericMark = marksObtained !== '' && Number.isFinite(numericMark);
        const grade = hasNumericMark ? this.resolveGrade(numericMark) : '-';
        const resultStatus = 'Congratulations! You are eligible to participate the interview for admission to the MANNANIYYA UMARUL FAROOQ CAMPUS KILIKOLLOOR, KOLLAM under the MUFIED EDUCATION SYSTEM.';
        return {
            institution: {
                title1: hallTicketSettings.title1,
                title2: hallTicketSettings.title2,
                footerLine1: hallTicketSettings.footerLine1,
                footerLine2: hallTicketSettings.footerLine2,
                footerLine3: hallTicketSettings.footerLine3,
                footerLine4: hallTicketSettings.footerLine4,
                footerLine5: hallTicketSettings.footerLine5,
            },
            examResult: {
                applicationNo: admission.applicationNo,
                hallTicketNo: admission.hallTicketNo,
                studentName: admission.studentName,
                fatherOrGuardianName: admission.guardianName || admission.fatherName,
                dateOfBirth: admission.studentDateOfBirth,
                admissionFor: admission.admissionFor,
                examCenterVenue: admission.examCenterVenue,
                resultPublishedOn: this.getTomorrowDateString(),
                totalMark,
                marksObtained,
                grade,
                resultSubject: subject,
                photoDataUrl: admission.photoDataUrl,
                resultStatus,
            },
        };
    }
    async getHallTicketSettings() {
        try {
            const content = await this.firebase.get(HOME_CONTENT_DB_PATH);
            return (content?.hallTicket ?? {
                title1: 'Jamia Mannaniyya Islamic University, Varkala',
                title2: 'Mannaniyya Unified Faculty of Integrated Education',
                footerLine1: 'Mannaniyya Unified Faculty of Integrated Education Department',
                footerLine2: 'Mannaniyya Umarul Farooq Campus, Kilikolloor, Kollam-4',
                footerLine3: 'Ph: 04742733868, Mob: 9447724432, 9895833868',
                footerLine4: 'mufied313@gmail.com, www.mufied.in/admin-ui',
                footerLine5: 'Cource Recognized by: Jamia Mannaniyya Islamic University, Varkkala',
            });
        }
        catch {
            return {
                title1: 'Jamia Mannaniyya Islamic University, Varkala',
                title2: 'Mannaniyya Unified Faculty of Integrated Education',
                footerLine1: 'Mannaniyya Unified Faculty of Integrated Education Department',
                footerLine2: 'Mannaniyya Umarul Farooq Campus, Kilikolloor, Kollam-4',
                footerLine3: 'Ph: 04742733868, Mob: 9447724432, 9895833868',
                footerLine4: 'mufied313@gmail.com, www.mufied.in/admin-ui',
                footerLine5: 'Cource Recognized by: Jamia Mannaniyya Islamic University, Varkkala',
            };
        }
    }
    resolveGrade(mark) {
        if (mark >= 90) {
            return 'A+';
        }
        if (mark >= 80) {
            return 'A';
        }
        if (mark >= 70) {
            return 'B+';
        }
        if (mark >= 60) {
            return 'B';
        }
        if (mark >= 50) {
            return 'C+';
        }
        if (mark >= 40) {
            return 'C';
        }
        return 'D';
    }
    getTomorrowDateString() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const year = tomorrow.getFullYear();
        return `${day}/${month}/${year}`;
    }
};
exports.AdmissionService = AdmissionService;
exports.AdmissionService = AdmissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        email_service_1.EmailService])
], AdmissionService);
//# sourceMappingURL=admission.service.js.map