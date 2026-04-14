import { CreateAdmissionDto } from './dto/create-admission.dto';
import { AdmissionService } from './admission.service';
export declare class AdmissionController {
    private readonly admissionService;
    constructor(admissionService: AdmissionService);
    create(dto: CreateAdmissionDto): Promise<{
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
    list(): Promise<{
        items: (CreateAdmissionDto & {
            applicationNo: string;
            hallTicketNo: string;
            createdAt: string;
        })[];
        total: number;
        updatedAt: string;
    }>;
    update(applicationNo: string, dto: CreateAdmissionDto): Promise<{
        message: string;
        item: CreateAdmissionDto & {
            applicationNo: string;
            hallTicketNo: string;
            createdAt: string;
        };
    }>;
    remove(applicationNo: string): Promise<{
        message: string;
        applicationNo: string;
    }>;
    lookup(email: string, studentDateOfBirth: string): Promise<{
        found: boolean;
        admission: null;
    } | {
        found: boolean;
        admission: CreateAdmissionDto & {
            applicationNo: string;
            hallTicketNo: string;
            createdAt: string;
        };
    }>;
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
}
