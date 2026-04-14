import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SiteFacadeService } from './core/site-facade.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor, AsyncPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  protected readonly siteFacade = inject(SiteFacadeService);

  protected readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'Vacancies', path: '/vacancies' }
  ];

  protected searchId = '';

  constructor() {
    this.siteFacade.loadSite().subscribe();
  }

  protected submitSearch() {
    const publicId = this.searchId.trim();
    if (!publicId) {
      return;
    }

    void this.router.navigate(['/muallim', publicId]);
    this.searchId = '';
  }
}
