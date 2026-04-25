import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeContentAdminService, ManagedAdmission } from './home-content-admin.service';
import {
  HomeContentDocumentKind,
  HomeContentAdminSnapshot,
  HomeContentDocument,
  HomeContentEventCard,
  HomeContentEventPdf,
  HomeContentFooterCard,
  HomeContentLinkCard,
  HomeContentStat,
} from './home-content.types';

type EditorSection = {
  id: string;
  label: string;
  caption: string;
};

const SECTIONS: EditorSection[] = [
  { id: 'hero', label: 'Hero', caption: 'Top banner, actions, badge, and float cards' },
  { id: 'intro', label: 'Intro', caption: 'Image, article2 sections, and stat strip' },
  { id: 'programmes', label: 'Programmes', caption: 'Academic cards and CTA targets' },
  { id: 'events', label: 'Events', caption: 'Event cards with descriptions, image uploads, and PDFs' },
  { id: 'documents', label: 'Documents', caption: 'Question Bank PDFs and downloadable files' },
  { id: 'hall-ticket', label: 'Hall Ticket', caption: 'Titles and footer lines for ticket screen and PDF' },
  { id: 'admission', label: 'Admission', caption: 'Process steps and campus details' },
  { id: 'admissions-list', label: 'Admissions', caption: 'Submitted applications and contact details' },
  { id: 'results', label: 'Results', caption: 'Update subject and marks for each student' },
  { id: 'footer', label: 'Footer', caption: 'Brand, quick links, and support cards' },
];

const DOCUMENT_KIND_OPTIONS: Array<{ label: string; value: HomeContentDocumentKind }> = [
  { label: 'Question Bank', value: 'question-bank' },
  { label: 'Other Docs', value: 'other-docs' },
];

const MAX_PDF_UPLOAD_SIZE_BYTES = 150 * 1024 * 1024;
const ADMISSION_FOR_OPTIONS = [
  'Foundation course Class 4-7 (HIFZ)',
  'Secondary (8-10)',
  'Higher Secondary',
] as const;
const ADMISSIONS_EXPORT_COLUMNS: Array<{ label: string; value: (item: ManagedAdmission) => string }> = [
  { label: 'Application No', value: (item) => item.applicationNo },
  { label: 'Hall Ticket No', value: (item) => item.hallTicketNo },
  { label: 'Created At', value: (item) => item.createdAt },
  { label: 'Student Name', value: (item) => item.studentName },
  { label: 'Aadhaar Number', value: (item) => item.aadhaarNumber },
  { label: 'Date of Birth', value: (item) => item.studentDateOfBirth },
  { label: 'Father Name', value: (item) => item.fatherName },
  { label: 'Father Job', value: (item) => item.fatherJob },
  { label: 'Mother Name', value: (item) => item.motherName },
  { label: 'Mother Job', value: (item) => item.motherJob },
  { label: 'State', value: (item) => item.state },
  { label: 'District', value: (item) => item.district },
  { label: 'Panchayath', value: (item) => item.panchayath },
  { label: 'Area', value: (item) => item.area },
  { label: 'Mahallu Name', value: (item) => item.mahalluName },
  { label: 'Identification Mark 1', value: (item) => item.identificationMark1 },
  { label: 'Identification Mark 2', value: (item) => item.identificationMark2 },
  { label: 'Exam Date', value: (item) => item.examDate },
  { label: 'Mobile Number', value: (item) => item.mobileNumber },
  { label: 'WhatsApp Number', value: (item) => item.whatsappNumber },
  { label: 'Email', value: (item) => item.email },
  { label: 'Home Address', value: (item) => item.homeAddress },
  { label: 'Residential Address', value: (item) => item.residentialAddress },
  { label: 'Guardian Name', value: (item) => item.guardianName },
  { label: 'Guardian Relation', value: (item) => item.guardianRelation },
  { label: 'Guardian Address', value: (item) => item.guardianAddress },
  { label: 'Religious Panchayath/Municipality', value: (item) => item.religiousPanchayathMunicipality },
  { label: 'School Name and Place', value: (item) => item.schoolNameAndPlace },
  { label: 'School Class Completed', value: (item) => item.schoolClassCompleted },
  { label: 'Madrassa Name and Place', value: (item) => item.madrassaNameAndPlace },
  { label: 'Madrassa Class Completed', value: (item) => item.madrassaClassCompleted },
  { label: 'Admission For', value: (item) => item.admissionFor },
  { label: 'Exam Center Venue', value: (item) => item.examCenterVenue },
  { label: 'Guardian Declaration Accepted', value: (item) => (item.guardianDeclarationAccepted ? 'Yes' : 'No') },
  { label: 'Remarks', value: (item) => item.remarks ?? '' },
];

function createCollapsedSections() {
  return Object.fromEntries(SECTIONS.map((section) => [section.id, false])) as Record<string, boolean>;
}

@Component({
  selector: 'app-home-content-editor',
  imports: [FormsModule],
  templateUrl: './home-content-editor.component.html',
  styleUrl: './home-content-editor.component.css',
})
export class HomeContentEditorComponent {
  private readonly adminService = inject(HomeContentAdminService);

