import { Routes } from '@angular/router';
import { CollegesPageComponent } from './pages/colleges-page.component';
import { ContentPageComponent } from './pages/content-page.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { RegistrationsPageComponent } from './pages/registrations-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';
import { UsersPageComponent } from './pages/users-page.component';
import { VacanciesAdminPageComponent } from './pages/vacancies-admin-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'content', component: ContentPageComponent },
  { path: 'users', component: UsersPageComponent },
  { path: 'colleges', component: CollegesPageComponent },
  { path: 'vacancies', component: VacanciesAdminPageComponent },
  { path: 'registrations', component: RegistrationsPageComponent },
  { path: '**', redirectTo: 'dashboard' }
];
