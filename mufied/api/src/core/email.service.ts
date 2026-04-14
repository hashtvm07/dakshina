import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config-service';
import * as nodemailer from 'nodemailer';

type AdmissionEmailPayload = {
  to: string;
  applicationNo: string;
  hallTicketNo: string;
  studentName: string;
  guardianName: string;
  admissionFor: string;
  examDate: string;
  examCenterVenue: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly cfg: ConfigService) {}

  async sendAdmissionConfirmation(payload: AdmissionEmailPayload) {
    const smtpHost = process.env.SMTP_HOST || this.cfg.get<string>('email.smtpHost', '');
    const smtpPort = Number(process.env.SMTP_PORT || this.cfg.get<string>('email.smtpPort', '587'));
    const smtpUser = process.env.SMTP_USER || this.cfg.get<string>('email.smtpUser', '');
    const smtpPass = process.env.SMTP_PASS || this.cfg.get<string>('email.smtpPass', '');
    const smtpFrom = process.env.SMTP_FROM || this.cfg.get<string>('email.smtpFrom', '');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
      return {
        sent: false,
        skipped: true,
        message: 'Email not sent because SMTP is not configured.',
      };
    }

    try {
      const transporter =
        this.transporter ||
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
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`Admission email failed for ${payload.to}: ${reason}`);

      return {
        sent: false,
        skipped: false,
        message: `Admission saved, but email sending failed: ${reason}`,
      };
    }
  }
}