  protected readonly sections = SECTIONS;
  protected readonly apiBaseUrl = signal('');
  protected readonly content = signal<HomeContentDocument | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly deletingDocumentIndex = signal<number | null>(null);
  protected readonly deletingEventIndex = signal<number | null>(null);
  protected readonly uploadingDocumentIndex = signal<number | null>(null);
  protected readonly uploadingEventImageIndex = signal<number | null>(null);
  protected readonly uploadingEventPdfKey = signal<string | null>(null);
  protected readonly deletingEventPdfKey = signal<string | null>(null);
  protected readonly status = signal('Load the current home-page document, adjust sections, then publish.');
  protected readonly activeSection = signal('hero');
  protected readonly openSections = signal<Record<string, boolean>>(createCollapsedSections());
  protected readonly lastLoadedAt = signal<string | null>(null);
  protected readonly lastSavedAt = signal<string | null>(null);
  protected readonly serverSummary = signal<HomeContentAdminSnapshot['summary'] | null>(null);
  protected readonly admissions = signal<ManagedAdmission[]>([]);
  protected readonly admissionsUpdatedAt = signal<string | null>(null);
  protected readonly editingAdmission = signal<ManagedAdmission | null>(null);
  protected readonly resultsModalOpen = signal(false);
  protected readonly resultsSubject = signal('');
  protected readonly admissionSaving = signal(false);
  protected readonly updatingResultApplicationNo = signal<string | null>(null);
  protected readonly deletingAdmissionNo = signal<string | null>(null);
  protected readonly exportingAdmissions = signal(false);
  protected readonly downloadingResultsPdf = signal(false);
  protected readonly togglingResultMenuVisibility = signal(false);
  protected readonly contentJson = signal('');
  protected readonly selectedDocumentFiles = signal<Record<number, string>>({});
  protected readonly documentFileErrors = signal<Record<number, string>>({});
  protected readonly selectedEventImageFiles = signal<Record<number, string>>({});
  protected readonly selectedEventPdfFiles = signal<Record<string, string>>({});
  private readonly pendingDocumentFiles = new Map<number, File>();
  private readonly pendingEventImageFiles = new Map<number, File>();
  private readonly pendingEventPdfFiles = new Map<string, File>();
  private readonly savedContentJson = signal<string>('');
  private watermarkDataUrlPromise: Promise<string> | null = null;

  protected readonly hasContent = computed(() => this.content() !== null);
  protected readonly hasUnsavedChanges = computed(() => {
    const content = this.content();
    if (!content) {
      return false;
    }

    return JSON.stringify(content) !== this.savedContentJson();
  });
  protected readonly editorSummary = computed(() => {
    const content = this.content();
    if (!content) {
      return [];
    }

    const publicationCards = this.publicationDocumentCards(content);

    return [
      { label: 'Primary float items', value: content.hero.floatingCards.primary.items.length },
      { label: 'Secondary float items', value: content.hero.floatingCards.secondary.items.length },
      { label: 'Article sections', value: 4 },
      { label: 'Intro stats', value: content.intro.stats.length },
      { label: 'Programme cards', value: content.programmes.cards.length },
      { label: 'Event cards', value: content.events.cards.length },
      { label: 'Admission steps', value: content.admission.process.items.length },
      {
        label: 'Question Bank PDFs',
        value: publicationCards.filter((card) => this.isQuestionBankDocument(card)).length,
      },
      {
        label: 'Other Docs PDFs',
        value: publicationCards.filter((card) => this.isOtherDocument(card)).length,
      },
      { label: 'Footer cards', value: content.footer.cards.length },
    ];
  });
  protected readonly documentKindOptions = DOCUMENT_KIND_OPTIONS;
  protected readonly admissionForOptions = ADMISSION_FOR_OPTIONS;

  constructor() {
    void this.initialize();
  }

  private async initialize() {
    try {
      const config = await this.adminService.getApiConfig();
      this.apiBaseUrl.set(localStorage.getItem('mufied-admin-api-base-url') || config.baseUrl);
      await this.load();
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to load admin API configuration from assets/api.json.'));
    }
  }

