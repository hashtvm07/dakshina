import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';
import { HomeContentEditorComponent } from './home-content-editor.component';
import { UserManagementComponent } from './user-management.component';
import { AdmissionsPanelComponent } from './admissions-panel.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [HomeContentEditorComponent, UserManagementComponent, AdmissionsPanelComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  protected readonly activePanel = signal<'content' | 'users' | 'admissions'>('content');
  protected readonly mobileMenuOpen = signal(false);

  constructor(
    protected readonly auth: AdminAuthService,
    private readonly router: Router,
  ) {}

  protected showPanel(panel: 'content' | 'users' | 'admissions') {
    this.activePanel.set(panel);
    this.mobileMenuOpen.set(false);
  }

  protected toggleMobileMenu() {
    this.mobileMenuOpen.update((value) => !value);
  }

  protected async logout() {
    this.mobileMenuOpen.set(false);
    this.auth.logout(false);
    await this.router.navigate(['/login']);
  }
}
