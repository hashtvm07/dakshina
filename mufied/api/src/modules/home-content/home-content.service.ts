import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/core/firebase.service';
import {
  HomeContentDocument,
  HomeContentDocumentKind,
  HomeContentEventCard,
  HomeContentEventPdf,
  HomeContentLinkCard,
} from './home-content.types';
import { STATIC_HOME_CONTENT } from './static-home-content';

const HOME_CONTENT_DB_PATH = 'content/home';
const DEFAULT_PUBLICATION_CARDS = STATIC_HOME_CONTENT.publications.cards;

type UploadedPdfFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

type UploadedAssetFile = UploadedPdfFile;

@Injectable()
export class HomeContentService {
  constructor(private readonly firebase: FirebaseService) {}

  async getHomeContent(): Promise<HomeContentDocument> {
    if (!this.firebase.isAvailable()) {
      return STATIC_HOME_CONTENT;
    }

    const content = await this.firebase.get<HomeContentDocument>(HOME_CONTENT_DB_PATH);

    if (content) {
      const normalized = this.normalizeContent(content);

      if (this.requiresMigration(content)) {
        await this.firebase.set(HOME_CONTENT_DB_PATH, normalized as unknown as Record<string, unknown>);
      }

      return normalized;
    }

    await this.firebase.set(HOME_CONTENT_DB_PATH, STATIC_HOME_CONTENT as unknown as Record<string, unknown>);
    return STATIC_HOME_CONTENT;
  }

  async updateHomeContent(content: HomeContentDocument) {
    const normalized = this.stripUndefined(this.normalizeContent(content)) as HomeContentDocument;

    if (!this.firebase.isAvailable()) {
      return {
        message:
          'Firebase is not configured in this environment. Static home content is available through the API, but the database was not updated.',
        content: normalized,
      };
    }

    await this.firebase.set(HOME_CONTENT_DB_PATH, normalized as unknown as Record<string, unknown>);

    return {
      message: 'Home content saved successfully.',
      content: normalized,
    };
  }

  async deletePublicationCard(index: number) {
    const normalized = await this.getHomeContent();

    if (index < 0 || index >= normalized.publications.cards.length) {
      throw new BadRequestException('The requested PDF could not be found.');
    }

    const [removedCard] = normalized.publications.cards.splice(index, 1);
    await this.firebase.deletePublicFileByUrl(removedCard?.href ?? '');
    const result = await this.updateHomeContent(normalized);

    return {
      message: 'PDF deleted successfully.',
      content: result.content,
    };
  }

  async uploadPublicationPdf(
    index: number,
    kind: HomeContentDocumentKind,
    file: UploadedPdfFile,
  ) {
    const normalized = await this.getHomeContent();

    if (index < 0 || index >= normalized.publications.cards.length) {
      throw new BadRequestException('The selected document slot does not exist.');
    }

    if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
      throw new BadRequestException(
        'PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.',
      );
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

  async createPublicationPdfUpload(
    index: number,
    kind: HomeContentDocumentKind,
    fileName: string,
  ) {
    const normalized = await this.getHomeContent();

    if (index < 0 || index >= normalized.publications.cards.length) {
      throw new BadRequestException('The selected document slot does not exist.');
    }

    if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
      throw new BadRequestException(
        'PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.',
      );
    }

    const safeName = this.slugifyFileName(fileName);
    const storagePath = `publications/${kind}/${Date.now()}-${safeName}`;
    const uploadUrl = await this.firebase.createSignedUploadUrl(storagePath, 'application/pdf');

    return { uploadUrl, storagePath };
  }

  async finalizePublicationPdfUpload(
    index: number,
    kind: HomeContentDocumentKind,
    storagePath: string,
    fileName: string,
  ) {
    const normalized = await this.getHomeContent();

    if (index < 0 || index >= normalized.publications.cards.length) {
      throw new BadRequestException('The selected document slot does not exist.');
    }

    if (!storagePath.startsWith(`publications/${kind}/`)) {
      throw new BadRequestException('The upload target does not match the selected document type.');
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

  async uploadEventImage(eventIndex: number, file: UploadedAssetFile) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event does not exist.');
    }

    if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
      throw new BadRequestException(
        'Image upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.',
      );
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

  async uploadEventPdf(eventIndex: number, pdfIndex: number, file: UploadedPdfFile) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event does not exist.');
    }

