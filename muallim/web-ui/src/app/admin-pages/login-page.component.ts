import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected message = '';
  protected submitting = false;

  protected readonly form = this.formBuilder.group({
    username: ['superadmin', Validators.required],
    password: ['', Validators.required]
  });

  protected login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.message = '';
    this.submitting = true;

    this.auth.adminLogin(value.username ?? '', value.password ?? '').subscribe({
      next: () => void this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.message = 'Invalid admin login.';
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
