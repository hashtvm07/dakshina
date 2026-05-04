import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { HomeContentAdminSnapshot, HomeContentDocument } from './home-content.types';

interface AdminApiConfig {
  baseUrl: string;
  endpoints: {
    login: string;
    currentAdmin: string;
    users: string;
    homeContentAdmin: string;
    admissionsAdmin: string;
  };
}

export type UserRole = 'mentor' | 'student' | 'admin';

export type ManagedAdmission = {
  applicationNo: string;
  hallTicketNo: string;
  createdAt: string;
  photoDataUrl: string;
  studentName: string;
  aadhaarNumber: string;
  studentDateOfBirth: string;
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  state: string;
  district: string;
  panchayath: string;
  area: string;
  mahalluName: string;
  identificationMark1: string;
  identificationMark2: string;
  examDate: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  homeAddress: string;
  residentialAddress: string;
  guardianName: string;
  guardianRelation: string;
  guardianAddress: string;
  religiousPanchayathMunicipality: string;
  schoolNameAndPlace: string;
  schoolClassCompleted: string;
  madrassaNameAndPlace: string;
  madrassaClassCompleted: string;
  admissionFor: string;
  examCenterVenue: string;
  guardianDeclarationAccepted: boolean;
  remarks?: string;
  resultSubject?: string;
  resultMark?: string;
  status: 'application' | 'admitted';
  admissionNumber?: string;
  admittedAt?: string;
  admittedClass?: string;
  college?: string;
};

export type ManagedUser = {
  username: string;
  role: UserRole;
  createdAt: string;
  createdBy: string;
};

type PdfUploadResponse = { message: string; content: HomeContentDocument; href: string };
type DirectUploadInitResponse = { uploadUrl: string; storagePath: string };

const DIRECT_PDF_UPLOAD_THRESHOLD_BYTES = 10 * 1024 * 1024;

@Injectable({ providedIn: 'root' })
export class HomeContentAdminService {
  private readonly http = inject(HttpClient);
  private configPromise: Promise<AdminApiConfig> | null = null;

  async getApiConfig() {
    this.configPromise ??= firstValueFrom(this.http.get<AdminApiConfig>('assets/api.json'));
    return this.configPromise;
  }

  async login(username: string, password: string) {
    const config = await this.getApiConfig();
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    return firstValueFrom(
      this.http.post<{ token: string; user: { username: string; role: string } }>(
        `${baseUrl}${config.endpoints.login}`,
        { username, password },
      ),
    );
  }

