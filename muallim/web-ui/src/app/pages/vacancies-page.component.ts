import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-vacancies-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './vacancies-page.component.html',
  styleUrl: './vacancies-page.component.scss'
})
export class VacanciesPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly filters = this.formBuilder.group({
    query: [''],
    subject: [''],
    location: ['']
  });

  protected readonly vacancies$ = this.filters.valueChanges.pipe(
    startWith(this.filters.getRawValue()),
    switchMap((filters) => this.api.get<any[]>('vacancies', filters as Record<string, string>))
  );
}
