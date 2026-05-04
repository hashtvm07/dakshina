import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-events-page',
  imports: [AsyncPipe, DatePipe, NgFor],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss'
})
export class EventsPageComponent {
  private readonly api = inject(ApiService);
  protected readonly vacancies$ = this.api.get<any[]>('vacancies');
}
