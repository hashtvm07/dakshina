import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteFacadeService } from '../core/site-facade.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);
  protected readonly siteFacade = inject(SiteFacadeService);

  protected readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    bio: ['']
  });

  protected submittedId = '';

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.post<any>('muallimRegister', this.form.getRawValue()).subscribe((response) => {
      this.submittedId = response.publicId;
      this.form.reset();
    });
  }
}
