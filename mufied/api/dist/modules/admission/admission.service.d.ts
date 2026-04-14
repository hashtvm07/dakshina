import { EmailService } from 'src/core/email.service';
import { FirebaseService } from 'src/core/firebase.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
type AdmissionDocument = CreateAdmissionDto & {
    applicationNo: string;
    hallTicketNo: string;
    createdAt: string;
};
export declare class AdmissionService {
    private readonly firebase;
    private readonly emailService;
    constructor(firebase: FirebaseService, emailService: EmailService);
    createAdmission(dto: CreateAdmissionDto): Promise<{
        message: string;
        applicationNo: string;
        hallTicketNo: string;
        candidate: {
            studentName: string;
            studentDateOfBirth: string;
            guardianName: string;
            admissionFor: string;
            examDate: string;
            examCenterVenue: string;
        };
        delivery: {
            whatsappNumber: string;
            email: string;
            emailSent: boolean;
            emailStatusMessage: string;
            message: string;
            whatsappShareUrl: string;
        };
    }>;
    listAdmissions(): Promise<{
        items: AdmissionDocument[];
        total: number;
        updatedAt: string;
    }>;
    findAdmissionByEmail(email: string, studentDateOfBirth: string): Promise<{
        found: boolean;
        admission: null;
    } | {
        found: boolean;
        admission: AdmissionDocument;
    }>;
    updateAdmission(applicationNo: string, dto: CreateAdmissionDto): Promise<{
        message: string;
        item: AdmissionDocument;
    }>;
    deleteAdmission(applicationNo: string): Promise<{
        message: string;
        applicationNo: string;
    }>;
    private getAuthorityEmail;
    getHallTicket(applicationNo: string, studentDateOfBirth: string): Promise<{
        institution: {
            title1: string;
            title2: string;
            footerLine1: string;
            footerLine2: string;
            footerLine3: string;
            footerLine4: string;
            footerLine5: string;
        };
        hallTicket: {
            applicationNo: string;
            hallTicketNo: string;
            studentName: string;
            fatherName: string;
            guardianName: string;
            admissionFor: string;
            dateOfBirth: string;
            examCenterVenue: string;
            examDate: string;
            guardianRelation: string;
            mobileNumber: string;
            whatsappNumber: string;
            email: string;
            photoDataUrl: string;
            identificationMarks: string[];
        };
    }>;
    getExamResult(applicationNo: string, studentDateOfBirth: string): Promise<{
        institution: {
            title1: string;
            title2: string;
            footerLine1: string;
            footerLine2: string;
            footerLine3: string;
            footerLine4: string;
            footerLine5: string;
        };
        examResult: {
            applicationNo: string;
            hallTicketNo: string;
            studentName: string;
            fatherOrGuardianName: string;
            dateOfBirth: string;
            admissionFor: string;
            examCenterVenue: string;
            resultPublishedOn: string;
            totalMark: number;
            marksObtained: string;
            grade: string;
            resultSubject: string;
            photoDataUrl: string;
            resultStatus: string;
        };
    }>;
    private getHallTicketSettings;
    private resolveGrade;
    private getTomorrowDateString;
}
export {};
