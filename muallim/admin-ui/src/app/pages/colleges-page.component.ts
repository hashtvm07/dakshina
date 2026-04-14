import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-colleges-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor],
  templateUrl: './colleges-page.component.html',
  styleUrl: './colleges-page.component.scss'
})
export class CollegesPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected editingId?: number;

  protected readonly form = this.formBuilder.group({
    name: [''],
    location: [''],
    district: [''],
    state: [''],
    isActive: [true]
  });

  protected readonly colleges$ = this.api.get<any[]>('colleges');

  protected save() {
    const request = this.editingId
      ? this.api.putByPath(`/api/colleges/${this.editingId}`, this.form.getRawValue())
      : this.api.post('colleges', this.form.getRawValue());

    request.subscribe(() => location.reload());
  }

  protected remove(id: number) {
    this.api.deleteByPath(`/api/colleges/${id}`).subscribe(() => location.reload());
  }

  protected edit(college: any) {
    this.editingId = college.id;
    this.form.patchValue(college);
  }
}
