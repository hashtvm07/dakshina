import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin-auth.guard';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { LoginPageComponent } from './login-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: AdminDashboardComponent, canActivate: [adminAuthGuard] },
  { path: '**', redirectTo: '' },
];
