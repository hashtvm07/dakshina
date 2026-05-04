import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-admissions-page',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe, NgFor, NgIf],
  templateUrl: './admissions-page.component.html',
  styleUrl: './admissions-page.component.scss'
})
export class AdmissionsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly courseLabels: Record<string, string> = {
    '101': 'UP Section 4-7',
    '201': 'Secondary level',
    '301': 'Higher Secondary level'
  };

  protected readonly searchForm = this.formBuilder.group({
    query: ['']
  });

  protected readonly admissions$ = this.searchForm.valueChanges.pipe(
    startWith(this.searchForm.getRawValue()),
    switchMap((value) =>
      this.api.byPath<any[]>(`/api/muallims?status=admitted&query=${encodeURIComponent(value.query ?? '')}`)
    )
  );
}
