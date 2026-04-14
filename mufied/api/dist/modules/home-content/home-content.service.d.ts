import { FirebaseService } from 'src/core/firebase.service';
import { HomeContentDocument, HomeContentDocumentKind } from './home-content.types';
type UploadedPdfFile = {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
};
type UploadedAssetFile = UploadedPdfFile;
export declare class HomeContentService {
    private readonly firebase;
    constructor(firebase: FirebaseService);
    getHomeContent(): Promise<HomeContentDocument>;
    updateHomeContent(content: HomeContentDocument): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    deletePublicationCard(index: number): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    uploadPublicationPdf(index: number, kind: HomeContentDocumentKind, file: UploadedPdfFile): Promise<{
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
    uploadEventImage(eventIndex: number, file: UploadedAssetFile): Promise<{
        message: string;
        content: HomeContentDocument;
        href: string;
    }>;
    uploadEventPdf(eventIndex: number, pdfIndex: number, file: UploadedPdfFile): Promise<{
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
    deleteEventPdf(eventIndex: number, pdfIndex: number): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    deleteEventCard(eventIndex: number): Promise<{
        message: string;
        content: HomeContentDocument;
    }>;
    getAdminSnapshot(): Promise<{
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
    private normalizeContent;
    private requiresMigration;
    private normalizePublicationCards;
    private normalizePublicationHref;
    private normalizeEventCards;
    private normalizeEventPdfs;
    private inferDocumentKind;
    private isPdfCard;
    private slugifyFileName;
    private slugifyBaseName;
    private imageExtensionFromFile;
    private titleFromFileName;
    private stripUndefined;
}
export {};
