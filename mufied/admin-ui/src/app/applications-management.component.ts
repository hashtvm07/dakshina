import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeContentAdminService, ManagedAdmission } from './home-content-admin.service';

@Component({
  selector: 'app-applications-management',
  imports: [CommonModule],
  templateUrl: './applications-management.component.html',
  styleUrl: './applications-management.component.css',
})
export class ApplicationsManagementComponent {
  protected readonly applications = signal<ManagedAdmission[]>([]);
  protected readonly loading = signal(true);
  protected readonly admittingApplicationNo = signal('');
  protected readonly message = signal('');

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

  protected async admitStudent(application: ManagedAdmission) {
    const applicationNo = application.applicationNo;

    if (this.admittingApplicationNo()) {
      return;
    }

    this.admittingApplicationNo.set(applicationNo);
    this.message.set(`Admitting ${applicationNo}...`);
    try {
      const response = await this.adminService.admitStudent(undefined, application);
      await this.loadApplications();
      this.message.set(response.message);
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
