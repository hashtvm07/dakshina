import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HomeContentApiService,
  HomeContentDocument,
  HomeContentLinkCard,
} from '../services/home-content-api.service';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page documents-page">
      @if (loading()) {
        <section class="panel status-panel">
          <p class="section-label">Documents</p>
          <h2>Loading question bank documents...</h2>
        </section>
      } @else if (error()) {
        <section class="panel status-panel error-panel">
          <p class="section-label">Documents</p>
          <h2>Unable to load documents.</h2>
          <p>{{ error() }}</p>
        </section>
      } @else if (content(); as home) {
        <section class="panel documents-hero">
          <div>
            <p class="section-label">{{ home.publications.label }}</p>
            <h1>{{ home.publications.title }}</h1>
            <p class="muted">{{ home.publications.subtitle }}</p>
          </div>
          <a class="btn btn-secondary" routerLink="/admission">Start Admission</a>
        </section>

        <section class="panel section-block">
          <div class="section-head">
            <div>
              <p class="section-title">Question Bank</p>
            </div>
          </div>

          @if (questionBankDocuments(home).length) {
            <div class="documents-grid">
              @for (card of questionBankDocuments(home); track card.href) {
                <article class="document-card">
                  <span class="document-badge">PDF</span>
                  <h3>{{ card.title }}</h3>
                  @if (card.description) {
                    <p class="muted">{{ card.description }}</p>
                  }
                  <a
                    class="inline-link"
                    [href]="card.href"
                    [attr.target]="shouldOpenInNewTab(card.href) ? '_blank' : null"
                    [attr.rel]="shouldOpenInNewTab(card.href) ? 'noopener noreferrer' : null"
                  >
                    {{ card.ctaLabel || 'Open PDF' }}
                  </a>
                </article>
              }
            </div>
          } @else {
            <div class="empty-panel">
              <h3>No question bank PDFs published yet</h3>
            </div>
          }
        </section>

        <section class="panel section-block">
          <div class="section-head">
            <div>
              <p class="section-title">Other Docs</p>
            </div>
          </div>

          <div class="documents-grid">
            @for (card of otherDocuments(home); track card.href) {
              <article class="document-card">
                <span class="document-badge">PDF</span>
                <h3>{{ card.title }}</h3>
                @if (card.description) {
                  <p class="muted">{{ card.description }}</p>
                }
                <a
                  class="inline-link"
                  [href]="card.href"
                  [attr.target]="shouldOpenInNewTab(card.href) ? '_blank' : null"
                  [attr.rel]="shouldOpenInNewTab(card.href) ? 'noopener noreferrer' : null"
                >
                  {{ card.ctaLabel || 'Open PDF' }}
                </a>
              </article>
            }
          </div>
        </section>
      }
    </section>
  `,
  styles: [
    `
      .documents-page {
        display: grid;
        gap: 1.5rem;
      }
      .documents-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 1rem;
        align-items: end;
        padding: clamp(1.5rem, 3vw, 2rem);
        background:
          radial-gradient(circle at top right, rgba(84, 183, 104, 0.18), transparent 34%),
          linear-gradient(135deg, rgba(14, 122, 67, 0.12), rgba(255, 255, 255, 0.96));
      }
      .documents-hero h1 {
        margin: 0.2rem 0 0.6rem;
        font-size: clamp(2rem, 4vw, 3.2rem);
      }
      .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }
      .section-title {
        margin: 0;
        padding-left: 20px;
        font-size: clamp(1.35rem, 2.2vw, 1.8rem);
        font-weight: 400;
        letter-spacing: 0.02em;
        color: var(--ink);
      }
      .document-card {
        display: grid;
        gap: 0.8rem;
        min-height: 240px;
        padding: 1.25rem;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(14, 122, 67, 0.12);
        box-shadow: var(--shadow-sm);
      }
      .document-badge {
        width: fit-content;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        color: white;
        background: linear-gradient(135deg, var(--primary), var(--accent));
      }
      .document-card h3 {
        margin: 0;
      }
      .document-card .inline-link {
        align-self: end;
      }
      .empty-panel {
        padding: 1.4rem;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px dashed rgba(14, 122, 67, 0.2);
      }
      @media (max-width: 720px) {
        .documents-hero {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DocumentsPageComponent {
  private readonly homeContentApi = inject(HomeContentApiService);

  protected readonly content = signal<HomeContentDocument | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    void this.load();
  }

  protected isExternalLink(href: string) {
    return /^https?:\/\//i.test(href);
  }

  protected shouldOpenInNewTab(href: string) {
    return this.isExternalLink(href) || /\.pdf($|\?)/i.test(href);
  }

  protected questionBankDocuments(home: HomeContentDocument) {
    return this.documentCards(home).filter((card) => card.kind === 'question-bank');
  }

  protected otherDocuments(home: HomeContentDocument) {
    return this.documentCards(home).filter((card) => card.kind !== 'question-bank');
  }

  private async load() {
    this.loading.set(true);
    this.error.set('');

    try {
      this.content.set(await this.homeContentApi.getHomeContent());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to load documents.');
    } finally {
      this.loading.set(false);
    }
  }

  private documentCards(home: HomeContentDocument): HomeContentLinkCard[] {
    return home.publications.cards.filter((card) => Boolean(card.kind));
  }
}
