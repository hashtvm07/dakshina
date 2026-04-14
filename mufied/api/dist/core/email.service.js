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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../config/config-service");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    cfg;
    logger = new common_1.Logger(EmailService_1.name);
    transporter = null;
    constructor(cfg) {
        this.cfg = cfg;
    }
    async sendAdmissionConfirmation(payload) {
        const smtpHost = process.env.SMTP_HOST || this.cfg.get('email.smtpHost', '');
        const smtpPort = Number(process.env.SMTP_PORT || this.cfg.get('email.smtpPort', '587'));
        const smtpUser = process.env.SMTP_USER || this.cfg.get('email.smtpUser', '');
        const smtpPass = process.env.SMTP_PASS || this.cfg.get('email.smtpPass', '');
        const smtpFrom = process.env.SMTP_FROM || this.cfg.get('email.smtpFrom', '');
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
            return {
                sent: false,
                skipped: true,
                message: 'Email not sent because SMTP is not configured.',
            };
        }
        try {
            const transporter = this.transporter ||
                nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass,
                    },
                });
            this.transporter = transporter;
            await transporter.sendMail({
                from: smtpFrom,
                to: payload.to,
                subject: `Admission Application ${payload.applicationNo}`,
                text: [
                    'Admission submitted successfully.',
                    '',
                    `Application No: ${payload.applicationNo}`,
                    `Hall Ticket No: ${payload.hallTicketNo}`,
                    `Candidate: ${payload.studentName}`,
                    `Guardian: ${payload.guardianName}`,
                    `Programme: ${payload.admissionFor}`,
                    `Exam Date: ${payload.examDate}`,
                    `Exam Venue: ${payload.examCenterVenue}`,
                ].join('\n'),
                html: `
          <h2>Admission Submitted Successfully</h2>
          <p>Your MUFIED admission has been recorded.</p>
          <p><strong>Application No:</strong> ${payload.applicationNo}</p>
          <p><strong>Hall Ticket No:</strong> ${payload.hallTicketNo}</p>
          <p><strong>Candidate:</strong> ${payload.studentName}</p>
          <p><strong>Guardian:</strong> ${payload.guardianName}</p>
          <p><strong>Programme:</strong> ${payload.admissionFor}</p>
          <p><strong>Exam Date:</strong> ${payload.examDate}</p>
          <p><strong>Exam Venue:</strong> ${payload.examCenterVenue}</p>
        `,
            });
            return {
                sent: true,
                skipped: false,
                message: `Confirmation email sent to ${payload.to}.`,
            };
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : 'unknown error';
            this.logger.warn(`Admission email failed for ${payload.to}: ${reason}`);
            return {
                sent: false,
                skipped: false,
                message: `Admission saved, but email sending failed: ${reason}`,
            };
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map