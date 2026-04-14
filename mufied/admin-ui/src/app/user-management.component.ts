import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeContentAdminService, ManagedUser, UserRole } from './home-content-admin.service';

@Component({
  selector: 'app-user-management',
  imports: [FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  protected readonly users = signal<ManagedUser[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly message = signal('The default admin user is created automatically on first login.');
  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly role = signal<UserRole>('mentor');

  protected readonly roles: UserRole[] = ['mentor', 'student', 'admin'];

  constructor(private readonly adminService: HomeContentAdminService) {
    void this.loadUsers();
  }

  protected async loadUsers() {
    this.loading.set(true);
    try {
      const response = await this.adminService.listUsers();
      this.users.set(response.items);
      this.message.set('User list loaded.');
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to load users.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected async createUser() {
    this.saving.set(true);
    try {
      const response = await this.adminService.createUser({
        username: this.username(),
        password: this.password(),
        role: this.role(),
      });
      this.users.update((users) => [...users, response.user].sort((a, b) => a.username.localeCompare(b.username)));
      this.username.set('');
      this.password.set('');
      this.role.set('mentor');
      this.message.set(response.message);
    } catch (error) {
      this.message.set(this.formatError(error, 'Unable to create user.'));
    } finally {
      this.saving.set(false);
    }
  }

  protected formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
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
