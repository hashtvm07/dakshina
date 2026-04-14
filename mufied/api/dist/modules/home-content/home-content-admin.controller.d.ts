import { HomeContentService } from './home-content.service';
import { HomeContentDocument, HomeContentDocumentKind } from './home-content.types';
import { DeleteEventCardDto, DeleteEventPdfDto, DeletePublicationCardDto, HomeContentDto } from './dto/home-content.dto';
type UploadedPdfFile = {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
};
export declare class HomeContentAdminController {
    private readonly homeContentService;
    constructor(homeContentService: HomeContentService);
    getHomeContent(): Promise<{
        content: HomeContentDocument;
        summary: {
            heroFloatingItems: number;
            heroCardPoints: number;
            introParagraphs: number;
            introStats: number;
            programmeCards: number;
            eventCards: number;
            admissionSteps: number;
            publicationCards: number;
            footerCards: number;
        };
        updatedAt: string;
    }>;
    updateHomeContent(content: HomeContentDto): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    deletePublicationCard(payload: DeletePublicationCardDto): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    uploadPublicationPdf(file: UploadedPdfFile | undefined, index: number, kind: HomeContentDocumentKind): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    createPublicationPdfUpload(index: number, kind: HomeContentDocumentKind, fileName: string): Promise<{
        uploadUrl: string;
        storagePath: string;
    }>;
    finalizePublicationPdfUpload(index: number, kind: HomeContentDocumentKind, storagePath: string, fileName: string): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    uploadEventImage(file: UploadedPdfFile | undefined, eventIndex: number): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    uploadEventPdf(file: UploadedPdfFile | undefined, eventIndex: number, pdfIndex: number): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    createEventPdfUpload(eventIndex: number, pdfIndex: number, fileName: string): Promise<{
        uploadUrl: string;
        storagePath: string;
    }>;
    finalizeEventPdfUpload(eventIndex: number, pdfIndex: number, storagePath: string, fileName: string): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    deleteEventPdf(payload: DeleteEventPdfDto): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    deleteEventCard(payload: DeleteEventCardDto): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
}
export {};
