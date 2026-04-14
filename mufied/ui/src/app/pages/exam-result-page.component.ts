import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { AdmissionApiService, ExamResultLookup } from '../services/admission-api.service';

type AssetBundle = {
  watermark: string;
  leftSignature: string;
  rightSignature: string;
  seal: string;
};

@Component({
  selector: 'app-exam-result-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <section class="grid-two result-shell">
        <div class="panel search-card">
          <div class="section-head">
            <h1>Find Exam Result</h1>
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
            <button type="submit" [disabled]="loading()">Fetch Result</button>
          </form>
        </div>

        <div class="panel preview-card">
          @if (result(); as currentResult) {
            <article class="result-sheet">
              <img class="sheet-watermark" src="assets/images/result-watermark.jpeg" alt="" aria-hidden="true" />

              <header class="sheet-header">
                <h2 class="sheet-title">JAMIA MANNANIYYA ISLAMIC UNIVERSITY, VARKALA</h2>
                <h3 class="sheet-subtitle">MANNANIYYA UNIFIED FACULTY OF INTEGRATED EDUCATION</h3>
                <p class="sheet-caption">ENTRANCE EXAM RESULT-11/04/2026</p>
              </header>

              <section class="sheet-table">
                <div class="info-grid">
                  <div class="label">Hall Ticket No:</div>
                  <div class="value">{{ currentResult.examResult.hallTicketNo }}</div>
                  <div class="photo-cell" rowspan="3">
                    <div class="photo-frame">
                      <img [src]="currentResult.examResult.photoDataUrl" alt="Candidate photo" />
                    </div>
                  </div>

                  <div class="label">Student Name:</div>
                  <div class="value">{{ currentResult.examResult.studentName }}</div>

                  <div class="label">Date of Birth:</div>
                  <div class="value">{{ currentResult.examResult.dateOfBirth }}</div>

                  <div class="label">Admission Category:</div>
                  <div class="value value-wide">{{ currentResult.examResult.admissionFor }}</div>

                  <div class="label">Father/Guardian:</div>
                  <div class="value value-wide">{{ currentResult.examResult.fatherOrGuardianName }}</div>

                  <div class="label">Exam Centre:</div>
                  <div class="value value-wide">{{ currentResult.examResult.examCenterVenue }}</div>

                  <div class="label">Result Published On:</div>
                  <div class="value value-wide">{{ currentResult.examResult.resultPublishedOn }}</div>
                </div>

                <div class="score-head">
                  <div>Total Mark</div>
                  <div>Marks Obtained</div>
                  <div>Grade</div>
                </div>
                <div class="score-values">
                  <div>{{ currentResult.examResult.totalMark }}</div>
                  <div>{{ currentResult.examResult.marksObtained || '-' }}</div>
                  <div>{{ currentResult.examResult.grade || '-' }}</div>
                </div>

                <div class="remark-box">
                  <strong>REMARK:</strong>
                  <span>
                    Congratulations! You are eligible to participate the interview for admission
                    to the MANNANIYYA UMARUL FAROOQ CAMPUS KILIKOLLOOR, KOLLAM
                    under the MUFIED EDUCATION SYSTEM.
                  </span>
                  <div class="remark-gap"></div>
                  <strong>NOTE:</strong>
                  <span>
                    PLEASE ATTEND THE INTERVIEW SCHEDULED ON MONDAY 20th April 2026 &
                    SECURE YOUR ADMISSION.
                  </span>
                </div>
              </section>

              <section class="sign-section">
                <p class="sign-title">AUTHORIZED SIGNATURIES</p>
                <div class="sign-gap"></div>
                <div class="sign-row">
                  <img class="signature signature-left" src="assets/images/exam-controller-signature.jpeg" alt="Exam controller signature" />
                  <img class="signature signature-right" src="assets/images/principal-signature.jpeg" alt="Principal signature" />
                </div>
                <div class="name-row">
                  <div class="name-cell left">AL HAFIZ M.K. HASEEN MANNANI</div>
                  <div class="name-cell right">PANGODU A KHAMARUDEEN MOULAVI M.F.B</div>
                </div>
                <div class="role-row">
                  <div class="role-cell left">EXAM CONTROLLER</div>
                  <div class="role-cell right">PRINCIPAL</div>
                </div>
                <div class="seal-row">
                  <img class="seal" src="assets/images/result-seal.jpeg" alt="Official seal" />
                </div>
              </section>

              <div class="sheet-actions">
                <button type="button" class="ghost-btn" (click)="printResult()">
                  {{ downloading() ? 'Preparing PDF...' : 'Print PDF' }}
                </button>
                <button type="button" class="ghost-btn" (click)="downloadResult()">
                  {{ downloading() ? 'Preparing PDF...' : 'Download PDF' }}
                </button>
              </div>
            </article>
          } @else {
            <div class="preview-placeholder">
              <h2>Exam result preview</h2>
              <p class="muted">The candidate result will appear here after a successful lookup.</p>
            </div>
          }
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .search-card,
      .preview-card {
        padding: 1.5rem;
      }
      .lookup-form {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
      }
      .preview-card {
        display: grid;
      }
      .result-sheet {
        position: relative;
        display: grid;
        gap: 1rem;
        padding: 1.5rem;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid rgba(119, 91, 41, 0.22);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 245, 235, 0.98));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), var(--shadow-md);
        isolation: isolate;
      }
      .sheet-watermark {
        position: absolute;
        inset: 48% auto auto 50%;
        display: block;
        width: min(72%, 430px);
        transform: translate(-50%, -44%);
        opacity: 0.22;
        filter: saturate(0.85) brightness(1.02);
        pointer-events: none;
        z-index: 0;
      }
      .sheet-header,
      .sheet-table,
      .sign-section,
      .sheet-actions {
        position: relative;
        z-index: 1;
      }
      .sheet-header {
        display: grid;
        gap: 0.25rem;
        text-align: center;
      }
      .sheet-title {
        margin: 0;
        color: #2b2b2b;
        font-size: 1.25rem;
        font-weight: 800;
      }
      .sheet-subtitle {
        margin: 0;
        color: #b01010;
        font-size: 1.2rem;
        font-weight: 900;
        letter-spacing: 0.02em;
      }
      .sheet-caption {
        margin: 0.15rem 0 0;
        color: #3a3a3a;
        font-size: 0.96rem;
        font-weight: 700;
      }
      .sheet-table {
        display: grid;
        gap: 0;
        border: 1px solid rgba(132, 101, 45, 0.42);
        background: rgba(255, 255, 255, 0.86);
      }
      .info-grid {
        display: grid;
        grid-template-columns: 180px minmax(0, 1fr) 130px;
      }
      .label,
      .value,
      .photo-cell,
      .score-head > div,
      .score-values > div,
      .remark-box {
        border-right: 1px solid rgba(132, 101, 45, 0.42);
        border-bottom: 1px solid rgba(132, 101, 45, 0.42);
        padding: 0.8rem 0.9rem;
      }
      .label {
        font-weight: 800;
        color: #4d3f22;
        background: rgba(250, 246, 236, 0.92);
      }
      .value {
        color: #242424;
        font-weight: 600;
      }
      .value-wide {
        grid-column: 2 / 4;
      }
      .photo-cell {
        grid-column: 3;
        grid-row: 1 / span 3;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.9);
      }
      .photo-frame {
        width: 86px;
        height: 110px;
        border: 1px solid rgba(132, 101, 45, 0.42);
        background: white;
        overflow: hidden;
      }
      .photo-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .score-head,
      .score-values {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .score-head > div {
        font-weight: 800;
        text-align: center;
        color: #4d3f22;
        background: rgba(250, 246, 236, 0.92);
      }
      .score-values > div {
        text-align: center;
        font-size: 1.15rem;
        font-weight: 800;
        color: #242424;
      }
      .score-head > div:last-child,
      .score-values > div:last-child,
      .label:nth-child(3n),
      .value:nth-child(3n) {
        border-right: 0;
      }
      .remark-box {
        display: grid;
        gap: 0.45rem;
        min-height: 148px;
        border-right: 0;
        background: rgba(255, 252, 244, 0.92);
        color: #433116;
        line-height: 1.65;
      }
      .remark-gap {
        height: 1rem;
      }
      .sign-section {
        display: grid;
        gap: 0.45rem;
        padding-top: 0.5rem;
      }
      .sign-title {
        margin: 0;
        color: #4d3f22;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      .sign-gap {
        height: 1rem;
      }
      .sign-row,
      .name-row,
      .role-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: end;
      }
      .signature {
        max-width: 150px;
        max-height: 42px;
        justify-self: center;
      }
      .name-cell,
      .role-cell {
        text-align: center;
        color: #2b2b2b;
      }
      .name-cell {
        font-size: 0.9rem;
        font-weight: 700;
      }
      .role-cell {
        font-size: 0.88rem;
        font-weight: 700;
      }
      .seal-row {
        display: grid;
        justify-items: center;
        padding-top: 0.25rem;
      }
      .seal {
        width: 72px;
        opacity: 0.9;
      }
      .sheet-actions {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .ghost-btn {
        appearance: none;
        border: 1px solid rgba(14, 122, 67, 0.18);
        background: rgba(255, 255, 255, 0.92);
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
      .preview-placeholder {
        min-height: 280px;
        display: grid;
        place-content: center;
        text-align: center;
      }
      @media (max-width: 820px) {
        .info-grid {
          grid-template-columns: 1fr;
        }
        .photo-cell,
        .value-wide {
          grid-column: auto;
          grid-row: auto;
        }
        .sign-row,
        .name-row,
        .role-row {
          grid-template-columns: 1fr;
          gap: 0.7rem;
        }
      }
    `,
  ],
})
export class ExamResultPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdmissionApiService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly downloading = signal(false);
  readonly error = signal('');
  readonly result = signal<ExamResultLookup | null>(null);
  private assetBundlePromise: Promise<AssetBundle> | null = null;

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
      const found = await this.api.getExamResult(
        this.form.controls.applicationNo.value,
        this.form.controls.studentDateOfBirth.value,
      );
      this.result.set(found);
    } catch (err: any) {
      this.result.set(null);
      this.error.set(err?.error?.message || 'Exam result not found.');
    } finally {
      this.loading.set(false);
    }
  }

  async printResult() {
    const result = this.result();
    if (!result || this.downloading()) {
      return;
    }

    this.downloading.set(true);
    try {
      const pdf = await this.createPdfDocument(result);
      pdf.autoPrint();
      const blobUrl = String(pdf.output('bloburl'));
      const previewWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!previewWindow) {
        URL.revokeObjectURL(blobUrl);
        this.error.set('Unable to open the PDF preview. Please allow pop-ups and try again.');
      }
    } catch {
      this.error.set('Unable to generate the result PDF.');
    } finally {
      this.downloading.set(false);
    }
  }

  async downloadResult() {
    const result = this.result();
    if (!result || this.downloading()) {
      return;
    }

    this.downloading.set(true);
    try {
      const pdf = await this.createPdfDocument(result);
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.examResult.hallTicketNo || 'exam-result'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.error.set('Unable to generate the result PDF.');
    } finally {
      this.downloading.set(false);
    }
  }

  private async createPdfDocument(result: ExamResultLookup) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const assets = await this.loadAssets();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const labelWidth = 48;
    const rowHeight = 10;
    const photoBoxW = 28;
    const photoBoxH = 34;
    let y = margin + 6;

    pdf.setFillColor(250, 247, 240);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, margin, contentWidth, pageHeight - margin * 2, 'F');
    pdf.setDrawColor(120, 96, 43);
    pdf.setLineWidth(0.35);
    pdf.rect(margin, margin, contentWidth, pageHeight - margin * 2);

    this.addFadedWatermark(pdf, assets.watermark, 48, 68, 118, 118);

    pdf.setFont('times', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(35, 35, 35);
    pdf.text('JAMIA MANNANIYYA ISLAMIC UNIVERSITY, VARKALA', pageWidth / 2, y, { align: 'center' });
    y += 8;

    pdf.setTextColor(176, 16, 16);
    pdf.setFontSize(14);
    pdf.text('MANNANIYYA UNIFIED FACULTY OF INTEGRATED EDUCATION', pageWidth / 2, y, {
      align: 'center',
    });
    y += 7;

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(10);
    pdf.text('ENTRANCE EXAM RESULT-11/04/2026', pageWidth / 2, y, { align: 'center' });
    y += 8;

    const tableX = margin + 6;
    const fullWidth = contentWidth - 12;
    const photoX = tableX + fullWidth - photoBoxW;
    const leftColW = fullWidth - photoBoxW;
    const valueX = tableX + labelWidth;

    const row = (
      label: string,
      value: string,
      rowY: number,
      options?: { withPhoto?: boolean; fullWidth?: boolean },
    ) => {
      const withPhoto = options?.withPhoto ?? false;
      const fullRow = options?.fullWidth ?? false;
      const currentValueWidth = fullRow ? fullWidth - labelWidth : leftColW - labelWidth;
      pdf.rect(tableX, rowY, labelWidth, rowHeight);
      pdf.rect(valueX, rowY, currentValueWidth, rowHeight);
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(35, 35, 35);
      pdf.text(`${label}:`, tableX + 2, rowY + 6.5);
      pdf.setFont('times', 'normal');
      pdf.text(value || '-', valueX + 2, rowY + 6.5, { maxWidth: currentValueWidth - 4 });
      if (withPhoto) {
        pdf.rect(photoX, rowY, photoBoxW, rowHeight * 3);
      }
    };

    row('Hall Ticket No', result.examResult.hallTicketNo, y, { withPhoto: true });
    row('Student Name', result.examResult.studentName, y + rowHeight);
    row('Date of Birth', result.examResult.dateOfBirth, y + rowHeight * 2);

    pdf.setFont('times', 'bold');
    pdf.setFontSize(8);
    pdf.text('PHOTO', photoX + photoBoxW / 2, y + 4, { align: 'center' });
    try {
      if (result.examResult.photoDataUrl) {
        pdf.addImage(
          result.examResult.photoDataUrl,
          this.detectImageFormat(result.examResult.photoDataUrl),
          photoX + 2,
          y + 5,
          photoBoxW - 4,
          rowHeight * 3 - 7,
        );
      }
    } catch {
      // Keep empty photo frame if photo decode fails.
    }

    y += rowHeight * 3;
    row('Admission Category', result.examResult.admissionFor, y, { fullWidth: true });
    y += rowHeight;
    row('Father/Guardian', result.examResult.fatherOrGuardianName, y, { fullWidth: true });
    y += rowHeight;
    row('Exam Centre', result.examResult.examCenterVenue, y, { fullWidth: true });
    y += rowHeight;
    row('Result Published On', result.examResult.resultPublishedOn, y, { fullWidth: true });
    y += rowHeight;

    const scoreW = fullWidth / 3;
    ['Total Mark', 'Marks Obtained', 'Grade'].forEach((label, index) => {
      pdf.rect(tableX + scoreW * index, y, scoreW, rowHeight);
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9.5);
      pdf.text(label, tableX + scoreW * index + scoreW / 2, y + 6.5, { align: 'center' });
    });
    y += rowHeight;
    [String(result.examResult.totalMark), result.examResult.marksObtained || '-', result.examResult.grade || '-'].forEach(
      (value, index) => {
        pdf.rect(tableX + scoreW * index, y, scoreW, rowHeight);
        pdf.setFont('times', 'bold');
        pdf.setFontSize(10.5);
        pdf.text(value, tableX + scoreW * index + scoreW / 2, y + 6.5, { align: 'center' });
      },
    );
    y += rowHeight;

    const remarkHeight = 38;
    pdf.rect(tableX, y, fullWidth, remarkHeight);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(9.5);
    pdf.text('REMARK:', tableX + 2, y + 6);
    pdf.setFont('times', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(
      pdf.splitTextToSize(
        'Congratulations! You are eligible to participate the interview for admission to the MANNANIYYA UMARUL FAROOQ CAMPUS KILIKOLLOOR, KOLLAM under the MUFIED EDUCATION SYSTEM.',
        fullWidth - 20,
      ),
      tableX + 20,
      y + 6,
    );
    pdf.setFont('times', 'bold');
    pdf.text('NOTE:', tableX + 2, y + 24);
    pdf.setFont('times', 'normal');
    pdf.text(
      pdf.splitTextToSize(
        'PLEASE ATTEND THE INTERVIEW SCHEDULED ON MONDAY 20th April 2026 & SECURE YOUR ADMISSION.',
        fullWidth - 20,
      ),
      tableX + 20,
      y + 24,
    );
    y += remarkHeight + 12;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text('AUTHORIZED SIGNATURIES', tableX, y);
    y += 12;

    const leftCenter = tableX + fullWidth * 0.25;
    const rightCenter = tableX + fullWidth * 0.75;
    this.tryAddImage(pdf, assets.leftSignature, leftCenter - 18, y - 7, 36, 11, 'JPEG');
    this.tryAddImage(pdf, assets.rightSignature, rightCenter - 18, y - 7, 36, 11, 'JPEG');
    y += 10;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(9);
    pdf.text('AL HAFIZ M.K. HASEEN MANNANI', leftCenter, y, { align: 'center' });
    pdf.text('PANGODU A KHAMARUDEEN MOULAVI M.F.B', rightCenter, y, { align: 'center' });
    y += 6;
    pdf.text('EXAM CONTROLLER', leftCenter, y, { align: 'center' });
    pdf.text('PRINCIPAL', rightCenter, y, { align: 'center' });
    y += 8;

    this.tryAddImage(pdf, assets.seal, pageWidth / 2 - 12, y - 2, 24, 24, 'JPEG');

    return pdf;
  }

  private addFadedWatermark(
    pdf: jsPDF,
    dataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    if (!dataUrl) {
      return;
    }

    try {
      pdf.addImage(dataUrl, this.detectImageFormat(dataUrl), x, y, width, height, undefined, 'FAST');
    } catch {
      // Watermark should not block the PDF generation.
    }
  }

  private tryAddImage(
    pdf: jsPDF,
    dataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
    format: 'JPEG' | 'PNG',
  ) {
    if (!dataUrl) {
      return;
    }
    try {
      pdf.addImage(dataUrl, format, x, y, width, height, undefined, 'FAST');
    } catch {
      // Asset decode failure should not stop PDF generation.
    }
  }

  private loadAssets() {
    this.assetBundlePromise ??= Promise.all([
      this.createFadedAssetDataUrl('assets/images/result-watermark.jpeg', 0.16),
      this.readAssetAsDataUrl('assets/images/exam-controller-signature.jpeg'),
      this.readAssetAsDataUrl('assets/images/principal-signature.jpeg'),
      this.readAssetAsDataUrl('assets/images/result-seal.jpeg'),
    ]).then(([watermark, leftSignature, rightSignature, seal]) => ({
      watermark,
      leftSignature,
      rightSignature,
      seal,
    }));

    return this.assetBundlePromise;
  }

  private readAssetAsDataUrl(path: string) {
    return fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load asset: ${path}`);
        }
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error(`Unable to read asset: ${path}`));
            reader.readAsDataURL(blob);
          }),
      )
      .catch(() => '');
  }

  private async createFadedAssetDataUrl(path: string, opacity: number) {
    const source = await this.readAssetAsDataUrl(path);
    if (!source) {
      return '';
    }

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
