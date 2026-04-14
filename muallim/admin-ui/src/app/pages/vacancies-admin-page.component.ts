import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-vacancies-admin-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './vacancies-admin-page.component.html',
  styleUrl: './vacancies-admin-page.component.scss'
})
export class VacanciesAdminPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected editingId?: number;

  protected readonly form = this.formBuilder.group({
    title: [''],
    subject: [''],
    totalPositions: [1],
    location: [''],
    qualification: [''],
    lastDate: [''],
    contactInfo: [''],
    notes: [''],
    collegeId: [1]
  });

  protected readonly data$ = forkJoin({
    colleges: this.api.get<any[]>('colleges'),
    vacancies: this.api.get<any[]>('vacancies')
  });

  protected save() {
    const request = this.editingId
      ? this.api.putByPath(`/api/vacancies/${this.editingId}`, this.form.getRawValue())
      : this.api.post('vacancies', this.form.getRawValue());

    request.subscribe(() => location.reload());
  }

  protected remove(id: number) {
    this.api.deleteByPath(`/api/vacancies/${id}`).subscribe(() => location.reload());
  }

  protected edit(vacancy: any) {
    this.editingId = vacancy.id;
    this.form.patchValue({
      ...vacancy,
      collegeId: vacancy.college?.id ?? vacancy.collegeId
    });
  }
}