  async getCurrentAdmin() {
    const config = await this.getApiConfig();
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    return firstValueFrom(
      this.http.get<{ user: { username: string; role: string } }>(`${baseUrl}${config.endpoints.currentAdmin}`, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async getHomeContent(baseUrlOverride?: string) {
    return firstValueFrom(
      this.http.get<HomeContentAdminSnapshot>(await this.buildUrl(baseUrlOverride), {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async updateHomeContent(baseUrlOverride: string | undefined, payload: HomeContentDocument) {
    return firstValueFrom(
      this.http.put<{ message: string; content: HomeContentDocument }>(await this.buildUrl(baseUrlOverride), payload, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async deletePublicationCard(baseUrlOverride: string | undefined, index: number) {
    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument }>(
        `${await this.buildUrl(baseUrlOverride)}/publications/delete`,
        { index },
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async uploadPublicationPdf(
    baseUrlOverride: string | undefined,
    payload: { index: number; kind: 'question-bank' | 'other-docs'; file: File },
  ) {
    if (payload.file.size > DIRECT_PDF_UPLOAD_THRESHOLD_BYTES) {
      return this.uploadPublicationPdfDirect(baseUrlOverride, payload);
    }

    const formData = new FormData();
    formData.append('index', String(payload.index));
    formData.append('kind', payload.kind);
    formData.append('file', payload.file, payload.file.name);

    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument; href: string }>(
        `${await this.buildUrl(baseUrlOverride)}/publications/upload`,
        formData,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async uploadEventImage(
    baseUrlOverride: string | undefined,
    payload: { eventIndex: number; file: File },
  ) {
    const formData = new FormData();
    formData.append('eventIndex', String(payload.eventIndex));
    formData.append('file', payload.file, payload.file.name);

    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument; href: string }>(
        `${await this.buildUrl(baseUrlOverride)}/events/image/upload`,
        formData,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async uploadEventPdf(
    baseUrlOverride: string | undefined,
    payload: { eventIndex: number; pdfIndex: number; file: File },
  ) {
    if (payload.file.size > DIRECT_PDF_UPLOAD_THRESHOLD_BYTES) {
      return this.uploadEventPdfDirect(baseUrlOverride, payload);
    }

    const formData = new FormData();
    formData.append('eventIndex', String(payload.eventIndex));
    formData.append('pdfIndex', String(payload.pdfIndex));
    formData.append('file', payload.file, payload.file.name);

    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument; href: string }>(
        `${await this.buildUrl(baseUrlOverride)}/events/pdf/upload`,
        formData,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async deleteEventPdf(baseUrlOverride: string | undefined, eventIndex: number, pdfIndex: number) {
    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument }>(
        `${await this.buildUrl(baseUrlOverride)}/events/pdf/delete`,
        { eventIndex, pdfIndex },
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async deleteEventCard(baseUrlOverride: string | undefined, eventIndex: number) {
    return firstValueFrom(
      this.http.post<{ message: string; content: HomeContentDocument }>(
        `${await this.buildUrl(baseUrlOverride)}/events/delete`,
        { eventIndex },
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async getAdmissions(baseUrlOverride?: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    return firstValueFrom(
      this.http.get<{
        items: ManagedAdmission[];
        total: number;
        updatedAt: string;
      }>(`${baseUrl}${config.endpoints.admissionsAdmin}`, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async updateAdmission(baseUrlOverride: string | undefined, applicationNo: string, payload: ManagedAdmission) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    const encodedApplicationNo = encodeURIComponent(applicationNo);
    return firstValueFrom(
      this.http.put<{ message: string; item: ManagedAdmission }>(
        `${baseUrl}${config.endpoints.admissionsAdmin}/${encodedApplicationNo}`,
        payload,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async deleteAdmission(baseUrlOverride: string | undefined, applicationNo: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    const encodedApplicationNo = encodeURIComponent(applicationNo);
    return firstValueFrom(
      this.http.delete<{ message: string; applicationNo: string }>(
        `${baseUrl}${config.endpoints.admissionsAdmin}/${encodedApplicationNo}`,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );
  }

  async returnAdmissionToApplications(baseUrlOverride: string | undefined, applicationNo: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    const encodedApplicationNo = encodeURIComponent(applicationNo);
    const url = `${baseUrl}${config.endpoints.admissionsAdmin}/${encodedApplicationNo}/return-to-application`;

    try {
      return await firstValueFrom(
        this.http.post<{ message: string; item: ManagedAdmission }>(
          url,
          {},
          {
            headers: this.buildAuthHeaders(),
          },
        ),
      );
    } catch (error) {
      const status = this.getHttpStatus(error);

      if (![404, 405].includes(status)) {
        throw error;
      }

      const snapshot = await this.getAdmissions(baseUrl);
      const admission = snapshot.items.find((item) => item.applicationNo === applicationNo);

      if (!admission) {
        throw error;
      }

      const fallbackPayload: ManagedAdmission = {
        ...admission,
        status: 'application',
        admissionNumber: '',
        admittedAt: '',
        admittedClass: '',
        college: '',
      };
      const response = await this.updateAdmission(baseUrl, applicationNo, fallbackPayload);

      return {
        message: 'Admission moved back to applications.',
        item: response.item,
      };
    }
  }

  async getApplications(baseUrlOverride?: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    return firstValueFrom(
      this.http.get<{
        items: ManagedAdmission[];
        total: number;
        updatedAt: string;
      }>(`${baseUrl}${config.endpoints.admissionsAdmin}?status=application`, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async getAdmittedStudents(baseUrlOverride?: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    return firstValueFrom(
      this.http.get<{
        items: ManagedAdmission[];
        total: number;
        updatedAt: string;
      }>(`${baseUrl}${config.endpoints.admissionsAdmin}?status=admitted`, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async resetAdmissionNumbers(baseUrlOverride?: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    const url = `${baseUrl}${config.endpoints.admissionsAdmin}/reset-admission-numbers`;

    try {
      return await firstValueFrom(
        this.http.post<{
          message: string;
          items: Array<{ applicationNo: string; admissionNumber: string }>;
          total: number;
        }>(
          url,
          {},
          {
            headers: this.buildAuthHeaders(),
          },
        ),
      );
    } catch (error) {
      const status = this.getHttpStatus(error);

      if (![404, 405].includes(status)) {
        throw error;
      }

      return this.resetAdmissionNumbersWithUpdateFallback(baseUrl);
    }
  }

  async admitStudent(
    baseUrlOverride: string | undefined,
    application: ManagedAdmission,
    admissionDetails?: { admittedClass: string; college: string },
  ) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    return this.admitStudentWithUpdateFallback(baseUrl, config.endpoints.admissionsAdmin, application, admissionDetails);
  }

  private async admitStudentWithUpdateFallback(
    baseUrl: string,
    admissionsEndpoint: string,
    application: ManagedAdmission,
    admissionDetails?: { admittedClass: string; college: string },
  ) {
    const admittedSnapshot = await this.getAdmissions(baseUrl);
    const admittedItems = admittedSnapshot.items.filter(
      (item) => item.status === 'admitted' || Boolean(item.admissionNumber),
    );

    const admittedClass = admissionDetails?.admittedClass || application.admissionFor;
    const college = admissionDetails?.college || application.college || application.examCenterVenue;
    const admissionNumber = this.generateAdmissionNumber({ ...application, admissionFor: admittedClass }, admittedItems);
    const updatedAdmission: ManagedAdmission = {
      ...application,
      admissionFor: admittedClass,
      examCenterVenue: college,
      status: 'admitted',
      admissionNumber,
      admittedAt: new Date().toISOString(),
      admittedClass,
      college,
    };
    const encodedApplicationNo = encodeURIComponent(application.applicationNo);
    const updateUrl = `${baseUrl}${admissionsEndpoint}/${encodedApplicationNo}`;

    const response = await firstValueFrom(
      this.http.put<{ message: string; item: ManagedAdmission }>(
        updateUrl,
        updatedAdmission,
        {
          headers: this.buildAuthHeaders(),
        },
      ),
    );

    return {
      message: `Student admitted successfully. Admission No: ${response.item.admissionNumber || admissionNumber}`,
      item: response.item,
    };
  }

  private generateAdmissionNumber(application: ManagedAdmission, admittedItems: ManagedAdmission[]) {
    const courseCodeMap: Record<string, string> = {
      'Foundation course Class 4-7 (HIFZ)': '101',
      'Secondary (8-10)': '201',
      'Higher Secondary': '301',
    };
    const courseCode = courseCodeMap[application.admissionFor] || '201';
    const year = new Date().getFullYear();
    const institutionCode = '01';
    const prefix = `${courseCode}${year}${institutionCode}`;
    const latestSerial = admittedItems
      .map((item) => item.admissionNumber || '')
      .filter((admissionNumber) => admissionNumber.startsWith(prefix))
      .map((admissionNumber) => Number(admissionNumber.slice(-4)))
      .filter((serial) => Number.isFinite(serial))
      .reduce((highest, serial) => Math.max(highest, serial), 0);
    const serial = String(latestSerial + 1).padStart(4, '0');

    return `${prefix}${serial}`;
  }

  private async resetAdmissionNumbersWithUpdateFallback(baseUrl: string) {
    const snapshot = await this.getAdmissions(baseUrl);
    const admittedItems = snapshot.items
      .filter((item) => item.status === 'admitted' || Boolean(item.admissionNumber))
      .sort((a, b) => {
        const firstDate = new Date(a.admittedAt || a.createdAt).getTime();
        const secondDate = new Date(b.admittedAt || b.createdAt).getTime();
        return firstDate - secondDate || a.applicationNo.localeCompare(b.applicationNo);
      });
    const sequenceCounts: Record<string, number> = {};
    const updatedItems: Array<{ applicationNo: string; admissionNumber: string }> = [];
    const year = new Date().getFullYear();
    const institutionCode = '01';

    for (const item of admittedItems) {
      const courseCode = this.resolveAdmissionCourseCode(item.admittedClass || item.admissionFor);
      const sequenceKey = `${courseCode}/${year}`;
      const serialNumber = (sequenceCounts[sequenceKey] ?? 0) + 1;
      sequenceCounts[sequenceKey] = serialNumber;

      const admissionNumber = `${courseCode}${year}${institutionCode}${String(serialNumber).padStart(4, '0')}`;
      await this.updateAdmission(baseUrl, item.applicationNo, {
        ...item,
        status: 'admitted',
        admissionNumber,
      });
      updatedItems.push({
        applicationNo: item.applicationNo,
        admissionNumber,
      });
    }

    return {
      message: `Admission numbers reset from starting number for ${updatedItems.length} admitted student(s). Deploy the updated API so future admissions continue after the reset sequence.`,
      items: updatedItems,
      total: updatedItems.length,
    };
  }

  private resolveAdmissionCourseCode(admissionFor: string) {
    const courseCodeMap: Record<string, string> = {
      'Foundation course Class 4-7 (HIFZ)': '101',
      'Secondary (8-10)': '201',
      'Higher Secondary': '301',
    };

    return courseCodeMap[admissionFor] || '201';
  }

  private getHttpStatus(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      return error.status;
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = Number((error as { status?: unknown }).status);
      return Number.isFinite(status) ? status : 0;
    }

    return 0;
  }

  async listUsers() {
    const config = await this.getApiConfig();
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    return firstValueFrom(
      this.http.get<{ items: ManagedUser[]; updatedAt: string }>(`${baseUrl}${config.endpoints.users}`, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  async createUser(payload: { username: string; password: string; role: UserRole }) {
    const config = await this.getApiConfig();
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    return firstValueFrom(
      this.http.post<{ message: string; user: ManagedUser }>(`${baseUrl}${config.endpoints.users}`, payload, {
        headers: this.buildAuthHeaders(),
      }),
    );
  }

  private async buildUrl(baseUrlOverride?: string) {
    const config = await this.getApiConfig();
    const baseUrl = (baseUrlOverride || config.baseUrl).replace(/\/$/, '');
    return `${baseUrl}${config.endpoints.homeContentAdmin}`;
  }

  private async uploadPublicationPdfDirect(
    baseUrlOverride: string | undefined,
    payload: { index: number; kind: 'question-bank' | 'other-docs'; file: File },
  ): Promise<PdfUploadResponse> {
    const baseUrl = await this.buildUrl(baseUrlOverride);
    const init = await firstValueFrom(
      this.http.post<DirectUploadInitResponse>(
        `${baseUrl}/publications/upload-direct/init`,
        {
          index: payload.index,
          kind: payload.kind,
          fileName: payload.file.name,
        },
        { headers: this.buildAuthHeaders() },
      ),
    );

    await this.uploadFileToSignedUrl(init.uploadUrl, payload.file);

    return firstValueFrom(
      this.http.post<PdfUploadResponse>(
        `${baseUrl}/publications/upload-direct/finalize`,
        {
          index: payload.index,
          kind: payload.kind,
          storagePath: init.storagePath,
          fileName: payload.file.name,
        },
        { headers: this.buildAuthHeaders() },
      ),
    );
  }

  private async uploadEventPdfDirect(
    baseUrlOverride: string | undefined,
    payload: { eventIndex: number; pdfIndex: number; file: File },
  ): Promise<PdfUploadResponse> {
    const baseUrl = await this.buildUrl(baseUrlOverride);
    const init = await firstValueFrom(
      this.http.post<DirectUploadInitResponse>(
        `${baseUrl}/events/pdf/upload-direct/init`,
        {
          eventIndex: payload.eventIndex,
          pdfIndex: payload.pdfIndex,
          fileName: payload.file.name,
        },
        { headers: this.buildAuthHeaders() },
      ),
    );

    await this.uploadFileToSignedUrl(init.uploadUrl, payload.file);

    return firstValueFrom(
      this.http.post<PdfUploadResponse>(
        `${baseUrl}/events/pdf/upload-direct/finalize`,
        {
          eventIndex: payload.eventIndex,
          pdfIndex: payload.pdfIndex,
          storagePath: init.storagePath,
          fileName: payload.file.name,
        },
        { headers: this.buildAuthHeaders() },
      ),
    );
  }

  private async uploadFileToSignedUrl(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/pdf',
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Direct storage upload failed with status ${response.status}.`);
    }
  }

  private buildAuthHeaders() {
    const token = localStorage.getItem('mufied-admin-token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
