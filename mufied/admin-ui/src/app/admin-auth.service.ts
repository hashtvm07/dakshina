import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeContentAdminService } from './home-content-admin.service';

type AdminUser = {
  username: string;
  role: string;
};

const ADMIN_TOKEN_KEY = 'mufied-admin-token';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  readonly currentUser = signal<AdminUser | null>(null);
  readonly initializing = signal(true);

  constructor(
    private readonly adminService: HomeContentAdminService,
    private readonly router: Router,
  ) {}

  get token() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  }

  async login(username: string, password: string) {
    const response = await this.adminService.login(username, password);
    localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    this.currentUser.set(response.user);
    return response.user;
  }

  async ensureAuthenticated() {
    const token = this.token;
    if (!token) {
      this.initializing.set(false);
      return false;
    }

    try {
      const response = await this.adminService.getCurrentAdmin();
      this.currentUser.set(response.user);
      this.initializing.set(false);
      return true;
    } catch {
      this.logout(false);
      return false;
    }
  }

  logout(redirect = true) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    this.currentUser.set(null);
    this.initializing.set(false);
    if (redirect) {
      void this.router.navigate(['/login']);
    }
  }
}
