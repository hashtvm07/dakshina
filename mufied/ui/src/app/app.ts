import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="shell">
      <header class="topbar">
        <a class="brand" routerLink="/">
          <img src="assets/images/logo.jpeg" alt="MUFIED logo" />
          <div class="brand-copy">
            <span class="brand-kicker">MUFIED</span>
            <span class="brand-title">Mannaniyya Unified Faculty of Integrated Education</span>
          </div>
          <button
            class="menu-toggle"
            type="button"
            [class.open]="mobileMenuOpen"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-label="Toggle navigation menu"
            (click)="$event.preventDefault(); $event.stopPropagation(); toggleMobileMenu()"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </a>

        <nav class="menu" [class.open]="mobileMenuOpen">
          <a routerLink="/" [class.active]="isActive('/')" (click)="closeAllMenus()">Home</a>

          <details class="nav-group" [open]="openMenu === 'about'">
            <summary [class.active]="openMenu === 'about'" (click)="toggleMenu($event, 'about')">About</summary>
            <div class="flyout">
              <a href="/#about" (click)="closeAllMenus()">Institution Overview</a>
              <a href="/#campus" (click)="closeAllMenus()">Campus & Exam Centre</a>
              <a href="/#contact" (click)="closeAllMenus()">Contact</a>
            </div>
          </details>

          <details class="nav-group" [open]="openMenu === 'academics'">
            <summary [class.active]="openMenu === 'academics'" (click)="toggleMenu($event, 'academics')">Academics</summary>
            <div class="flyout">
              <a href="/#academics" (click)="closeAllMenus()">Programmes</a>
              <a href="/#admission-path" (click)="closeAllMenus()">Admission Structure</a>
              <a routerLink="/documents" (click)="closeAllMenus()">Documents</a>
            </div>
          </details>

          <a routerLink="/institutions" [class.active]="isActive('/institutions')" (click)="closeAllMenus()">Institutions</a>
          <a routerLink="/documents" [class.active]="isActive('/documents')" (click)="closeAllMenus()">Publications</a>

          <a routerLink="/admission" [class.active]="isActive('/admission')" (click)="closeAllMenus()">Admission</a>
          <a routerLink="/hall-ticket" [class.active]="isActive('/hall-ticket')" (click)="closeAllMenus()">Hall Ticket</a>
          <a routerLink="/exam-result" [class.active]="isActive('/exam-result')" (click)="closeAllMenus()">Exam Result</a>
        </nav>
      </header>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100vh;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.85rem clamp(1rem, 2vw, 2rem);
        backdrop-filter: blur(18px);
        background: rgba(255, 255, 255, 0.78);
        border-bottom: 1px solid rgba(20, 94, 58, 0.12);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        text-decoration: none;
        color: inherit;
        min-width: 0;
        flex: 1;
      }
      .brand img {
        width: 54px;
        height: 54px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: var(--shadow-md);
      }
      .brand-copy {
        display: grid;
        min-width: 0;
        flex: 1;
      }
      .brand-kicker {
        color: var(--primary);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .brand-title {
        color: var(--ink);
        font-size: 1rem;
        font-weight: 800;
      }
      .menu {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.65rem;
      }
      .menu-toggle {
        display: none;
        width: 3rem;
        height: 3rem;
        border: 0;
        border-radius: 16px;
        padding: 0.7rem;
        background: linear-gradient(135deg, rgba(13, 90, 52, 0.12), rgba(235, 155, 66, 0.18));
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        flex-shrink: 0;
      }
      .menu-toggle span {
        display: block;
        width: 100%;
        height: 3px;
        margin: 5px 0;
        border-radius: 999px;
        background: var(--ink);
        transition: transform 180ms ease, opacity 180ms ease;
      }
      .menu-toggle.open span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }
      .menu-toggle.open span:nth-child(2) {
        opacity: 0;
      }
      .menu-toggle.open span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }
      .menu > a,
      .nav-group summary {
        color: var(--ink-soft);
        text-decoration: none;
        font-weight: 700;
        list-style: none;
        padding: 0.7rem 1rem;
        border-radius: 999px;
        cursor: pointer;
        transition: 180ms ease;
      }
      .menu > a:hover,
      .menu > a.active,
      .nav-group[open] summary,
      .nav-group summary:hover {
        color: white;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        box-shadow: 0 14px 28px rgba(20, 94, 58, 0.25);
      }
      .nav-group {
        position: relative;
      }
      .nav-group summary::-webkit-details-marker {
        display: none;
      }
      .flyout {
        position: absolute;
        top: calc(100% + 0.45rem);
        right: 0;
        min-width: 220px;
        display: grid;
        gap: 0.35rem;
        padding: 0.6rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid var(--line);
        box-shadow: var(--shadow-md);
      }
      .flyout a {
        color: var(--ink);
        text-decoration: none;
        font-weight: 700;
        padding: 0.8rem 0.9rem;
        border-radius: 14px;
      }
      .flyout a:hover {
        background: rgba(223, 248, 227, 0.9);
      }
      main {
        padding: 1rem clamp(1rem, 2.4vw, 2rem) 2rem;
      }
      @media (max-width: 900px) {
        .topbar {
          align-items: flex-start;
          flex-direction: column;
        }
        .menu-toggle {
          display: inline-block;
        }
        .menu {
          display: none;
          width: 100%;
          flex-direction: column;
          align-items: stretch;
          padding-top: 0.4rem;
        }
        .menu.open {
          display: flex;
        }
        .menu > a,
        .nav-group summary {
          width: 100%;
          text-align: left;
        }
        .brand {
          align-items: flex-start;
          width: 100%;
        }
        .brand-copy {
          padding-top: 0.1rem;
        }
        .flyout {
          position: static;
          margin-top: 0.45rem;
          min-width: 0;
        }
        .nav-group {
          width: 100%;
        }
      }
    `,
  ],
})
export class App {
  private readonly router = inject(Router);
  openMenu: 'about' | 'academics' | null = null;
  mobileMenuOpen = false;
  currentPath = this.router.url.split('?')[0].split('#')[0];

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentPath = this.router.url.split('?')[0].split('#')[0];
      this.closeAllMenus();
    });
  }

  toggleMenu(event: Event, menu: 'about' | 'academics') {
    event.preventDefault();
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.openMenu = null;
    }
  }

  isActive(
    path: '/' | '/documents' | '/institutions' | '/admission' | '/hall-ticket' | '/exam-result',
  ) {
    return this.currentPath === path;
  }

  closeAllMenus() {
    this.openMenu = null;
    this.mobileMenuOpen = false;
  }
}
