import { Routes } from '@angular/router';
import { AdmissionPageComponent } from './pages/admission-page.component';
import { AdmissionSubmittedPageComponent } from './pages/admission-submitted-page.component';
import { DocumentsPageComponent } from './pages/documents-page.component';
import { ExamResultPageComponent } from './pages/exam-result-page.component';
import { HallTicketPageComponent } from './pages/hall-ticket-page.component';
import { InstitutionsPageComponent } from './pages/institutions-page.component';
import { LandingPageComponent } from './pages/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'documents', component: DocumentsPageComponent },
  { path: 'institutions', component: InstitutionsPageComponent },
  { path: 'admission', component: AdmissionPageComponent },
  { path: 'admission/submitted', component: AdmissionSubmittedPageComponent },
  { path: 'hall-ticket', component: HallTicketPageComponent },
  { path: 'exam-result', component: ExamResultPageComponent },
  { path: '**', redirectTo: '' },
];
