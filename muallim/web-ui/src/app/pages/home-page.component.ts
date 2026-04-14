import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFacadeService } from '../core/site-facade.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink, DatePipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  protected readonly siteFacade = inject(SiteFacadeService);
  private readonly api = inject(ApiService);
  protected readonly vacancies$ = this.api.get<any[]>('vacancies');
}
