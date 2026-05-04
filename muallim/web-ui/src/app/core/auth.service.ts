import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

export type PortalUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  userType: string;
  allowedMenus?: string[];
  muallimId?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly portalStorageKey = 'muallim-web-session';
  private readonly adminStorageKey = 'muallim-admin-session';

  login(username: string, password: string) {
    return this.api.postByPath<PortalUser>('/api/users/login', { username, password }).pipe(
      tap((user) => {
        sessionStorage.setItem(this.portalStorageKey, JSON.stringify(user));

        if (user.userType !== 'muallim') {
          sessionStorage.setItem(this.adminStorageKey, JSON.stringify(user));
        }
      })
    );
  }

  adminLogin(username: string, password: string) {
    return this.api.postByPath<PortalUser>('/api/users/login', { username, password }).pipe(
      tap((user) => {
        if (user.userType === 'muallim') {
          throw new Error('Muallim accounts cannot access admin.');
        }

        sessionStorage.setItem(this.adminStorageKey, JSON.stringify(user));
        sessionStorage.setItem(this.portalStorageKey, JSON.stringify(user));
      })
    );
  }

  logout() {
    sessionStorage.removeItem(this.portalStorageKey);
    sessionStorage.removeItem(this.adminStorageKey);
    void this.router.navigate(['/']);
  }

  adminLogout() {
    sessionStorage.removeItem(this.adminStorageKey);
    void this.router.navigate(['/admin/login']);
  }

  currentUser() {
    const saved = sessionStorage.getItem(this.portalStorageKey);
    return saved ? (JSON.parse(saved) as PortalUser) : null;
  }

  currentAdminUser() {
    const saved = sessionStorage.getItem(this.adminStorageKey);
    return saved ? (JSON.parse(saved) as PortalUser) : null;
  }

  isAdminAuthenticated() {
    return !!this.currentAdminUser();
  }

  canEditMuallim(publicId: string) {
    const user = this.currentUser();
    return user?.userType === 'muallim' && user.muallimId === publicId;
  }
}
