import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SiteFacadeService } from './core/site-facade.service';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor, AsyncPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected readonly siteFacade = inject(SiteFacadeService);

  protected readonly adminNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Settings', path: '/admin/settings' },
    { label: 'Content', path: '/admin/content' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Colleges', path: '/admin/colleges' },
    { label: 'Vacancies', path: '/admin/vacancies' },
    { label: 'Applications', path: '/admin/applications' },
    { label: 'Admissions', path: '/admin/admissions' }
  ];

  protected searchId = '';

  protected get user() {
    return this.auth.currentUser();
  }

  protected get adminUser() {
    return this.auth.currentAdminUser();
  }

  protected get isAdminRoute() {
    return this.router.url.startsWith('/admin');
  }

  protected get isAdminLoginPage() {
    return this.router.url.startsWith('/admin/login');
  }

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

  protected logout() {
    this.auth.logout();
  }

  protected adminLogout() {
    this.auth.adminLogout();
  }
}
