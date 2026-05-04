import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContentAdminService, ManagedAdmission } from './home-content-admin.service';
import type { jsPDF } from 'jspdf';

type ConfirmationDialog = {
  title: string;
  message: string;
  confirmLabel: string;
  tone: 'danger' | 'warning';
};

@Component({
  selector: 'app-admissions-list',
  imports: [CommonModule],
  templateUrl: './admissions-list.component.html',
  styleUrl: './admissions-list.component.css',
})
export class AdmissionsListComponent {
  protected readonly admissions = signal<ManagedAdmission[]>([]);
  protected readonly loading = signal(true);
  protected readonly deletingAdmissionNo = signal('');
  protected readonly downloadingAdmissionNo = signal('');
  protected readonly resettingAdmissionNumbers = signal(false);
  protected readonly message = signal('');
  protected readonly confirmDialog = signal<ConfirmationDialog | null>(null);
  private confirmDialogResolver: ((confirmed: boolean) => void) | null = null;

  constructor(private readonly adminService: HomeContentAdminService) {
    void this.loadAdmissions();
  }

  protected async loadAdmissions() {
    this.loading.set(true);
    this.message.set('');
    try {
      const response = await this.adminService.getAdmissions();
      const admittedItems = response.items
        .filter((item) => this.isAdmittedAdmission(item))
        .sort((a, b) => this.getAdmittedTime(a) - this.getAdmittedTime(b));
      this.admissions.set(admittedItems);
      this.message.set(`Loaded ${admittedItems.length} admitted student(s).`);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to load admissions.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
    }).format(new Date(value));
  }

  protected formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  protected copyAdmissionNumber(admissionNumber: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(admissionNumber);
    }
  }

  protected async deleteAdmission(admission: ManagedAdmission) {
    if (this.deletingAdmissionNo() || this.downloadingAdmissionNo()) {
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Move admission?',
      message: `Move ${admission.studentName} back to Applications? The record will stay in the database and the admission number will be removed.`,
      confirmLabel: 'Move to Applications',
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }

    this.deletingAdmissionNo.set(admission.applicationNo);
    this.message.set(`Moving ${admission.applicationNo} back to applications...`);

    try {
      const response = await this.adminService.returnAdmissionToApplications(undefined, admission.applicationNo);
      this.admissions.update((items) => items.filter((item) => item.applicationNo !== admission.applicationNo));
      this.message.set(response.message);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to delete admission.'));
    } finally {
      this.deletingAdmissionNo.set('');
    }
  }

  protected async resetAdmissionNumbers() {
    if (this.resettingAdmissionNumbers() || this.deletingAdmissionNo() || this.downloadingAdmissionNo()) {
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Reset admission numbers?',
      message: 'All admitted students will be renumbered from the starting number again, grouped by class. Future admissions will continue after the new last number.',
      confirmLabel: 'Reset Numbers',
      tone: 'warning',
    });

    if (!confirmed) {
      return;
    }

    this.resettingAdmissionNumbers.set(true);
    this.message.set('Resetting admission numbers...');

    try {
      const response = await this.adminService.resetAdmissionNumbers();
      await this.loadAdmissions();
      this.message.set(response.message);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to reset admission numbers.'));
    } finally {
      this.resettingAdmissionNumbers.set(false);
    }
  }

  protected closeConfirmDialog(confirmed: boolean) {
    this.confirmDialog.set(null);
    this.confirmDialogResolver?.(confirmed);
    this.confirmDialogResolver = null;
  }

  protected async downloadAdmitCard(admission: ManagedAdmission) {
    if (this.downloadingAdmissionNo()) {
      return;
    }

    this.downloadingAdmissionNo.set(admission.applicationNo);

    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const margin = 18;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - margin * 2;
      const admittedDate = admission.admittedAt || admission.createdAt;
      const college = admission.college || admission.examCenterVenue || '-';
      const admittedClass = admission.admittedClass || admission.admissionFor || '-';

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('MUFIED Admission Card', pageWidth / 2, 18, { align: 'center' });
      pdf.setFontSize(11);
      pdf.text('Mannaniyya Unified Faculty of Integrated Education', pageWidth / 2, 25, { align: 'center' });

      pdf.setDrawColor(17, 24, 39);
      pdf.line(margin, 32, pageWidth - margin, 32);

      let y = 42;
      y = this.drawPdfRow(pdf, 'Admission Number', admission.admissionNumber || '-', margin, y, contentWidth);
      y = this.drawPdfRow(pdf, 'Admitted Date', this.formatDate(admittedDate), margin, y, contentWidth);
      y = this.drawPdfRow(pdf, 'Class', admittedClass, margin, y, contentWidth);
      y = this.drawPdfRow(pdf, 'College', college, margin, y, contentWidth);

      y += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Student Details', margin, y);
      y += 8;

      const rows: Array<[string, string]> = [
        ['Student Name', admission.studentName],
        ['Application Number', admission.applicationNo],
        ['Date of Birth', this.formatDate(admission.studentDateOfBirth)],
        ['Aadhaar Number', admission.aadhaarNumber],
        ['Father Name', admission.fatherName],
        ['Mother Name', admission.motherName],
        ['Guardian', `${admission.guardianName} (${admission.guardianRelation})`],
        ['Mobile', admission.mobileNumber],
        ['WhatsApp', admission.whatsappNumber],
        ['Email', admission.email],
        ['Address', admission.homeAddress],
        ['State / District', `${admission.state} / ${admission.district}`],
        ['School', admission.schoolNameAndPlace],
        ['School Class Completed', admission.schoolClassCompleted],
        ['Madrassa', admission.madrassaNameAndPlace],
        ['Madrassa Class Completed', admission.madrassaClassCompleted],
      ];

      for (const [label, value] of rows) {
        y = this.drawPdfRow(pdf, label, value || '-', margin, y, contentWidth);
        if (y > 276) {
          pdf.addPage();
          y = 22;
        }
      }

      pdf.save(`admit-card-${admission.admissionNumber || admission.applicationNo}.pdf`);
      this.message.set(`Admit card downloaded for ${admission.studentName}.`);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to download admit card.'));
    } finally {
      this.downloadingAdmissionNo.set('');
    }
  }

  private drawPdfRow(
    pdf: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number,
    width: number,
  ) {
    const labelWidth = 48;
    const valueLines = pdf.splitTextToSize(value, width - labelWidth - 4);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(`${label}:`, x, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(valueLines, x + labelWidth, y);
    return y + Math.max(7, valueLines.length * 5);
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

  private requestConfirmation(options: ConfirmationDialog) {
    this.confirmDialogResolver?.(false);
    this.confirmDialog.set(options);

    return new Promise<boolean>((resolve) => {
      this.confirmDialogResolver = resolve;
    });
  }

  private isAdmittedAdmission(item: ManagedAdmission) {
    return item.status === 'admitted' || Boolean(item.admissionNumber);
  }

  private getAdmittedTime(item: ManagedAdmission) {
    const timestamp = new Date(item.admittedAt || item.createdAt).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
  }
}
