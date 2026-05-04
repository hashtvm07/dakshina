import { Routes } from '@angular/router';
import { AdmissionsPageComponent } from './admin-pages/admissions-page.component';
import { CollegesPageComponent } from './admin-pages/colleges-page.component';
import { ContentPageComponent } from './admin-pages/content-page.component';
import { DashboardPageComponent } from './admin-pages/dashboard-page.component';
import { LoginPageComponent as AdminLoginPageComponent } from './admin-pages/login-page.component';
import { RegistrationsPageComponent } from './admin-pages/registrations-page.component';
import { SettingsPageComponent } from './admin-pages/settings-page.component';
import { UsersPageComponent } from './admin-pages/users-page.component';
import { VacanciesAdminPageComponent } from './admin-pages/vacancies-admin-page.component';
import { adminAuthGuard } from './core/auth.guard';
import { AboutPageComponent } from './pages/about-page.component';
import { EventsPageComponent } from './pages/events-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { MuallimProfilePageComponent } from './pages/muallim-profile-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { SearchPageComponent } from './pages/search-page.component';
import { VacanciesPageComponent } from './pages/vacancies-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'about-us', component: AboutPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'events', component: EventsPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'vacancies', component: VacanciesPageComponent },
  { path: 'muallim/:publicId', component: MuallimProfilePageComponent },
  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'admin/login', component: AdminLoginPageComponent },
  { path: 'admin/dashboard', component: DashboardPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/settings', component: SettingsPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/content', component: ContentPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/users', component: UsersPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/colleges', component: CollegesPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/vacancies', component: VacanciesAdminPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/registrations', redirectTo: 'admin/applications' },
  { path: 'admin/applications', component: RegistrationsPageComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/admissions', component: AdmissionsPageComponent, canActivate: [adminAuthGuard] },
  { path: '**', redirectTo: '' }
];
