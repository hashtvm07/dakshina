import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface AdmissionPayload {
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
}

export interface AdmissionSubmissionResult {
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
}

export interface AdmissionLookupResult {
  found: boolean;
  admission: (AdmissionPayload & {
    applicationNo: string;
    hallTicketNo: string;
    createdAt: string;
  }) | null;
}

export interface AdmissionsListResult {
  items: Array<{
    applicationNo: string;
    studentName: string;
    studentDateOfBirth: string;
    admissionFor: string;
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    examDate: string;
    examCenterVenue: string;
    createdAt: string;
  }>;
  total: number;
  updatedAt: string;
}

export interface ExamResultLookup {
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
}

@Injectable({ providedIn: 'root' })
export class AdmissionApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  createAdmission(payload: AdmissionPayload) {
    return firstValueFrom(this.http.post<AdmissionSubmissionResult>(this.apiConfig.url('createAdmission'), payload));
  }

  listAdmissions() {
    return firstValueFrom(this.http.get<AdmissionsListResult>(this.apiConfig.url('createAdmission')));
  }

  lookupAdmission(email: string, studentDateOfBirth: string) {
    const params = new HttpParams().set('email', email).set('studentDateOfBirth', studentDateOfBirth);

    return firstValueFrom(
      this.http.get<AdmissionLookupResult>(`${this.apiConfig.url('createAdmission')}/lookup`, {
        params,
      }),
    );
  }

  getHallTicket(applicationNo: string, studentDateOfBirth: string) {
    const params = new HttpParams()
      .set('applicationNo', applicationNo)
      .set('studentDateOfBirth', studentDateOfBirth);

    return firstValueFrom(
      this.http.get(this.apiConfig.url('hallTicket'), {
        params,
      }),
    );
  }

  getExamResult(applicationNo: string, studentDateOfBirth: string) {
    const params = new HttpParams()
      .set('applicationNo', applicationNo)
      .set('studentDateOfBirth', studentDateOfBirth);

    return firstValueFrom(
      this.http.get<ExamResultLookup>(`${this.apiConfig.url('createAdmission')}/exam-result`, {
        params,
      }),
    );
  }
}
