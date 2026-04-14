import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { AdmissionApiService } from '../services/admission-api.service';

@Component({
  selector: 'app-hall-ticket-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <section class="grid-two hall-shell">
        <div class="panel search-card">
          <div class="section-head">
            <h1>Generate Hall Ticket</h1>
            <p>Use the candidate application number and date of birth.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="search()" class="lookup-form">
            <div class="field">
              <label>Application Number</label>
              <input formControlName="applicationNo" />
            </div>
            <div class="field">
              <label>Date of Birth</label>
              <input type="date" formControlName="studentDateOfBirth" />
            </div>
            @if (error()) {
              <p class="error-text">{{ error() }}</p>
            }
            <button type="submit" [disabled]="loading()">Fetch Hall Ticket</button>
          </form>
        </div>

        <div class="panel ticket-card">
          @if (ticket()) {
            <div class="ticket-face">
              <p class="ticket-kicker">{{ ticket().institution.title1 }}</p>
              <h2>{{ ticket().institution.title2 }}</h2>
              <img class="ticket-photo" [src]="ticket().hallTicket.photoDataUrl" alt="Candidate photo" />
              <div class="ticket-grid">
                <div><span>Hall Ticket No</span><strong>{{ ticket().hallTicket.hallTicketNo }}</strong></div>
                <div><span>Application No</span><strong>{{ ticket().hallTicket.applicationNo }}</strong></div>
                <div><span>Student</span><strong>{{ ticket().hallTicket.studentName }}</strong></div>
                <div><span>Admission For</span><strong>{{ ticket().hallTicket.admissionFor }}</strong></div>
                <div><span>Date of Birth</span><strong>{{ ticket().hallTicket.dateOfBirth }}</strong></div>
                <div><span>Father</span><strong>{{ ticket().hallTicket.fatherName }}</strong></div>
                <div><span>Guardian</span><strong>{{ ticket().hallTicket.guardianName }}</strong></div>
                <div><span>Exam Center & Venue</span><strong>{{ ticket().hallTicket.examCenterVenue }}</strong></div>
                <div><span>Exam Date</span><strong>{{ ticket().hallTicket.examDate }}</strong></div>
                <div><span>Guardian Relation</span><strong>{{ ticket().hallTicket.guardianRelation }}</strong></div>
                <div><span>Mobile</span><strong>{{ ticket().hallTicket.mobileNumber }}</strong></div>
                <div><span>WhatsApp</span><strong>{{ ticket().hallTicket.whatsappNumber }}</strong></div>
                <div><span>Email</span><strong>{{ ticket().hallTicket.email }}</strong></div>
                <div><span>Identification Marks</span><strong>{{ ticket().hallTicket.identificationMarks.join(', ') }}</strong></div>
              </div>
              <div class="ticket-footer">
                <strong>{{ ticket().institution.footerLine1 }}</strong>
                <span>{{ ticket().institution.footerLine2 }}</span>
                <span>{{ ticket().institution.footerLine3 }}</span>
                <span>{{ ticket().institution.footerLine4 }}</span>
                <span>{{ ticket().institution.footerLine5 }}</span>
              </div>
              <div class="ticket-actions">
                <button type="button" class="ghost-btn" (click)="printTicket()">Print PDF</button>
                <button type="button" class="ghost-btn" (click)="downloadTicket()">Download PDF</button>
              </div>
            </div>
          } @else {
            <div class="ticket-placeholder">
              <h2>Hall ticket preview</h2>
              <p class="muted">The candidate ticket will appear here after a successful lookup.</p>
            </div>
          }
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .search-card,
      .ticket-card {
        padding: 1.5rem;
      }
      .lookup-form {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
      }
      .ticket-face {
        position: relative;
        overflow: hidden;
        padding: 1.7rem;
        border-radius: 24px;
        background:
          linear-gradient(135deg, rgba(14, 122, 67, 0.12), rgba(255, 255, 255, 0.94)),
          linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(223, 248, 227, 0.88));
        border: 1px solid rgba(14, 122, 67, 0.16);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), var(--shadow-md);
      }
      .ticket-face::after {
        content: "";
        position: absolute;
        inset: auto -60px -60px auto;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(14, 122, 67, 0.18), transparent 68%);
      }
      .ticket-kicker {
        margin: 0;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 800;
      }
      .ticket-face h2 {
        margin: 0.35rem 0 0;
      }
      .ticket-photo {
        width: 120px;
        height: 150px;
        object-fit: cover;
        border-radius: 18px;
        border: 1px solid rgba(14, 122, 67, 0.16);
        margin-top: 1rem;
      }
      .ticket-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.25rem;
      }
      .ticket-grid div {
        display: grid;
        gap: 0.25rem;
        padding: 0.9rem 1rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.72);
      }
      .ticket-actions {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
        margin-top: 1.25rem;
      }
      .ticket-footer {
        display: grid;
        gap: 0.3rem;
        margin-top: 1.25rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(14, 122, 67, 0.16);
      }
      .ticket-footer strong {
        color: #163229;
      }
      .ticket-footer span {
        color: #5d7066;
        font-size: 0.9rem;
      }
      .ghost-btn {
        appearance: none;
        border: 1px solid rgba(14, 122, 67, 0.18);
        background: rgba(255, 255, 255, 0.88);
        color: var(--primary);
        border-radius: 999px;
        padding: 0.85rem 1.15rem;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .ghost-btn:hover {
        background: white;
      }
      .ticket-grid span {
        color: var(--ink-soft);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .ticket-placeholder {
        min-height: 280px;
        display: grid;
        place-content: center;
        text-align: center;
      }
      @media (max-width: 720px) {
        .ticket-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HallTicketPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdmissionApiService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly ticket = signal<any | null>(null);

  readonly form = this.fb.nonNullable.group({
    applicationNo: ['', Validators.required],
    studentDateOfBirth: ['', Validators.required],
  });

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const applicationNo = params.get('applicationNo');
      const studentDateOfBirth = params.get('studentDateOfBirth');
      if (applicationNo && studentDateOfBirth) {
        this.form.patchValue({ applicationNo, studentDateOfBirth });
        this.search();
      }
    });
  }

  async search() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Enter the application number and date of birth.');
      return;
    }

    this.loading.set(true);
    try {
      const result = await this.api.getHallTicket(
        this.form.controls.applicationNo.value,
        this.form.controls.studentDateOfBirth.value,
      );
      this.ticket.set(result);
    } catch (err: any) {
      this.ticket.set(null);
      this.error.set(err?.error?.message || 'Hall ticket not found.');
    } finally {
      this.loading.set(false);
    }
  }

  printTicket() {
    const ticket = this.ticket();
    if (!ticket) {
      return;
    }

    const pdf = this.createPdfDocument(ticket);
    pdf.autoPrint();
    const blobUrl = String(pdf.output('bloburl'));
    const previewWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (!previewWindow) {
      URL.revokeObjectURL(blobUrl);
      this.error.set('Unable to open the PDF preview. Please allow pop-ups and try again.');
      return;
    }
  }

  downloadTicket() {
    const ticket = this.ticket();
    if (!ticket) {
      return;
    }

    const pdf = this.createPdfDocument(ticket);
    pdf.save(`${ticket.hallTicket.hallTicketNo || 'hall-ticket'}.pdf`);
  }

  private createPdfDocument(ticket: any) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    pdf.setFillColor(244, 239, 228);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 6, 6, 'F');

    pdf.setDrawColor(14, 122, 67);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 6, 6, 'S');

    pdf.setTextColor(15, 106, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(String(ticket.institution.title1 || ''), margin + 8, margin + 12);

    pdf.setTextColor(23, 50, 41);
    pdf.setFontSize(18);
    pdf.text(String(ticket.institution.title2 || ''), margin + 8, margin + 21, {
      maxWidth: contentWidth - 52,
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(93, 112, 102);

    const photoX = pageWidth - margin - 32;
    const photoY = margin + 8;
    const photoWidth = 24;
    const photoHeight = 30;

    try {
      if (ticket.hallTicket.photoDataUrl) {
        const format = this.detectImageFormat(ticket.hallTicket.photoDataUrl);
        pdf.addImage(ticket.hallTicket.photoDataUrl, format, photoX, photoY, photoWidth, photoHeight);
      }
    } catch {
      pdf.setDrawColor(190, 190, 190);
      pdf.rect(photoX, photoY, photoWidth, photoHeight);
    }

    const fields = [
      ['Hall Ticket No', ticket.hallTicket.hallTicketNo],
      ['Application No', ticket.hallTicket.applicationNo],
      ['Student', ticket.hallTicket.studentName],
      ['Admission For', ticket.hallTicket.admissionFor],
      ['Date of Birth', ticket.hallTicket.dateOfBirth],
      ['Father', ticket.hallTicket.fatherName],
      ['Guardian', ticket.hallTicket.guardianName],
      ['Exam Center & Venue', ticket.hallTicket.examCenterVenue],
      ['Exam Date', ticket.hallTicket.examDate],
      ['Guardian Relation', ticket.hallTicket.guardianRelation],
      ['Mobile', ticket.hallTicket.mobileNumber],
      ['WhatsApp', ticket.hallTicket.whatsappNumber],
      ['Email', ticket.hallTicket.email],
      ['Identification Marks', ticket.hallTicket.identificationMarks.join(', ')],
    ];

    const colGap = 6;
    const colWidth = (contentWidth - 16 - colGap) / 2;
    let leftY = margin + 38;
    let rightY = margin + 38;

    fields.forEach(([label, value], index) => {
      const column = index % 2;
      const x = margin + 8 + column * (colWidth + colGap);
      const y = column === 0 ? leftY : rightY;
      const boxHeight = this.measureBoxHeight(pdf, colWidth, String(value || '-'));

      pdf.setFillColor(248, 251, 248);
      pdf.roundedRect(x, y, colWidth, boxHeight, 3, 3, 'F');

      pdf.setTextColor(93, 112, 102);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.text(String(label), x + 4, y + 6);

      pdf.setTextColor(23, 50, 41);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(String(value || '-'), colWidth - 8);
      pdf.text(lines, x + 4, y + 12);

      if (column === 0) {
        leftY += boxHeight + 4;
      } else {
        rightY += boxHeight + 4;
      }
    });

    const footerY = pageHeight - margin - 28;
    pdf.setDrawColor(14, 122, 67);
    pdf.line(margin + 8, footerY - 4, pageWidth - margin - 8, footerY - 4);
    pdf.setTextColor(23, 50, 41);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(String(ticket.institution.footerLine1 || ''), margin + 8, footerY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(93, 112, 102);
    [
      ticket.institution.footerLine2,
      ticket.institution.footerLine3,
      ticket.institution.footerLine4,
      ticket.institution.footerLine5,
    ].forEach((line, index) => {
      pdf.text(String(line || ''), margin + 8, footerY + 5 + index * 4.5, {
        maxWidth: contentWidth - 16,
      });
    });

    return pdf;
  }

  private measureBoxHeight(pdf: jsPDF, width: number, value: string) {
    const lines = pdf.splitTextToSize(value, width - 8);
    return Math.max(18, 12 + lines.length * 5 + 4);
  }

  private detectImageFormat(dataUrl: string) {
    if (dataUrl.startsWith('data:image/png')) {
      return 'PNG';
    }
    if (dataUrl.startsWith('data:image/webp')) {
      return 'WEBP';
    }
    return 'JPEG';
  }
}
