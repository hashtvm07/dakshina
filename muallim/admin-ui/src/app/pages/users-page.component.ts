import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-users-page',
  imports: [ReactiveFormsModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly form = this.formBuilder.group({
    name: [''],
    username: [''],
    email: [''],
    phone: [''],
    address: [''],
    password: [''],
    userType: ['office_admin'],
    allowedMenus: this.formBuilder.nonNullable.control<string[]>([])
  });

  protected readonly data$ = forkJoin({
    users: this.api.get<any[]>('users'),
    meta: this.api.get<any>('userMeta')
  });

  protected toggleMenu(menuKey: string, checked: boolean) {
    const current = this.form.controls.allowedMenus.value;
    const next = checked ? [...current, menuKey] : current.filter((item) => item !== menuKey);
    this.form.controls.allowedMenus.setValue(Array.from(new Set(next)));
  }

  protected createUser() {
    this.api.post('users', this.form.getRawValue()).subscribe(() => location.reload());
  }

  protected removeUser(id: number) {
    this.api.deleteByPath(`/api/users/${id}`).subscribe(() => location.reload());
  }
}
