import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-registrations-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './registrations-page.component.html',
  styleUrl: './registrations-page.component.scss'
})
export class RegistrationsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly form = this.formBuilder.group({
    query: ['']
  });

  protected readonly muallims$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    switchMap((value) => this.api.byPath<any[]>(`/api/muallims?query=${value.query ?? ''}`))
  );
}
