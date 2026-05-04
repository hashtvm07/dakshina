import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [AsyncPipe, NgIf],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly api = inject(ApiService);

  protected readonly stats$ = forkJoin({
    users: this.api.get<any[]>('users'),
    muallims: this.api.byPath<any[]>('/api/muallims'),
    colleges: this.api.get<any[]>('colleges'),
    vacancies: this.api.get<any[]>('vacancies')
  });
}
