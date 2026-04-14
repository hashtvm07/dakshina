import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdmissionSubmissionResult } from '../services/admission-api.service';

@Component({
  selector: 'app-admission-submitted-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <section class="panel submitted-shell">
        @if (result(); as submission) {
          <div class="section-head">
            <h1>Application Submitted</h1>
            <p>{{ submission.message }}</p>
          </div>

          <div class="result-grid">
            <div><span>Application No</span><strong>{{ submission.applicationNo }}</strong></div>
            <div><span>Hall Ticket No</span><strong>{{ submission.hallTicketNo }}</strong></div>
            <div><span>Student</span><strong>{{ submission.candidate.studentName }}</strong></div>
            <div><span>Guardian</span><strong>{{ submission.candidate.guardianName }}</strong></div>
            <div><span>Programme</span><strong>{{ submission.candidate.admissionFor }}</strong></div>
            <div><span>Exam Date</span><strong>{{ submission.candidate.examDate }}</strong></div>
            <div><span>Exam Venue</span><strong>{{ submission.candidate.examCenterVenue }}</strong></div>
            <div><span>WhatsApp</span><strong>{{ submission.delivery.whatsappNumber }}</strong></div>
            <div><span>Email</span><strong>{{ submission.delivery.email }}</strong></div>
            <div><span>Email Status</span><strong>{{ submission.delivery.emailStatusMessage }}</strong></div>
          </div>

          <div class="actions">
            <a class="ghost action-link" [href]="submission.delivery.whatsappShareUrl" target="_blank" rel="noopener">Send via WhatsApp</a>
            <a
              [routerLink]="['/hall-ticket']"
              [queryParams]="{ applicationNo: submission.applicationNo, studentDateOfBirth: submission.candidate.studentDateOfBirth }"
            >
              Hall Ticket Page
            </a>
            <a [routerLink]="['/admission']">New Admission</a>
          </div>
        } @else {
          <div class="section-head">
            <h1>No Submission Loaded</h1>
            <p>Open this page right after submitting an admission, or start a new application.</p>
          </div>

          <div class="actions">
            <a [routerLink]="['/admission']">Go to Admission</a>
          </div>
        }
      </section>
    </section>
  `,
  styles: [
    `
      .submitted-shell {
        padding: clamp(1.2rem, 3vw, 2rem);
      }
      .result-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
        margin-top: 1.25rem;
      }
      .result-grid div {
        display: grid;
        gap: 0.2rem;
        padding: 0.9rem 1rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.78);
      }
      .result-grid span {
        color: var(--ink-soft);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .actions {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
        margin-top: 1.25rem;
      }
      .action-link {
        text-decoration: none;
      }
      .ghost {
        color: var(--primary);
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid var(--line);
      }
      @media (max-width: 720px) {
        .result-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdmissionSubmittedPageComponent implements OnInit {
  readonly result = signal<AdmissionSubmissionResult | null>(null);

  ngOnInit() {
    const raw = sessionStorage.getItem('mufied-admission-success');
    if (!raw) {
      return;
    }

    try {
      this.result.set(JSON.parse(raw) as AdmissionSubmissionResult);
    } catch {
      this.result.set(null);
    }
  }
}
