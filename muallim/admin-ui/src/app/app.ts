import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings', path: '/settings' },
    { label: 'Content', path: '/content' },
    { label: 'Users', path: '/users' },
    { label: 'Colleges', path: '/colleges' },
    { label: 'Vacancies', path: '/vacancies' },
    { label: 'Registrations', path: '/registrations' }
  ];
}
