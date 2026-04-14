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
exports.HomeContentService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../core/firebase.service");
const static_home_content_1 = require("./static-home-content");
const HOME_CONTENT_DB_PATH = 'content/home';
const DEFAULT_PUBLICATION_CARDS = static_home_content_1.STATIC_HOME_CONTENT.publications.cards;
let HomeContentService = class HomeContentService {
    firebase;
    constructor(firebase) {
        this.firebase = firebase;
    }
    async getHomeContent() {
        if (!this.firebase.isAvailable()) {
            return static_home_content_1.STATIC_HOME_CONTENT;
        }
        const content = await this.firebase.get(HOME_CONTENT_DB_PATH);
        if (content) {
            const normalized = this.normalizeContent(content);
            if (this.requiresMigration(content)) {
                await this.firebase.set(HOME_CONTENT_DB_PATH, normalized);
            }
            return normalized;
        }
        await this.firebase.set(HOME_CONTENT_DB_PATH, static_home_content_1.STATIC_HOME_CONTENT);
        return static_home_content_1.STATIC_HOME_CONTENT;
    }
    async updateHomeContent(content) {
        const normalized = this.stripUndefined(this.normalizeContent(content));
        if (!this.firebase.isAvailable()) {
            return {
                message: 'Firebase is not configured in this environment. Static home content is available through the API, but the database was not updated.',
                content: normalized,
            };
        }
        await this.firebase.set(HOME_CONTENT_DB_PATH, normalized);
        return {
            message: 'Home content saved successfully.',
            content: normalized,
        };
    }
    async deletePublicationCard(index) {
        const normalized = await this.getHomeContent();
        if (index < 0 || index >= normalized.publications.cards.length) {
            throw new common_1.BadRequestException('The requested PDF could not be found.');
        }
        const [removedCard] = normalized.publications.cards.splice(index, 1);
        await this.firebase.deletePublicFileByUrl(removedCard?.href ?? '');
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'PDF deleted successfully.',
            content: result.content,
        };
    }
    async uploadPublicationPdf(index, kind, file) {
        const normalized = await this.getHomeContent();
        if (index < 0 || index >= normalized.publications.cards.length) {
            throw new common_1.BadRequestException('The selected document slot does not exist.');
        }
        if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
            throw new common_1.BadRequestException('PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.');
        }
        const existingCard = normalized.publications.cards[index];
        const safeName = this.slugifyFileName(file.originalname);
        const storagePath = `publications/${kind}/${Date.now()}-${safeName}`;
        const href = await this.firebase.uploadPublicFile(storagePath, file.buffer, 'application/pdf', {
            originalName: file.originalname,
            kind,
        });
        await this.firebase.deletePublicFileByUrl(existingCard.href);
        existingCard.href = href;
        existingCard.kind = kind;
        existingCard.ctaLabel = existingCard.ctaLabel?.trim() || 'Open PDF';
        existingCard.title = existingCard.title?.trim() || this.titleFromFileName(file.originalname);
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'PDF uploaded successfully.',
            content: result.content,
            href,
        };
    }
    async createPublicationPdfUpload(index, kind, fileName) {
        const normalized = await this.getHomeContent();
        if (index < 0 || index >= normalized.publications.cards.length) {
            throw new common_1.BadRequestException('The selected document slot does not exist.');
        }
        if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
            throw new common_1.BadRequestException('PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.');
        }
        const safeName = this.slugifyFileName(fileName);
        const storagePath = `publications/${kind}/${Date.now()}-${safeName}`;
        const uploadUrl = await this.firebase.createSignedUploadUrl(storagePath, 'application/pdf');
        return { uploadUrl, storagePath };
    }
    async finalizePublicationPdfUpload(index, kind, storagePath, fileName) {
        const normalized = await this.getHomeContent();
        if (index < 0 || index >= normalized.publications.cards.length) {
            throw new common_1.BadRequestException('The selected document slot does not exist.');
        }
        if (!storagePath.startsWith(`publications/${kind}/`)) {
            throw new common_1.BadRequestException('The upload target does not match the selected document type.');
        }
        const href = await this.firebase.publishUploadedFile(storagePath);
        const existingCard = normalized.publications.cards[index];
        await this.firebase.deletePublicFileByUrl(existingCard.href);
        existingCard.href = href;
        existingCard.kind = kind;
        existingCard.ctaLabel = existingCard.ctaLabel?.trim() || 'Open PDF';
        existingCard.title = existingCard.title?.trim() || this.titleFromFileName(fileName);
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'PDF uploaded successfully.',
            content: result.content,
            href,
        };
    }
    async uploadEventImage(eventIndex, file) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event does not exist.');
        }
        if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
            throw new common_1.BadRequestException('Image upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.');
        }
        const event = normalized.events.cards[eventIndex];
        const extension = this.imageExtensionFromFile(file);
        const storagePath = `events/images/${Date.now()}-${this.slugifyBaseName(file.originalname)}.${extension}`;
        const href = await this.firebase.uploadPublicFile(storagePath, file.buffer, file.mimetype || `image/${extension}`, {
            originalName: file.originalname,
            eventTitle: event.title || `event-${eventIndex + 1}`,
        });
        await this.firebase.deletePublicFileByUrl(event.image);
        event.image = href;
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'Event image uploaded successfully.',
            content: result.content,
            href,
        };
    }
    async uploadEventPdf(eventIndex, pdfIndex, file) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event does not exist.');
        }
        const event = normalized.events.cards[eventIndex];
        if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
            throw new common_1.BadRequestException('The selected event PDF slot does not exist.');
        }
        if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
            throw new common_1.BadRequestException('PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.');
        }
        const existingPdf = event.pdfs[pdfIndex];
        const safeName = this.slugifyFileName(file.originalname);
        const storagePath = `events/pdfs/${Date.now()}-${safeName}`;
        const href = await this.firebase.uploadPublicFile(storagePath, file.buffer, 'application/pdf', {
            originalName: file.originalname,
            eventTitle: event.title || `event-${eventIndex + 1}`,
        });
        await this.firebase.deletePublicFileByUrl(existingPdf.href);
        existingPdf.href = href;
        existingPdf.ctaLabel = existingPdf.ctaLabel?.trim() || 'Preview PDF';
        existingPdf.title = existingPdf.title?.trim() || this.titleFromFileName(file.originalname);
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'Event PDF uploaded successfully.',
            content: result.content,
            href,
        };
    }
    async createEventPdfUpload(eventIndex, pdfIndex, fileName) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event does not exist.');
        }
        const event = normalized.events.cards[eventIndex];
        if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
            throw new common_1.BadRequestException('The selected event PDF slot does not exist.');
        }
        if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
            throw new common_1.BadRequestException('PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.');
        }
        const safeName = this.slugifyFileName(fileName);
        const storagePath = `events/pdfs/${Date.now()}-${safeName}`;
        const uploadUrl = await this.firebase.createSignedUploadUrl(storagePath, 'application/pdf');
        return { uploadUrl, storagePath };
    }
    async finalizeEventPdfUpload(eventIndex, pdfIndex, storagePath, fileName) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event does not exist.');
        }
        const event = normalized.events.cards[eventIndex];
        if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
            throw new common_1.BadRequestException('The selected event PDF slot does not exist.');
        }
        if (!storagePath.startsWith('events/pdfs/')) {
            throw new common_1.BadRequestException('The upload target is invalid for event PDFs.');
        }
        const href = await this.firebase.publishUploadedFile(storagePath);
        const existingPdf = event.pdfs[pdfIndex];
        await this.firebase.deletePublicFileByUrl(existingPdf.href);
        existingPdf.href = href;
        existingPdf.ctaLabel = existingPdf.ctaLabel?.trim() || 'Preview PDF';
        existingPdf.title = existingPdf.title?.trim() || this.titleFromFileName(fileName);
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'Event PDF uploaded successfully.',
            content: result.content,
            href,
        };
    }
    async deleteEventPdf(eventIndex, pdfIndex) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event does not exist.');
        }
        const event = normalized.events.cards[eventIndex];
        if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
            throw new common_1.BadRequestException('The selected event PDF could not be found.');
        }
        const [removedPdf] = event.pdfs.splice(pdfIndex, 1);
        await this.firebase.deletePublicFileByUrl(removedPdf?.href ?? '');
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'Event PDF deleted successfully.',
            content: result.content,
        };
    }
    async deleteEventCard(eventIndex) {
        const normalized = await this.getHomeContent();
        if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
            throw new common_1.BadRequestException('The selected event could not be found.');
        }
        const [removedEvent] = normalized.events.cards.splice(eventIndex, 1);
        await this.firebase.deletePublicFileByUrl(removedEvent?.image ?? '');
        for (const pdf of removedEvent?.pdfs ?? []) {
            await this.firebase.deletePublicFileByUrl(pdf.href ?? '');
        }
        const result = await this.updateHomeContent(normalized);
        return {
            message: 'Event deleted successfully.',
            content: result.content,
        };
    }
    async getAdminSnapshot() {
        const content = await this.getHomeContent();
        return {
            content,
            summary: {
                heroFloatingItems: content.hero.floatingCards.primary.items.length,
                heroCardPoints: content.hero.floatingCards.secondary.items.length,
                introParagraphs: content.intro.paragraphs.length,
                introStats: content.intro.stats.length,
                programmeCards: content.programmes.cards.length,
                eventCards: content.events.cards.length,
                admissionSteps: content.admission.process.items.length,
                publicationCards: content.publications.cards.length,
                footerCards: content.footer.cards.length,
            },
            updatedAt: new Date().toISOString(),
        };
    }
    normalizeContent(content) {
        const hero = content.hero;
        const article1 = content.article1;
        const article2 = content.article2;
        const publications = this.normalizePublicationCards(content.publications?.cards ?? []);
        const events = this.normalizeEventCards(content.events?.cards);
        return {
            ...content,
            hero: {
                bannerImage: hero.bannerImage,
                logoImage: hero.logoImage,
                eyebrow: hero.eyebrow,
                title: hero.title,
                subtitle: hero.subtitle,
                primaryActionLabel: hero.primaryActionLabel,
                primaryActionHref: hero.primaryActionHref,
                secondaryActionLabel: hero.secondaryActionLabel,
                secondaryActionHref: hero.secondaryActionHref,
                badgeText: hero.badgeText ?? hero.card?.kicker ?? static_home_content_1.STATIC_HOME_CONTENT.hero.badgeText,
                floatingCards: {
                    primary: {
                        title: hero.floatingCards?.primary?.title ?? hero.card?.points?.[0] ?? static_home_content_1.STATIC_HOME_CONTENT.hero.floatingCards.primary.title,
                        items: hero.floatingCards?.primary?.items ??
                            hero.floatingItems ??
                            static_home_content_1.STATIC_HOME_CONTENT.hero.floatingCards.primary.items,
                    },
                    secondary: {
                        title: hero.floatingCards?.secondary?.title ??
                            hero.card?.points?.[1] ??
                            static_home_content_1.STATIC_HOME_CONTENT.hero.floatingCards.secondary.title,
                        items: hero.floatingCards?.secondary?.items ??
                            [hero.card?.body ?? hero.card?.points?.[2] ?? static_home_content_1.STATIC_HOME_CONTENT.hero.floatingCards.secondary.items[0]],
                    },
                },
            },
            article1: {
                section1: article1?.section1 ?? static_home_content_1.STATIC_HOME_CONTENT.article1.section1,
                section2: article1?.section2 ?? static_home_content_1.STATIC_HOME_CONTENT.article1.section2,
            },
            article2: {
                section1: article2?.section1 ?? static_home_content_1.STATIC_HOME_CONTENT.article2.section1,
                section2: article2?.section2 ?? static_home_content_1.STATIC_HOME_CONTENT.article2.section2,
                section3: article2?.section3 ?? static_home_content_1.STATIC_HOME_CONTENT.article2.section3,
                section4: article2?.section4 ?? static_home_content_1.STATIC_HOME_CONTENT.article2.section4,
            },
            admission: {
                ...content.admission,
                process: {
                    ...content.admission.process,
                },
                campus: {
                    ...content.admission.campus,
                    authorityEmail: content.admission?.campus?.authorityEmail ?? static_home_content_1.STATIC_HOME_CONTENT.admission.campus.authorityEmail,
                },
            },
            publications: {
                label: content.publications?.label ?? static_home_content_1.STATIC_HOME_CONTENT.publications.label,
                title: content.publications?.title ?? static_home_content_1.STATIC_HOME_CONTENT.publications.title,
                subtitle: content.publications?.subtitle ?? static_home_content_1.STATIC_HOME_CONTENT.publications.subtitle,
                cards: publications,
            },
            events: {
                label: content.events?.label ?? static_home_content_1.STATIC_HOME_CONTENT.events.label,
                title: content.events?.title ?? static_home_content_1.STATIC_HOME_CONTENT.events.title,
                subtitle: content.events?.subtitle ?? static_home_content_1.STATIC_HOME_CONTENT.events.subtitle,
                cards: events,
            },
            hallTicket: {
                title1: content.hallTicket?.title1 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.title1,
                title2: content.hallTicket?.title2 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.title2,
                footerLine1: content.hallTicket?.footerLine1 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.footerLine1,
                footerLine2: content.hallTicket?.footerLine2 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.footerLine2,
                footerLine3: content.hallTicket?.footerLine3 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.footerLine3,
                footerLine4: content.hallTicket?.footerLine4 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.footerLine4,
                footerLine5: content.hallTicket?.footerLine5 ?? static_home_content_1.STATIC_HOME_CONTENT.hallTicket.footerLine5,
            },
        };
    }
    requiresMigration(content) {
        const hero = content.hero;
        return (!hero.floatingCards ||
            !hero.badgeText ||
            !!hero.floatingItems ||
            !!hero.card ||
            !content.article1 ||
            !content.article2 ||
            !content.events ||
            content.publications?.cards?.some((card) => Boolean(card.kind) && !card.href?.trim()) ||
            content.publications?.cards?.some((card) => this.isPdfCard(card) && !card.kind) ||
            !content.admission?.campus?.authorityEmail ||
            !content.hallTicket);
    }
    normalizePublicationCards(cards) {
        const hasExplicitKinds = cards.some((card) => Boolean(card.kind));
        const normalizedCards = cards.map((card) => ({
            ...card,
            kind: this.inferDocumentKind(card),
            href: this.normalizePublicationHref(card),
        }));
        const hasQuestionBankPdf = normalizedCards.some((card) => card.kind === 'question-bank');
        if (!hasExplicitKinds && !hasQuestionBankPdf) {
            const questionBankCard = DEFAULT_PUBLICATION_CARDS.find((card) => card.kind === 'question-bank');
            if (questionBankCard?.kind) {
                normalizedCards.unshift({
                    ...questionBankCard,
                    kind: questionBankCard.kind,
                });
            }
        }
        return normalizedCards;
    }
    normalizePublicationHref(card) {
        const href = card.href?.trim() ?? '';
        if (href) {
            return href;
        }
        const kind = this.inferDocumentKind(card);
        if (!kind) {
            return '';
        }
        return (DEFAULT_PUBLICATION_CARDS.find((item) => item.kind === kind)?.href ??
            '');
    }
    normalizeEventCards(cards) {
        if (cards === undefined) {
            return [];
        }
        return cards.map((card) => ({
            title: card.title ?? '',
            descriptions: Array.isArray(card.descriptions) ? card.descriptions.filter((item) => typeof item === 'string') : [],
            image: card.image ?? '',
            pdfs: this.normalizeEventPdfs(card.pdfs ?? []),
        }));
    }
    normalizeEventPdfs(pdfs) {
        return pdfs.map((pdf) => ({
            title: pdf.title ?? '',
            href: pdf.href ?? '',
            ctaLabel: pdf.ctaLabel ?? 'Preview PDF',
        }));
    }
    inferDocumentKind(card) {
        if (card.kind) {
            return card.kind;
        }
        if (!this.isPdfCard(card)) {
            return undefined;
        }
        return /\/qn-bank\//i.test(card.href) ? 'question-bank' : 'other-docs';
    }
    isPdfCard(card) {
        const href = card.href ?? '';
        const ctaLabel = card.ctaLabel ?? '';
        return /\.pdf($|\?)/i.test(href) || ctaLabel.toLowerCase().includes('pdf');
    }
    slugifyFileName(fileName) {
        const normalized = fileName
            .toLowerCase()
            .replace(/[^a-z0-9.-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return normalized.endsWith('.pdf') ? normalized : `${normalized}.pdf`;
    }
    slugifyBaseName(fileName) {
        return fileName
            .toLowerCase()
            .replace(/\.[a-z0-9]+$/i, '')
            .replace(/[^a-z0-9.-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    imageExtensionFromFile(file) {
        if (file.mimetype === 'image/png') {
            return 'png';
        }
        if (file.mimetype === 'image/webp') {
            return 'webp';
        }
        if (file.mimetype === 'image/gif') {
            return 'gif';
        }
        return 'jpg';
    }
    titleFromFileName(fileName) {
        return fileName
            .replace(/\.pdf$/i, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    stripUndefined(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.stripUndefined(item));
        }
        if (value && typeof value === 'object') {
            return Object.fromEntries(Object.entries(value)
                .filter(([, entryValue]) => entryValue !== undefined)
                .map(([key, entryValue]) => [key, this.stripUndefined(entryValue)]));
        }
        return value;
    }
};
exports.HomeContentService = HomeContentService;
exports.HomeContentService = HomeContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], HomeContentService);
//# sourceMappingURL=home-content.service.js.map