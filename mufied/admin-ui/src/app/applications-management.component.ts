import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  protected readonly admitting = signal(false);
  protected readonly message = signal('');

  constructor(private readonly adminService: HomeContentAdminService) {
    void this.loadApplications();
  }

  protected async loadApplications() {
    this.loading.set(true);
    this.message.set('');
    try {
      const response = await this.adminService.getApplications();
      this.applications.set(response.items);
      this.message.set(`Loaded ${response.total} application(s).`);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to load applications.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected async admitStudent(applicationNo: string) {
    if (this.admitting()) return;

    this.admitting.set(true);
    try {
      const response = await this.adminService.admitStudent(undefined, applicationNo);
      this.applications.update((apps) =>
        apps.filter((app) => app.applicationNo !== applicationNo),
      );
      this.message.set(response.message);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to admit student.'));
    } finally {
      this.admitting.set(false);
    }
  }

  protected formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
    }).format(new Date(value));
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