  protected async load() {
    this.loading.set(true);
    this.status.set('Loading content from the admin API...');
    this.persistBaseUrl();

    try {
      const snapshot = await this.adminService.getHomeContent(this.apiBaseUrl());
      const admissionsSnapshot = await this.adminService.getAdmissions(this.apiBaseUrl());
      const cloned = this.clone(snapshot.content);

      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.serverSummary.set(snapshot.summary);
      this.admissions.set(admissionsSnapshot.items);
      this.resultsSubject.set(this.resolveResultsSubject(admissionsSnapshot.items));
      this.admissionsUpdatedAt.set(admissionsSnapshot.updatedAt);
      this.lastLoadedAt.set(snapshot.updatedAt);
      this.status.set('Content loaded. Changes stay local until you press save.');
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to load content from the admin API.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected async save() {
    const content = this.content();
    if (!content) {
      this.status.set('Load content before saving.');
      return;
    }

    this.saving.set(true);
    this.status.set('Saving the full home-page document to Firebase...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.updateHomeContent(this.apiBaseUrl(), content);
      const cloned = this.clone(response.content);

      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.serverSummary.set({
        heroFloatingItems: cloned.hero.floatingCards.primary.items.length,
        heroCardPoints: cloned.hero.floatingCards.secondary.items.length,
        introParagraphs: cloned.intro.paragraphs.length,
        introStats: cloned.intro.stats.length,
        programmeCards: cloned.programmes.cards.length,
        eventCards: cloned.events.cards.length,
        admissionSteps: cloned.admission.process.items.length,
        publicationCards: cloned.publications.cards.length,
        footerCards: cloned.footer.cards.length,
      });
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to save content to the admin API.'));
    } finally {
      this.saving.set(false);
    }
  }

  protected setActiveSection(sectionId: string) {
    this.activeSection.set(sectionId);
  }

  protected isSectionOpen(sectionId: string) {
    return Boolean(this.openSections()[sectionId]);
  }

  protected toggleSection(sectionId: string) {
    const nextOpenState = !this.isSectionOpen(sectionId);
    this.openSections.update((current) => ({
      ...current,
      [sectionId]: nextOpenState,
    }));
    this.setActiveSection(sectionId);
  }

  protected onSectionToggle(sectionId: string, event: Event) {
    const details = event.currentTarget as HTMLDetailsElement | null;
    const isOpen = Boolean(details?.open);
    this.openSections.update((current) => ({
      ...current,
      [sectionId]: isOpen,
    }));
    this.setActiveSection(sectionId);
  }

  protected expandSection(sectionId: string) {
    this.openSections.update((current) => ({
      ...current,
      [sectionId]: true,
    }));
    this.setActiveSection(sectionId);
  }

  protected updateContentJson(value: string) {
    this.contentJson.set(value);

    try {
      const parsed = JSON.parse(value) as HomeContentDocument;
      this.content.set(parsed);
      this.status.set('JSON updated locally. Press save to publish.');
    } catch {
      this.status.set('JSON is invalid. Fix the syntax before saving.');
    }
  }

  protected scrollToSection(sectionId: string) {
    if (sectionId === 'results') {
      this.openResultsModal();
      return;
    }
    this.expandSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected addStringItem(list: string[], placeholder = '') {
    list.push(placeholder);
  }

  protected removeStringItem(list: string[], index: number) {
    list.splice(index, 1);
  }

  protected addProgrammeCard() {
    this.content()?.programmes.cards.push(this.createProgrammeCard());
  }

  protected removeProgrammeCard(index: number) {
    this.content()?.programmes.cards.splice(index, 1);
  }

  protected addEventCard() {
    this.content()?.events.cards.push(this.createEventCard());
  }

  protected async removeEventCard(index: number) {
    const event = this.content()?.events.cards[index];
    if (!event) {
      return;
    }

    const confirmed = window.confirm(
      `Delete event "${event.title || `Event ${index + 1}`}"? This will remove it from the public UI.`,
    );
    if (!confirmed) {
      return;
    }

    const savedEvent = this.savedEventAtIndex(index);
    if (!savedEvent) {
      this.content()?.events.cards.splice(index, 1);
      this.resetPendingEventUploads();
      this.contentJson.set(JSON.stringify(this.content(), null, 2));
      this.status.set('Event removed locally.');
      return;
    }

    this.deletingEventIndex.set(index);
    this.status.set('Deleting event from the home page...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.deleteEventCard(this.apiBaseUrl(), index);
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.resetPendingEventUploads();
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to delete the selected event.'));
    } finally {
      this.deletingEventIndex.set(null);
    }
  }

  protected addEventDescription(event: HomeContentEventCard) {
    event.descriptions.push('');
  }

  protected removeEventDescription(event: HomeContentEventCard, index: number) {
    event.descriptions.splice(index, 1);
  }

  protected addEventPdf(event: HomeContentEventCard) {
    event.pdfs.push(this.createEventPdf());
  }

  protected async removeEventPdf(eventIndex: number, pdfIndex: number) {
    const content = this.content();
    const event = content?.events.cards[eventIndex];
    if (!event) {
      return;
    }

    const key = this.eventPdfKey(eventIndex, pdfIndex);
    this.clearPendingEventPdf(eventIndex, pdfIndex);

    if (!event.pdfs[pdfIndex]?.href) {
      event.pdfs.splice(pdfIndex, 1);
      this.status.set('Event PDF removed locally. Press save to publish.');
      return;
    }

    this.deletingEventPdfKey.set(key);
    this.status.set('Deleting event PDF from the server...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.deleteEventPdf(this.apiBaseUrl(), eventIndex, pdfIndex);
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.resetPendingEventUploads();
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to delete the selected event PDF.'));
    } finally {
      this.deletingEventPdfKey.set(null);
    }
  }

  protected addDocumentCard() {
    this.addDocumentCardOfType('question-bank');
  }

  protected addDocumentCardOfType(kind: HomeContentDocumentKind) {
    this.content()?.publications.cards.push(this.createLinkCard(kind));
  }

  protected questionBankDocuments(content: HomeContentDocument) {
    return content.publications.cards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => this.isVisibleDocumentCard(card) && this.isQuestionBankDocument(card));
  }

  protected otherDocuments(content: HomeContentDocument) {
    return content.publications.cards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => this.isVisibleDocumentCard(card) && this.isOtherDocument(card));
  }

  protected async removeDocumentCard(index: number) {
    this.deletingDocumentIndex.set(index);
    this.status.set('Deleting PDF from the home-content document...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.deletePublicationCard(this.apiBaseUrl(), index);
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to delete the selected PDF.'));
    } finally {
      this.deletingDocumentIndex.set(null);
    }
  }

  protected onDocumentFileSelected(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.pendingDocumentFiles.delete(index);
      this.selectedDocumentFiles.update((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      this.documentFileErrors.update((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      return;
    }

    this.selectedDocumentFiles.update((current) => ({
      ...current,
      [index]: file.name,
    }));

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.pendingDocumentFiles.delete(index);
      this.documentFileErrors.update((current) => ({
        ...current,
        [index]: 'Only PDF files can be uploaded.',
      }));
      this.status.set('Only PDF files can be uploaded.');
      return;
    }

    if (file.size > MAX_PDF_UPLOAD_SIZE_BYTES) {
      this.pendingDocumentFiles.delete(index);
      this.documentFileErrors.update((current) => ({
        ...current,
        [index]: 'PDF size must be 150 MB or smaller.',
      }));
      this.status.set('PDF size must be 150 MB or smaller.');
      return;
    }

    this.pendingDocumentFiles.set(index, file);
    this.documentFileErrors.update((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });
    this.status.set('PDF selected. Press Upload PDF to send it to the server.');
  }

  protected async uploadDocumentFile(index: number, kind: HomeContentDocumentKind) {
    const file = this.pendingDocumentFiles.get(index);
    if (!file) {
      this.status.set('Choose a PDF file before uploading.');
      return;
    }

    this.uploadingDocumentIndex.set(index);
    this.status.set('Uploading PDF to the server...');
    this.persistBaseUrl();

    try {
      await this.ensurePublicationSlotExists(index);

      const response = await this.adminService.uploadPublicationPdf(this.apiBaseUrl(), {
        index,
        kind,
        file,
      });
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.pendingDocumentFiles.delete(index);
      this.selectedDocumentFiles.update((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      this.documentFileErrors.update((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to upload the selected PDF.'));
    } finally {
      this.uploadingDocumentIndex.set(null);
    }
  }

  protected onEventImageSelected(eventIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.clearPendingEventImage(eventIndex);
      return;
    }

    if (!/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.type)) {
      this.status.set('Only JPG, PNG, WEBP, or GIF images are allowed.');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.status.set('Image size must be 2 MB or smaller.');
      input.value = '';
      return;
    }

    this.pendingEventImageFiles.set(eventIndex, file);
    this.selectedEventImageFiles.update((current) => ({
      ...current,
      [eventIndex]: file.name,
    }));
    this.status.set('Image selected. Press Upload Image to send it to the server.');
  }

  protected async uploadEventImage(eventIndex: number) {
    const file = this.pendingEventImageFiles.get(eventIndex);
    if (!file) {
      this.status.set('Choose an image file before uploading.');
      return;
    }

    this.uploadingEventImageIndex.set(eventIndex);
    this.status.set('Uploading event image to the server...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.uploadEventImage(this.apiBaseUrl(), { eventIndex, file });
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.clearPendingEventImage(eventIndex);
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to upload the selected event image.'));
    } finally {
      this.uploadingEventImageIndex.set(null);
    }
  }

  protected removeEventImage(eventIndex: number) {
    const event = this.content()?.events.cards[eventIndex];
    if (!event) {
      return;
    }

    event.image = '';
    this.clearPendingEventImage(eventIndex);
    this.status.set('Event image cleared locally. Press Publish Home Content to save.');
  }

  protected onEventPdfSelected(eventIndex: number, pdfIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const key = this.eventPdfKey(eventIndex, pdfIndex);

    if (!file) {
      this.clearPendingEventPdf(eventIndex, pdfIndex);
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.status.set('Only PDF files can be uploaded.');
      input.value = '';
      return;
    }

    if (file.size > MAX_PDF_UPLOAD_SIZE_BYTES) {
      this.status.set('PDF size must be 150 MB or smaller.');
      input.value = '';
      return;
    }

    this.pendingEventPdfFiles.set(key, file);
    this.selectedEventPdfFiles.update((current) => ({
      ...current,
      [key]: file.name,
    }));
    this.status.set('Event PDF selected. Press Upload PDF to send it to the server.');
  }

  protected async uploadEventPdf(eventIndex: number, pdfIndex: number) {
    const key = this.eventPdfKey(eventIndex, pdfIndex);
    const file = this.pendingEventPdfFiles.get(key);
    if (!file) {
      this.status.set('Choose a PDF file before uploading.');
      return;
    }

    this.uploadingEventPdfKey.set(key);
    this.status.set('Uploading event PDF to the server...');
    this.persistBaseUrl();

    try {
      const response = await this.adminService.uploadEventPdf(this.apiBaseUrl(), {
        eventIndex,
        pdfIndex,
        file,
      });
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.clearPendingEventPdf(eventIndex, pdfIndex);
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to upload the selected event PDF.'));
    } finally {
      this.uploadingEventPdfKey.set(null);
    }
  }

  protected addStat() {
    this.content()?.intro.stats.push(this.createStat());
  }

  protected removeStat(index: number) {
    this.content()?.intro.stats.splice(index, 1);
  }

  protected addFooterCard() {
    this.content()?.footer.cards.push(this.createFooterCard());
  }

  protected removeFooterCard(index: number) {
    this.content()?.footer.cards.splice(index, 1);
  }

  protected addFooterLink(card: HomeContentFooterCard) {
    card.links ??= [];
    card.links.push({ label: '', href: '' });
  }

  protected removeFooterLink(card: HomeContentFooterCard, index: number) {
    card.links?.splice(index, 1);
  }

  protected openAdmissionEditor(item: ManagedAdmission) {
    this.editingAdmission.set(structuredClone(item));
  }

  protected openResultsModal() {
    this.resultsSubject.set(this.resolveResultsSubject(this.admissions()));
    this.resultsModalOpen.set(true);
    this.activeSection.set('results');
  }

  protected closeResultsModal() {
    this.resultsModalOpen.set(false);
    if (this.activeSection() === 'results') {
      this.activeSection.set('admissions-list');
    }
  }

  protected isExamResultMenuVisible() {
    return this.content()?.hallTicket.showExamResultMenu !== false;
  }

  protected async toggleExamResultMenuVisibility() {
    const content = this.content();
    if (!content || this.togglingResultMenuVisibility()) {
      return;
    }

    const previousContent = this.clone(content);
    const nextContent = this.clone(content);
    nextContent.hallTicket.showExamResultMenu = !this.isExamResultMenuVisible();

    this.content.set(nextContent);
    this.contentJson.set(JSON.stringify(nextContent, null, 2));
    this.togglingResultMenuVisibility.set(true);
    this.status.set(`${nextContent.hallTicket.showExamResultMenu ? 'Showing' : 'Hiding'} Exam Result menu...`);

    try {
      const response = await this.adminService.updateHomeContent(this.apiBaseUrl(), nextContent);
      const cloned = this.clone(response.content);
      this.content.set(cloned);
      this.contentJson.set(JSON.stringify(cloned, null, 2));
      this.savedContentJson.set(JSON.stringify(cloned));
      this.lastSavedAt.set(new Date().toISOString());
      this.status.set(`Exam Result menu ${cloned.hallTicket.showExamResultMenu ? 'shown' : 'hidden'} successfully.`);
    } catch (error) {
      this.content.set(previousContent);
      this.contentJson.set(JSON.stringify(previousContent, null, 2));
      this.status.set(this.formatError(error, 'Unable to update Exam Result menu visibility.'));
    } finally {
      this.togglingResultMenuVisibility.set(false);
    }
  }

  protected examCenterVenueOptions(currentValue = '') {
    return this.buildAdmissionOptionList(
      this.admissions().map((item) => item.examCenterVenue),
      currentValue,
    );
  }

  protected stateOptions(currentValue = '') {
    return this.buildAdmissionOptionList(
      this.admissions().map((item) => item.state),
      currentValue,
    );
  }

  protected districtOptions(state: string, currentValue = '') {
    return this.buildAdmissionOptionList(
      this.admissions()
        .filter((item) => item.state.trim().toLowerCase() === state.trim().toLowerCase())
        .map((item) => item.district),
      currentValue,
    );
  }

  protected onAdmissionStateChange(draft: ManagedAdmission, nextState: string) {
    draft.state = nextState;
    const validDistricts = this.districtOptions(nextState, draft.district);
    if (draft.district && !validDistricts.includes(draft.district)) {
      draft.district = '';
    }
  }

  protected hasCanonicalAdmissionForOption(value: string) {
    return this.admissionForOptions.some((option) => option === value);
  }

  protected closeAdmissionEditor() {
    this.editingAdmission.set(null);
  }

  protected canSaveResult(item: ManagedAdmission) {
    return Boolean(this.resultsSubject().trim() && (item.resultMark ?? '').trim());
  }

  protected async updateResult(item: ManagedAdmission) {
    const subject = this.resultsSubject().trim();
    const mark = (item.resultMark ?? '').trim();

    if (!subject) {
      this.status.set('Enter the subject before updating a mark.');
      return;
    }

    if (!mark) {
      this.status.set(`Enter a mark for ${item.studentName} before saving.`);
      return;
    }

    this.updatingResultApplicationNo.set(item.applicationNo);
    try {
      const response = await this.adminService.updateAdmission(this.apiBaseUrl(), item.applicationNo, {
        ...item,
        admissionFor: item.admissionFor.trim(),
        resultSubject: subject,
        resultMark: mark,
      });
      this.admissions.update((items) =>
        items.map((entry) =>
          entry.applicationNo === response.item.applicationNo ? response.item : entry,
        ),
      );
      this.resultsSubject.set(response.item.resultSubject ?? subject);
      this.status.set(`Result updated for ${response.item.studentName}.`);
    } catch (error) {
      this.status.set(this.formatError(error, `Unable to update result for ${item.studentName}.`));
    } finally {
      this.updatingResultApplicationNo.set(null);
    }
  }

  protected async downloadResultsPdf() {
    const items = this.admissions();
    if (!items.length || this.downloadingResultsPdf()) {
      return;
    }

    this.downloadingResultsPdf.set(true);
    try {
      const subject = this.resultsSubject().trim();
      const { default: jsPDF } = await import('jspdf');
      const watermarkDataUrl = await this.loadResultWatermarkDataUrl().catch(() => '');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 12;
      const startY = 18;
      const rowHeight = 8;
      const colNo = 18;
      const colName = 150;
      const colHall = 55;
      const colMark = 32;
      const usableHeight = pageHeight - startY - 14;
      const rowsPerPage = Math.max(1, Math.floor((usableHeight - 16) / rowHeight));

      const sortedItems = [...items].sort((a, b) => a.hallTicketNo.localeCompare(b.hallTicketNo));

      const drawPage = (pageItems: ManagedAdmission[], offset: number) => {
        if (watermarkDataUrl) {
          try {
            const watermarkWidth = 96;
            const watermarkHeight = 96;
            const watermarkX = (pageWidth - watermarkWidth) / 2;
            const watermarkY = (pageHeight - watermarkHeight) / 2;
            pdf.addImage(watermarkDataUrl, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, undefined, 'FAST', 0);
          } catch {
            // Watermark should never block the result export.
          }
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('RESULT MARKLIST', pageWidth / 2, startY, { align: 'center' });

        pdf.setFontSize(10);
        if (subject) {
          pdf.text(`Subject: ${subject}`, marginX, startY + 7);
        }

        const tableTop = startY + 12;
        const tableBottom = tableTop + rowHeight * (pageItems.length + 1);
        const x0 = marginX;
        const x1 = x0 + colNo;
        const x2 = x1 + colName;
        const x3 = x2 + colHall;
        const x4 = x3 + colMark;

        pdf.setDrawColor(60, 60, 60);
        pdf.setLineWidth(0.25);

        for (let row = 0; row <= pageItems.length + 1; row += 1) {
          const y = tableTop + row * rowHeight;
          pdf.line(x0, y, x4, y);
        }

        [x0, x1, x2, x3, x4].forEach((x) => pdf.line(x, tableTop, x, tableBottom));

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text('SI NO.', x0 + colNo / 2, tableTop + 5.2, { align: 'center' });
        pdf.text('NAME & PLACE', x1 + colName / 2, tableTop + 5.2, { align: 'center' });
        pdf.text('HALL TICKET NO', x2 + colHall / 2, tableTop + 5.2, { align: 'center' });
        pdf.text('MARK', x3 + colMark / 2, tableTop + 5.2, { align: 'center' });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);

        pageItems.forEach((item, index) => {
          const y = tableTop + rowHeight * (index + 1) + 5.2;
          const place = [item.area, item.district, item.state].map((value) => value?.trim()).find(Boolean) || '';
          const nameAndPlace = place ? `${item.studentName} - ${place}` : item.studentName;
          const serialNo = `${offset + index + 1}.`;
          const mark = (item.resultMark ?? '').trim() || '-';

          pdf.text(serialNo, x0 + colNo / 2, y, { align: 'center' });
          pdf.text(nameAndPlace, x1 + 2, y, { maxWidth: colName - 4 });
          pdf.text(item.hallTicketNo || item.applicationNo, x2 + colHall / 2, y, { align: 'center' });
          pdf.text(mark, x3 + colMark / 2, y, { align: 'center' });
        });
      };

      for (let pageIndex = 0; pageIndex * rowsPerPage < sortedItems.length; pageIndex += 1) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const start = pageIndex * rowsPerPage;
        const end = start + rowsPerPage;
        drawPage(sortedItems.slice(start, end), start);
      }

      const safeSubject = subject
        ? subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : 'all-subjects';
      pdf.save(`result-marklist-${safeSubject}.pdf`);
      this.status.set('Result PDF generated.');
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to generate the result PDF.'));
    } finally {
      this.downloadingResultsPdf.set(false);
    }
  }

  protected async saveAdmissionEdits() {
    const current = this.editingAdmission();
    if (!current) {
      return;
    }

    const payload: ManagedAdmission = {
      ...current,
      admissionFor: current.admissionFor.trim(),
      remarks: current.remarks?.trim() || undefined,
      resultSubject: current.resultSubject?.trim() || undefined,
      resultMark: current.resultMark?.trim() || undefined,
    };

    this.admissionSaving.set(true);
    try {
      const response = await this.adminService.updateAdmission(
        this.apiBaseUrl(),
        current.applicationNo,
        payload,
      );
      this.admissions.update((items) =>
        items.map((item) =>
          item.applicationNo === response.item.applicationNo ? response.item : item,
        ),
      );
      this.status.set(response.message);
      this.editingAdmission.set(null);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to update admission.'));
    } finally {
      this.admissionSaving.set(false);
    }
  }

  protected async deleteAdmission(item: ManagedAdmission) {
    if (this.deletingAdmissionNo() || this.admissionSaving()) {
      return;
    }

    const confirmed = window.confirm(
      `Delete admission ${item.applicationNo} for ${item.studentName}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    this.deletingAdmissionNo.set(item.applicationNo);
    try {
      const response = await this.adminService.deleteAdmission(
        this.apiBaseUrl(),
        item.applicationNo,
      );
      this.admissions.update((items) =>
        items.filter((entry) => entry.applicationNo !== response.applicationNo),
      );
      if (this.editingAdmission()?.applicationNo === item.applicationNo) {
        this.editingAdmission.set(null);
      }
      this.admissionsUpdatedAt.set(new Date().toISOString());
      this.status.set(response.message);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to delete admission.'));
    } finally {
      this.deletingAdmissionNo.set(null);
    }
  }

  protected exportAdmissions() {
    const items = this.admissions();
    if (!items.length || this.exportingAdmissions()) {
      return;
    }

    this.exportingAdmissions.set(true);
    try {
      const workbook = this.buildAdmissionsWorkbook(items);
      const blob = new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `mufied-admissions-${timestamp}.xls`;

      this.downloadBlob(blob, fileName);
      this.status.set(`Admissions export downloaded (${items.length} records).`);
    } catch (error) {
      this.status.set(this.formatError(error, 'Unable to export admissions.'));
    } finally {
      this.exportingAdmissions.set(false);
    }
  }

  protected formatTimestamp(value: string | null) {
    if (!value) {
      return 'Not available yet';
    }

    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  protected trackByIndex(index: number) {
    return index;
  }

  protected selectedDocumentFileName(index: number) {
    return this.selectedDocumentFiles()[index] || '';
  }

  protected documentFileError(index: number) {
    return this.documentFileErrors()[index] || '';
  }

  protected hasPendingDocumentFile(index: number) {
    return this.pendingDocumentFiles.has(index);
  }

  protected selectedEventImageFileName(index: number) {
    return this.selectedEventImageFiles()[index] || '';
  }

  protected selectedEventPdfFileName(eventIndex: number, pdfIndex: number) {
    return this.selectedEventPdfFiles()[this.eventPdfKey(eventIndex, pdfIndex)] || '';
  }

  protected isUploadingEventPdf(eventIndex: number, pdfIndex: number) {
    return this.uploadingEventPdfKey() === this.eventPdfKey(eventIndex, pdfIndex);
  }

  protected isDeletingEventPdf(eventIndex: number, pdfIndex: number) {
    return this.deletingEventPdfKey() === this.eventPdfKey(eventIndex, pdfIndex);
  }

  private buildAdmissionOptionList(values: readonly string[], currentValue = '') {
    const seen = new Set<string>();
    const options: string[] = [];

    for (const rawValue of [...values, currentValue]) {
      const value = rawValue.trim();
      if (!value) {
        continue;
      }
      const key = value.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      options.push(value);
    }

    return options.sort((left, right) => left.localeCompare(right));
  }

  private resolveResultsSubject(items: readonly ManagedAdmission[]) {
    return items.find((item) => item.resultSubject?.trim())?.resultSubject?.trim() ?? '';
  }

  private loadResultWatermarkDataUrl() {
    this.watermarkDataUrlPromise ??= this.createFadedAssetDataUrl('assets/images/result-watermark.jpeg', 0.07);

    return this.watermarkDataUrlPromise;
  }

  private async createFadedAssetDataUrl(path: string, opacity: number) {
    const source = await fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load result watermark image.');
        }
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Unable to read result watermark image.'));
            reader.readAsDataURL(blob);
          }),
      );

    return new Promise<string>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(source);
          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = opacity;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => resolve(source);
      image.src = source;
    });
  }

  protected canDeleteEventPdf(eventIndex: number, pdfIndex: number) {
    const pdf = this.content()?.events.cards[eventIndex]?.pdfs[pdfIndex];
    if (!pdf) {
      return false;
    }

    return Boolean(
      pdf.href?.trim() ||
        pdf.title?.trim() ||
        (pdf.ctaLabel?.trim() && pdf.ctaLabel.trim() !== 'Preview PDF') ||
        this.selectedEventPdfFileName(eventIndex, pdfIndex),
    );
  }

  protected canDeleteDocumentCard(index: number) {
    const card = this.content()?.publications.cards[index];
    if (!card) {
      return false;
    }

    return Boolean(
      card.href?.trim() ||
        card.title?.trim() ||
        card.description?.trim() ||
        card.ctaLabel?.trim() ||
        this.selectedDocumentFileName(index),
    );
  }

  private buildAdmissionsWorkbook(items: ManagedAdmission[]) {
    const rows = [
      ADMISSIONS_EXPORT_COLUMNS.map((column) => `<Cell ss:StyleID="header"><Data ss:Type="String">${this.escapeSpreadsheetValue(column.label)}</Data></Cell>`).join(''),
      ...items.map((item) =>
        ADMISSIONS_EXPORT_COLUMNS.map(
          (column) =>
            `<Cell><Data ss:Type="String">${this.escapeSpreadsheetValue(column.value(item))}</Data></Cell>`,
        ).join(''),
      ),
    ];

    return [
      '<?xml version="1.0"?>',
      '<?mso-application progid="Excel.Sheet"?>',
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
      ' xmlns:o="urn:schemas-microsoft-com:office:office"',
      ' xmlns:x="urn:schemas-microsoft-com:office:excel"',
      ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',
      ' xmlns:html="http://www.w3.org/TR/REC-html40">',
      ' <Styles>',
      '  <Style ss:ID="header">',
      '   <Font ss:Bold="1"/>',
      '  </Style>',
      ' </Styles>',
      ' <Worksheet ss:Name="Admissions">',
      `  <Table ss:ExpandedColumnCount="${ADMISSIONS_EXPORT_COLUMNS.length}" ss:ExpandedRowCount="${items.length + 1}" x:FullColumns="1" x:FullRows="1">`,
      ...rows.map((row) => `   <Row>${row}</Row>`),
      '  </Table>',
      ' </Worksheet>',
      '</Workbook>',
    ].join('\n');
  }

  private downloadBlob(blob: Blob, fileName: string) {
    const nav = globalThis.navigator as Navigator & {
      msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
      msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
    };
    if (typeof nav.msSaveOrOpenBlob === 'function') {
      nav.msSaveOrOpenBlob(blob, fileName);
      return;
    }
    if (typeof nav.msSaveBlob === 'function') {
      nav.msSaveBlob(blob, fileName);
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private escapeSpreadsheetValue(value: string) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  protected hasBrokenDocumentLink(index: number) {
    const card = this.content()?.publications.cards[index];
    if (!card) {
      return false;
    }

    return Boolean(
      card.kind &&
        !card.href?.trim() &&
        !this.hasPendingDocumentFile(index) &&
        !this.selectedDocumentFileName(index),
    );
  }

  protected trackSection(_: number, section: EditorSection) {
    return section.id;
  }

  private createStat(): HomeContentStat {
    return { value: '', label: '' };
  }

  private createProgrammeCard(): HomeContentLinkCard {
    return {
      title: '',
      description: '',
      href: '',
      ctaLabel: '',
      featured: false,
    };
  }

  private createEventCard(): HomeContentEventCard {
    return {
      title: '',
      descriptions: [''],
      image: '',
      pdfs: [],
    };
  }

  private createEventPdf(): HomeContentEventPdf {
    return {
      title: '',
      href: '',
      ctaLabel: 'Preview PDF',
    };
  }

  private createLinkCard(kind: HomeContentDocumentKind): HomeContentLinkCard {
    return {
      title: '',
      description: '',
      href: '',
      ctaLabel: '',
      kind,
      featured: false,
    };
  }

  private createFooterCard(): HomeContentFooterCard {
    return {
      title: '',
      description: '',
      links: [],
    };
  }

  private publicationDocumentCards(content: HomeContentDocument) {
    return content.publications.cards.filter((card) => this.isVisibleDocumentCard(card));
  }

  private persistBaseUrl() {
    localStorage.setItem('mufied-admin-api-base-url', this.apiBaseUrl());
  }

  private clone(content: HomeContentDocument): HomeContentDocument {
    return structuredClone(content);
  }

  private eventPdfKey(eventIndex: number, pdfIndex: number) {
    return `${eventIndex}:${pdfIndex}`;
  }

  private clearPendingEventImage(eventIndex: number) {
    this.pendingEventImageFiles.delete(eventIndex);
    this.selectedEventImageFiles.update((current) => {
      const next = { ...current };
      delete next[eventIndex];
      return next;
    });
  }

  private clearPendingEventPdf(eventIndex: number, pdfIndex: number) {
    const key = this.eventPdfKey(eventIndex, pdfIndex);
    this.pendingEventPdfFiles.delete(key);
    this.selectedEventPdfFiles.update((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  private resetPendingEventUploads() {
    this.pendingEventImageFiles.clear();
    this.pendingEventPdfFiles.clear();
    this.selectedEventImageFiles.set({});
    this.selectedEventPdfFiles.set({});
  }

  private savedEventAtIndex(index: number): HomeContentEventCard | null {
    try {
      const savedContent = JSON.parse(this.savedContentJson()) as HomeContentDocument;
      return savedContent.events?.cards?.[index] ?? null;
    } catch {
      return null;
    }
  }

  private savedPublicationAtIndex(index: number): HomeContentLinkCard | null {
    try {
      const savedContent = JSON.parse(this.savedContentJson()) as HomeContentDocument;
      return savedContent.publications?.cards?.[index] ?? null;
    } catch {
      return null;
    }
  }

  private async ensurePublicationSlotExists(index: number) {
    if (this.savedPublicationAtIndex(index)) {
      return;
    }

    const content = this.content();
    if (!content) {
      throw new Error('Load content before uploading.');
    }

    const response = await this.adminService.updateHomeContent(this.apiBaseUrl(), content);
    const cloned = this.clone(response.content);
    this.content.set(cloned);
    this.contentJson.set(JSON.stringify(cloned, null, 2));
    this.savedContentJson.set(JSON.stringify(cloned));
    this.lastSavedAt.set(new Date().toISOString());
  }

  private isPdfPublicationCard(card: HomeContentLinkCard) {
    const href = card.href ?? '';
    const ctaLabel = card.ctaLabel ?? '';
    return /\.pdf($|\?)/i.test(href) || ctaLabel.toLowerCase().includes('pdf');
  }

  private isVisibleDocumentCard(card: HomeContentLinkCard) {
    return Boolean(card.kind) || this.isPdfPublicationCard(card) || !card.href.trim();
  }

  private isQuestionBankDocument(card: HomeContentLinkCard) {
    return (card.kind ?? 'question-bank') === 'question-bank';
  }

  private isOtherDocument(card: HomeContentLinkCard) {
    return (card.kind ?? 'other-docs') === 'other-docs';
  }

  private formatError(error: unknown, fallback: string) {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const errorPayload = (error as { error?: { message?: string | string[] } }).error;
      if (Array.isArray(errorPayload?.message)) {
        return errorPayload.message.join(' | ');
      }
      if (typeof errorPayload?.message === 'string') {
        return errorPayload.message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }
}
