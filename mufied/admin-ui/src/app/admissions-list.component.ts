import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContentAdminService, ManagedAdmission } from './home-content-admin.service';

@Component({
  selector: 'app-admissions-list',
  imports: [CommonModule],
  templateUrl: './admissions-list.component.html',
  styleUrl: './admissions-list.component.css',
})
export class AdmissionsListComponent {
  protected readonly admissions = signal<ManagedAdmission[]>([]);
  protected readonly loading = signal(true);
  protected readonly message = signal('');

  constructor(private readonly adminService: HomeContentAdminService) {
    void this.loadAdmissions();
  }

  protected async loadAdmissions() {
    this.loading.set(true);
    this.message.set('');
    try {
      const response = await this.adminService.getAdmittedStudents();
      this.admissions.set(response.items);
      this.message.set(`Loaded ${response.total} admitted student(s).`);
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

  protected copyAdmissionNumber(admissionNumber: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(admissionNumber);
    }
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
