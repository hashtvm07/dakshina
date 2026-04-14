import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { MuallimProfilePageComponent } from './pages/muallim-profile-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { VacanciesPageComponent } from './pages/vacancies-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'vacancies', component: VacanciesPageComponent },
  { path: 'muallim/:publicId', component: MuallimProfilePageComponent },
  { path: '**', redirectTo: '' }
];
