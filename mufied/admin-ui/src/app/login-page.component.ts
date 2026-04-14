import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  protected readonly username = signal('admin');
  protected readonly password = signal('admin');
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  constructor(
    private readonly auth: AdminAuthService,
    private readonly router: Router,
  ) {}

  protected async login() {
    this.loading.set(true);
    this.error.set('');

    try {
      await this.auth.login(this.username(), this.password());
      await this.router.navigate(['/']);
    } catch (error) {
      this.error.set(this.formatError(error, 'Login failed.'));
    } finally {
      this.loading.set(false);
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
