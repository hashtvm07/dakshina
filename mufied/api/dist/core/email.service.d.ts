import { ConfigService } from 'src/config/config-service';
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
export declare class EmailService {
    private readonly cfg;
    private readonly logger;
    private transporter;
    constructor(cfg: ConfigService);
    sendAdmissionConfirmation(payload: AdmissionEmailPayload): Promise<{
        sent: boolean;
        skipped: boolean;
        message: string;
    }>;
}
export {};
