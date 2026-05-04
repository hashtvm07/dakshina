import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeContentAdminService, ManagedAdmission } from './home-content-admin.service';

const ADMISSION_CLASS_OPTIONS = ['Foundation course Class 4-7 (HIFZ)', 'Secondary (8-10)', 'Higher Secondary'];
const ADMISSION_COLLEGE = 'Mannaniyya Umarul Farooq Academy Kilikolloor, Kollam';

@Component({
  selector: 'app-applications-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './applications-management.component.html',
  styleUrl: './applications-management.component.css',
})
export class ApplicationsManagementComponent {
  protected readonly applications = signal<ManagedAdmission[]>([]);
  protected readonly loading = signal(true);
  protected readonly admittingApplicationNo = signal('');
  protected readonly admissionDraft = signal<ManagedAdmission | null>(null);
  protected selectedClass = ADMISSION_CLASS_OPTIONS[1];
  protected readonly message = signal('');
  protected readonly classOptions = ADMISSION_CLASS_OPTIONS;
  protected readonly college = ADMISSION_COLLEGE;

  constructor(private readonly adminService: HomeContentAdminService) {
    void this.loadApplications();
  }

  protected async loadApplications() {
    this.loading.set(true);
    this.message.set('');
    try {
      const response = await this.adminService.getApplications();
      const applicationItems = response.items.filter(
        (item) => item.status === 'application' || (!item.status && !item.admissionNumber),
      );
      this.applications.set(applicationItems);
      this.message.set(`Loaded ${applicationItems.length} application(s).`);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to load applications.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected openAdmitDialog(application: ManagedAdmission) {
    if (this.admittingApplicationNo()) {
      return;
    }

    this.selectedClass = this.classOptions.includes(application.admissionFor)
      ? application.admissionFor
      : this.classOptions[1];
    this.admissionDraft.set(application);
  }

  protected closeAdmitDialog() {
    if (!this.admittingApplicationNo()) {
      this.admissionDraft.set(null);
    }
  }

  protected async confirmAdmission() {
    const application = this.admissionDraft();

    if (!application) {
      return;
    }

    const applicationNo = application.applicationNo;

    if (this.admittingApplicationNo()) {
      return;
    }

    this.admittingApplicationNo.set(applicationNo);
    this.message.set(`Admitting ${applicationNo}...`);
    try {
      const response = await this.adminService.admitStudent(undefined, application, {
        admittedClass: this.selectedClass,
        college: this.college,
      });
      await this.loadApplications();
      this.message.set(response.message);
      this.admissionDraft.set(null);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to admit student.'));
    } finally {
      this.admittingApplicationNo.set('');
    }
  }

  protected formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
    }).format(new Date(value));
  }

  private formatError(error: unknown, fallback: string) {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      const detail = Array.isArray(message) ? message.join(' | ') : message;
      return detail || `${fallback} (${error.status} ${error.statusText})`;
    }

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