    const event = normalized.events.cards[eventIndex];
    if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
      throw new BadRequestException('The selected event PDF slot does not exist.');
    }

    if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
      throw new BadRequestException(
        'PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.',
      );
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

  async createEventPdfUpload(eventIndex: number, pdfIndex: number, fileName: string) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event does not exist.');
    }

    const event = normalized.events.cards[eventIndex];
    if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
      throw new BadRequestException('The selected event PDF slot does not exist.');
    }

    if (!(this.firebase.isStorageAvailable() || (await this.firebase.resolveStorageBucket()))) {
      throw new BadRequestException(
        'PDF upload is not configured on the server. Set FIREBASE_STORAGE_BUCKET and redeploy the API.',
      );
    }

    const safeName = this.slugifyFileName(fileName);
    const storagePath = `events/pdfs/${Date.now()}-${safeName}`;
    const uploadUrl = await this.firebase.createSignedUploadUrl(storagePath, 'application/pdf');

    return { uploadUrl, storagePath };
  }

  async finalizeEventPdfUpload(eventIndex: number, pdfIndex: number, storagePath: string, fileName: string) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event does not exist.');
    }

    const event = normalized.events.cards[eventIndex];
    if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
      throw new BadRequestException('The selected event PDF slot does not exist.');
    }

    if (!storagePath.startsWith('events/pdfs/')) {
      throw new BadRequestException('The upload target is invalid for event PDFs.');
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

  async deleteEventPdf(eventIndex: number, pdfIndex: number) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event does not exist.');
    }

    const event = normalized.events.cards[eventIndex];
    if (pdfIndex < 0 || pdfIndex >= event.pdfs.length) {
      throw new BadRequestException('The selected event PDF could not be found.');
    }

    const [removedPdf] = event.pdfs.splice(pdfIndex, 1);
    await this.firebase.deletePublicFileByUrl(removedPdf?.href ?? '');

    const result = await this.updateHomeContent(normalized);

    return {
      message: 'Event PDF deleted successfully.',
      content: result.content,
    };
  }

  async deleteEventCard(eventIndex: number) {
    const normalized = await this.getHomeContent();

    if (eventIndex < 0 || eventIndex >= normalized.events.cards.length) {
      throw new BadRequestException('The selected event could not be found.');
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

  private normalizeContent(content: HomeContentDocument): HomeContentDocument {
    const hero = content.hero as HomeContentDocument['hero'] & {
      floatingItems?: string[];
      card?: {
        kicker?: string;
        points?: string[];
        body?: string;
      };
      badgeText?: string;
      floatingCards?: {
        primary?: { title?: string; items?: string[] };
        secondary?: { title?: string; items?: string[] };
      };
    };
    const article1 = content.article1 as HomeContentDocument['article1'] | undefined;
    const article2 = content.article2 as HomeContentDocument['article2'] | undefined;
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
        badgeText: hero.badgeText ?? hero.card?.kicker ?? STATIC_HOME_CONTENT.hero.badgeText,
        floatingCards: {
          primary: {
            title: hero.floatingCards?.primary?.title ?? hero.card?.points?.[0] ?? STATIC_HOME_CONTENT.hero.floatingCards.primary.title,
            items:
              hero.floatingCards?.primary?.items ??
              hero.floatingItems ??
              STATIC_HOME_CONTENT.hero.floatingCards.primary.items,
          },
          secondary: {
            title:
              hero.floatingCards?.secondary?.title ??
              hero.card?.points?.[1] ??
              STATIC_HOME_CONTENT.hero.floatingCards.secondary.title,
            items:
              hero.floatingCards?.secondary?.items ??
              [hero.card?.body ?? hero.card?.points?.[2] ?? STATIC_HOME_CONTENT.hero.floatingCards.secondary.items[0]],
          },
        },
      },
      article1: {
        section1: article1?.section1 ?? STATIC_HOME_CONTENT.article1.section1,
        section2: article1?.section2 ?? STATIC_HOME_CONTENT.article1.section2,
      },
      article2: {
        section1: article2?.section1 ?? STATIC_HOME_CONTENT.article2.section1,
        section2: article2?.section2 ?? STATIC_HOME_CONTENT.article2.section2,
        section3: article2?.section3 ?? STATIC_HOME_CONTENT.article2.section3,
        section4: article2?.section4 ?? STATIC_HOME_CONTENT.article2.section4,
      },
      admission: {
        ...content.admission,
        process: {
          ...content.admission.process,
        },
        campus: {
          ...content.admission.campus,
          authorityEmail: content.admission?.campus?.authorityEmail ?? STATIC_HOME_CONTENT.admission.campus.authorityEmail,
        },
      },
      publications: {
        label: content.publications?.label ?? STATIC_HOME_CONTENT.publications.label,
        title: content.publications?.title ?? STATIC_HOME_CONTENT.publications.title,
        subtitle: content.publications?.subtitle ?? STATIC_HOME_CONTENT.publications.subtitle,
        cards: publications,
      },
      events: {
        label: content.events?.label ?? STATIC_HOME_CONTENT.events.label,
        title: content.events?.title ?? STATIC_HOME_CONTENT.events.title,
        subtitle: content.events?.subtitle ?? STATIC_HOME_CONTENT.events.subtitle,
        cards: events,
      },
      hallTicket: {
        title1: content.hallTicket?.title1 ?? STATIC_HOME_CONTENT.hallTicket.title1,
        title2: content.hallTicket?.title2 ?? STATIC_HOME_CONTENT.hallTicket.title2,
        footerLine1: content.hallTicket?.footerLine1 ?? STATIC_HOME_CONTENT.hallTicket.footerLine1,
        footerLine2: content.hallTicket?.footerLine2 ?? STATIC_HOME_CONTENT.hallTicket.footerLine2,
        footerLine3: content.hallTicket?.footerLine3 ?? STATIC_HOME_CONTENT.hallTicket.footerLine3,
        footerLine4: content.hallTicket?.footerLine4 ?? STATIC_HOME_CONTENT.hallTicket.footerLine4,
        footerLine5: content.hallTicket?.footerLine5 ?? STATIC_HOME_CONTENT.hallTicket.footerLine5,
        showExamResultMenu: content.hallTicket?.showExamResultMenu ?? STATIC_HOME_CONTENT.hallTicket.showExamResultMenu,
      },
    };
  }

  private requiresMigration(content: HomeContentDocument): boolean {
    const hero = content.hero as { floatingItems?: unknown; card?: unknown; floatingCards?: unknown; badgeText?: unknown };
    return (
      !hero.floatingCards ||
      !hero.badgeText ||
      !!hero.floatingItems ||
      !!hero.card ||
      !content.article1 ||
      !content.article2 ||
      !content.events ||
      content.publications?.cards?.some((card) => Boolean(card.kind) && !card.href?.trim()) ||
      content.publications?.cards?.some((card) => this.isPdfCard(card) && !card.kind) ||
      !content.admission?.campus?.authorityEmail ||
      !content.hallTicket ||
      typeof content.hallTicket?.showExamResultMenu !== 'boolean'
    );
  }

  private normalizePublicationCards(cards: HomeContentLinkCard[]): HomeContentLinkCard[] {
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

  private normalizePublicationHref(card: HomeContentLinkCard): string {
    const href = card.href?.trim() ?? '';
    if (href) {
      return href;
    }

    const kind = this.inferDocumentKind(card);
    if (!kind) {
      return '';
    }

    return (
      DEFAULT_PUBLICATION_CARDS.find((item) => item.kind === kind)?.href ??
      ''
    );
  }

  private normalizeEventCards(cards?: HomeContentEventCard[]): HomeContentEventCard[] {
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

  private normalizeEventPdfs(pdfs: HomeContentEventPdf[]): HomeContentEventPdf[] {
    return pdfs.map((pdf) => ({
      title: pdf.title ?? '',
      href: pdf.href ?? '',
      ctaLabel: pdf.ctaLabel ?? 'Preview PDF',
    }));
  }

  private inferDocumentKind(card: HomeContentLinkCard): HomeContentDocumentKind | undefined {
    if (card.kind) {
      return card.kind;
    }

    if (!this.isPdfCard(card)) {
      return undefined;
    }

    return /\/qn-bank\//i.test(card.href) ? 'question-bank' : 'other-docs';
  }

  private isPdfCard(card: HomeContentLinkCard): boolean {
    const href = card.href ?? '';
    const ctaLabel = card.ctaLabel ?? '';
    return /\.pdf($|\?)/i.test(href) || ctaLabel.toLowerCase().includes('pdf');
  }

  private slugifyFileName(fileName: string): string {
    const normalized = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return normalized.endsWith('.pdf') ? normalized : `${normalized}.pdf`;
  }

  private slugifyBaseName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9.-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private imageExtensionFromFile(file: UploadedAssetFile): string {
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

  private titleFromFileName(fileName: string): string {
    return fileName
      .replace(/\.pdf$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private stripUndefined(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.stripUndefined(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, entryValue]) => entryValue !== undefined)
          .map(([key, entryValue]) => [key, this.stripUndefined(entryValue)]),
      );
    }

    return value;
  }
}
