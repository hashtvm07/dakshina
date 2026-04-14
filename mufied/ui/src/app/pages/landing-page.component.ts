import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  HomeContentApiService,
  HomeContentDocument,
  HomeContentEventCard,
  HomeContentEventPdf,
} from '../services/home-content-api.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page landing">
      @if (loading()) {
        <section class="panel status-panel">
          <p class="section-label">Home Content</p>
          <h2>Loading home page content...</h2>
        </section>
      } @else if (error()) {
        <section class="panel status-panel error-panel">
          <p class="section-label">Home Content</p>
          <h2>Unable to load home page content.</h2>
          <p>{{ error() }}</p>
        </section>
      } @else if (content(); as home) {
        <section class="hero panel">
          <img class="hero-banner" [src]="home.hero.bannerImage" alt="MUFIED banner" />
          <div class="hero-overlay"></div>
          <div class="hero-copy">
            <p class="eyebrow">{{ home.hero.eyebrow }}</p>
            <h1 class="hero-title">{{ home.hero.title }}</h1>
            <p>{{ home.hero.subtitle }}</p>
            <div class="hero-actions">
              @if (isRouterLink(home.hero.primaryActionHref)) {
                <a class="btn btn-primary" [routerLink]="home.hero.primaryActionHref">{{ home.hero.primaryActionLabel }}</a>
              } @else {
                <a class="btn btn-primary" [href]="home.hero.primaryActionHref" [attr.target]="shouldOpenInNewTab(home.hero.primaryActionHref) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(home.hero.primaryActionHref) ? 'noopener noreferrer' : null">{{ home.hero.primaryActionLabel }}</a>
              }
              @if (isRouterLink(home.hero.secondaryActionHref)) {
                <a class="btn btn-secondary" [routerLink]="home.hero.secondaryActionHref">{{ home.hero.secondaryActionLabel }}</a>
              } @else {
                <a class="btn btn-secondary" [href]="home.hero.secondaryActionHref" [attr.target]="shouldOpenInNewTab(home.hero.secondaryActionHref) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(home.hero.secondaryActionHref) ? 'noopener noreferrer' : null">{{ home.hero.secondaryActionLabel }}</a>
              }
            </div>
          </div>
          <div class="hero-card">
            <div class="float-card primary">
              <strong>{{ home.hero.floatingCards.primary.title }}</strong>
              @for (item of home.hero.floatingCards.primary.items; track item) {
                <span>{{ item }}</span>
              }
            </div>
            <div class="float-card secondary">
              <strong>{{ home.hero.floatingCards.secondary.title }}</strong>
              @for (item of home.hero.floatingCards.secondary.items; track item) {
                <span>{{ item }}</span>
              }
            </div>
            <div class="hero-badge">{{ home.hero.badgeText }}</div>
          </div>
        </section>

        @if (home.events.cards.length) {
          <section id="events" class="panel section-block events-shell">
            <div class="section-head">
              <p class="section-label">{{ home.events.label }}</p>
              <h2>{{ home.events.title }}</h2>
              <p class="muted">{{ home.events.subtitle }}</p>
            </div>

            <div class="event-grid">
              @for (eventCard of home.events.cards; track trackEvent($index, eventCard); let eventIndex = $index) {
                <article class="event-card" [class.has-image]="hasEventImage(eventCard)" [class.no-image]="!hasEventImage(eventCard)">
                  <div class="event-sheen"></div>

                  <div class="event-media" [class.placeholder]="!hasEventImage(eventCard)">
                    @if (hasEventImage(eventCard)) {
                      <img [src]="eventCard.image" [alt]="eventCard.title || 'Event image'" />
                    } @else {
                      <div class="event-placeholder-copy">
                        <span class="event-placeholder-label">Event Spotlight</span>
                        <strong>{{ eventCard.title || 'Campus Highlight' }}</strong>
                      </div>
                    }
                  </div>

                  <div class="event-body">
                    <div class="event-header">
                      <span class="event-index">Event {{ eventTag(eventIndex) }}</span>
                      <h3>{{ eventCard.title }}</h3>
                    </div>

                    <div class="event-description-grid" [class.single]="eventCard.descriptions.length <= 1" [class.double]="eventCard.descriptions.length === 2" [class.multi]="eventCard.descriptions.length >= 3">
                      @for (description of eventCard.descriptions; track trackDescription($index, description)) {
                        <div class="event-description-card">
                          <p>{{ description }}</p>
                        </div>
                      }
                    </div>

                    @if (eventCard.pdfs.length) {
                      <div class="event-pdf-row">
                        @for (pdf of eventCard.pdfs; track trackEventPdf($index, pdf)) {
                          <button class="event-pdf-link" type="button" (click)="openEventPdfPreview(pdf)">
                            <span class="event-pdf-link__title">{{ pdf.title || 'Event PDF' }}</span>
                            <span class="event-pdf-link__cta">{{ pdf.ctaLabel || 'Preview PDF' }}</span>
                          </button>
                        }
                      </div>
                    }
                  </div>
                </article>
              }
            </div>
          </section>
        }

        <section id="about" class="grid-two intro-shell">
          <article class="panel intro-visual">
            <div class="article-visual-stack">
              <div class="article-text-card">
                <h3>{{ home.article1.section1.title }}</h3>
                <p>{{ home.article1.section1.description }}</p>
              </div>
              <div class="article-text-card">
                <h3>{{ home.article1.section2.title }}</h3>
                <p>{{ home.article1.section2.description }}</p>
              </div>
            </div>
          </article>
          <article class="panel intro-copy">
            <p class="section-label">{{ home.intro.label }}</p>
            <h2>{{ home.intro.title }}</h2>
            <div class="article-section-grid">
              @for (section of articleSections(home); track section.title) {
                <article class="article2-card">
                  <h3>{{ section.title }}</h3>
                  <p>{{ section.description }}</p>
                </article>
              }
            </div>
          </article>
        </section>

        <section id="academics" class="panel section-block">
          <div class="section-head">
            <p class="section-label">{{ home.programmes.label }}</p>
            <h2>{{ home.programmes.title }}</h2>
            <p class="muted">{{ home.programmes.subtitle }}</p>
          </div>
          <div class="grid-three programme-grid">
            @for (card of home.programmes.cards; track card.title; let index = $index) {
              <article class="programme-card" [class.featured]="card.featured">
                <p class="programme-tag">{{ programmeTag(index) }}</p>
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
                @if (isRouterLink(card.href)) {
                  <a class="inline-link" [routerLink]="card.href">{{ card.ctaLabel }}</a>
                } @else {
                  <a class="inline-link" [href]="card.href" [attr.target]="shouldOpenInNewTab(card.href) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(card.href) ? 'noopener noreferrer' : null">{{ card.ctaLabel }}</a>
                }
              </article>
            }
          </div>
        </section>

        <section id="admission-path" class="grid-two">
          <article class="panel detail-card">
            <p class="section-label">{{ home.admission.process.label }}</p>
            <h2>{{ home.admission.process.title }}</h2>
            <ul class="detail-list">
              @for (item of home.admission.process.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
            <div class="cta-row">
              @if (isRouterLink(home.admission.process.primaryActionHref)) {
                <a class="btn btn-primary" [routerLink]="home.admission.process.primaryActionHref">{{ home.admission.process.primaryActionLabel }}</a>
              } @else {
                <a class="btn btn-primary" [href]="home.admission.process.primaryActionHref" [attr.target]="shouldOpenInNewTab(home.admission.process.primaryActionHref) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(home.admission.process.primaryActionHref) ? 'noopener noreferrer' : null">{{ home.admission.process.primaryActionLabel }}</a>
              }
              @if (isRouterLink(home.admission.process.secondaryActionHref)) {
                <a class="btn btn-secondary" [routerLink]="home.admission.process.secondaryActionHref">{{ home.admission.process.secondaryActionLabel }}</a>
              } @else {
                <a class="btn btn-secondary" [href]="home.admission.process.secondaryActionHref" [attr.target]="shouldOpenInNewTab(home.admission.process.secondaryActionHref) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(home.admission.process.secondaryActionHref) ? 'noopener noreferrer' : null">{{ home.admission.process.secondaryActionLabel }}</a>
              }
            </div>
          </article>
          <article id="campus" class="panel detail-card accent-card">
            <p class="section-label">{{ home.admission.campus.label }}</p>
            <h2>{{ home.admission.campus.title }}</h2>
            <p>{{ home.admission.campus.paragraph1 }}</p>
            <p>{{ home.admission.campus.paragraph2 }}</p>
          </article>
        </section>

        <section id="documents" class="panel section-block">
          <div class="section-head">
            <p class="section-label">{{ home.publications.label }}</p>
            <h2>{{ home.publications.title }}</h2>
            <p class="muted">{{ home.publications.subtitle }}</p>
          </div>
          <div class="grid-three publication-grid">
            @for (card of publicationCards(home); track card.title) {
              <article class="publication-card">
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
                @if (isRouterLink(card.href)) {
                  <a class="inline-link" [routerLink]="card.href">{{ card.ctaLabel }}</a>
                } @else {
                  <a class="inline-link" [href]="card.href" [attr.target]="shouldOpenInNewTab(card.href) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(card.href) ? 'noopener noreferrer' : null">{{ card.ctaLabel }}</a>
                }
              </article>
            }
          </div>
        </section>

        <section id="contact" class="panel footer-block">
          <div class="footer-brand">
            <img [src]="home.footer.logoImage" alt="MUFIED logo" />
            <div>
              <p class="section-label">{{ home.footer.label }}</p>
              <h2>{{ home.footer.title }}</h2>
            </div>
          </div>
          <div class="grid-three footer-grid">
            @for (card of home.footer.cards; track card.title) {
              <div>
                <h3>{{ card.title }}</h3>
                <p class="muted">{{ card.description }}</p>
                @if (card.links?.length) {
                  <p class="muted quick-links">
                    @for (link of card.links; track link.label; let last = $last) {
                      @if (isRouterLink(link.href)) {
                        <a class="inline-link" [routerLink]="link.href">{{ link.label }}</a>
                      } @else {
                        <a class="inline-link" [href]="link.href" [attr.target]="shouldOpenInNewTab(link.href) ? '_blank' : null" [attr.rel]="shouldOpenInNewTab(link.href) ? 'noopener noreferrer' : null">{{ link.label }}</a>
                      }
                      @if (!last) { <span> | </span> }
                    }
                  </p>
                }
              </div>
            }
          </div>
        </section>
      }
    </section>

    @if (activeEventPdf(); as preview) {
      <div class="pdf-preview-backdrop" (click)="closeEventPdfPreview()"></div>
      <section class="pdf-preview-modal panel" (click)="$event.stopPropagation()">
        <div class="pdf-preview-head">
          <div>
            <p class="section-label">Event PDF</p>
            <h3>{{ preview.title }}</h3>
          </div>
          <div class="pdf-preview-actions">
            <a class="btn btn-secondary" [href]="preview.href" target="_blank" rel="noopener noreferrer" download>Download PDF</a>
            <button class="btn btn-primary" type="button" (click)="closeEventPdfPreview()">Close</button>
          </div>
        </div>

        <div class="pdf-preview-frame">
          <iframe [src]="activeEventPdfUrl()" [title]="preview.title"></iframe>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .landing {
        gap: 1.75rem;
      }
      .status-panel {
        padding: 2rem;
      }
      .error-panel {
        border: 1px solid rgba(178, 34, 34, 0.25);
      }
      .hero {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
        gap: 1.5rem;
        overflow: hidden;
        min-height: 520px;
        padding: clamp(1.25rem, 2vw, 1.5rem);
      }
      .hero-banner,
      .hero-overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .hero-banner {
        object-fit: cover;
      }
      .hero-overlay {
        background:
          linear-gradient(90deg, rgba(6, 38, 22, 0.84), rgba(6, 38, 22, 0.35) 56%, rgba(255, 255, 255, 0.08)),
          linear-gradient(180deg, rgba(7, 83, 45, 0.15), rgba(7, 83, 45, 0.6));
      }
      .hero::after {
        content: '';
        position: absolute;
        inset: auto -8% -30% auto;
        width: 280px;
        height: 280px;
        background: radial-gradient(circle, rgba(84, 183, 104, 0.25), transparent 70%);
      }
      .hero-copy,
      .hero-card {
        position: relative;
        z-index: 1;
      }
      .hero-copy {
        display: grid;
        align-content: end;
        gap: 1rem;
        padding: clamp(1.1rem, 3vw, 2.6rem);
        color: white;
      }
      .footer-brand img {
        width: 92px;
        height: 92px;
        object-fit: cover;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.2);
      }
      .eyebrow,
      .section-label {
        margin: 0;
        font-size: 0.8rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 800;
      }
      .hero-title,
      h2 {
        margin: 0;
      }
      .hero-title {
        font-size: clamp(2.3rem, 4vw, 4.6rem);
        line-height: 0.98;
      }
      .hero-copy p:last-of-type {
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.88);
        max-width: 58ch;
      }
      .hero-actions,
      .cta-row,
      .pdf-preview-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }
      .hero-card {
        position: relative;
        align-self: end;
        min-height: 320px;
        background: transparent;
        border-radius: 26px;
        border: 0;
        box-shadow: none;
        backdrop-filter: none;
        transform: translateY(-100px);
      }
      .float-card,
      .hero-badge {
        position: absolute;
        border-radius: 24px;
        box-shadow: 0 20px 45px rgba(8, 28, 18, 0.14);
        animation: float 5s ease-in-out infinite;
      }
      .float-card {
        display: grid;
        gap: 0.45rem;
        padding: 1.3rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(223, 248, 227, 0.9));
        border: 1px solid rgba(14, 122, 67, 0.1);
      }
      .float-card strong {
        color: #0b4025;
      }
      .float-card span {
        color: #24543a;
      }
      .float-card.primary {
        top: 1rem;
        right: 1rem;
        width: 72%;
        transform: rotateY(-16deg) rotateX(8deg);
      }
      .float-card.secondary {
        bottom: -2.5rem;
        left: 0;
        width: 78%;
        animation-delay: 0.4s;
        transform: rotateY(12deg) rotateX(-6deg);
      }
      .hero-badge {
        left: 1.2rem;
        top: 1.2rem;
        padding: 0.85rem 1rem;
        background: linear-gradient(135deg, #064324, #0d5a34);
        color: #fff;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      @keyframes float {
        0%,
        100% {
          translate: 0 0;
        }
        50% {
          translate: 0 -12px;
        }
      }
      .intro-shell,
      .section-block,
      .footer-block {
        padding: clamp(1.1rem, 2vw, 1.5rem);
      }
      .intro-shell {
        align-items: stretch;
      }
      .intro-visual {
        align-self: stretch;
      }
      .article-visual-stack {
        display: grid;
        gap: 1rem;
        height: 100%;
      }
      .intro-copy,
      .detail-card {
        display: grid;
        gap: 1rem;
      }
      .intro-copy {
        align-content: start;
        padding-top: 10px;
        padding-left: 10px;
        gap: 0.5rem;
      }
      .intro-copy .section-label {
        margin-bottom: 0;
      }
      .intro-copy h2 {
        margin-top: 20px;
        margin-bottom: 20px;
        line-height: 1.1;
      }
      .article-section-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }
      .article-text-card,
      .article2-card {
        display: grid;
        gap: 1rem;
        padding: 1rem 1.05rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(13, 90, 52, 0.08);
        align-content: start;
      }
      .article-text-card {
        min-height: 0;
        height: 100%;
      }
      .article-text-card h3,
      .article2-card h3,
      .article-text-card p,
      .article2-card p {
        margin: 0;
      }
      .article-text-card h3,
      .article2-card h3 {
        color: #0d5a34;
      }
      .programme-card,
      .publication-card,
      .detail-card,
      .footer-grid > div {
        border-radius: 20px;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.74);
      }
      .section-head {
        display: grid;
        gap: 0.85rem;
        margin-bottom: 1rem;
      }
      .programme-card.featured,
      .accent-card {
        background: linear-gradient(180deg, rgba(12, 94, 53, 0.12), rgba(255, 255, 255, 0.92));
      }
      .programme-tag {
        margin: 0 0 0.4rem;
        font-size: 0.8rem;
        font-weight: 700;
        color: #0d5a34;
      }
      .detail-list {
        margin: 0;
        padding-left: 1.1rem;
        display: grid;
        gap: 0.65rem;
      }
      .footer-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.2rem;
      }
      .quick-links {
        display: flex;
        flex-wrap: wrap;
      }
      .btn,
      .inline-link {
        text-decoration: none;
      }
      .inline-link {
        color: #0d5a34;
        font-weight: 700;
      }
      .events-shell {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at top right, rgba(248, 196, 94, 0.18), transparent 28%),
          linear-gradient(180deg, rgba(8, 48, 29, 0.04), rgba(255, 255, 255, 0.92));
      }
      .event-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.25rem;
      }
      .event-card {
        position: relative;
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border-radius: 28px;
        overflow: hidden;
        border: 1px solid rgba(13, 90, 52, 0.12);
        background:
          linear-gradient(160deg, rgba(255, 255, 255, 0.98), rgba(232, 247, 237, 0.92) 55%, rgba(215, 235, 255, 0.88)),
          #ffffff;
        box-shadow:
          0 30px 50px rgba(7, 37, 23, 0.14),
          inset 0 1px 0 rgba(255, 255, 255, 0.7);
        transform-style: preserve-3d;
        animation: eventLift 6s ease-in-out infinite;
      }
      .event-sheen {
        position: absolute;
        inset: 0 auto auto 0;
        width: 70%;
        height: 70%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), transparent 70%);
        pointer-events: none;
      }
      .event-media {
        position: relative;
        min-height: 220px;
        border-radius: 24px;
        overflow: hidden;
        transform: translateZ(20px) rotateX(2deg);
        box-shadow:
          0 24px 40px rgba(6, 34, 21, 0.18),
          inset 0 0 0 1px rgba(255, 255, 255, 0.35);
      }
      .event-media img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 220px;
        object-fit: cover;
        transition: transform 220ms ease;
        filter: saturate(1.05) contrast(1.02);
      }
      .event-card:hover .event-media img {
        transform: scale(1.04);
      }
      .event-media.placeholder {
        display: grid;
        place-items: end start;
        padding: 1.25rem;
        background:
          radial-gradient(circle at top right, rgba(255, 255, 255, 0.45), transparent 38%),
          linear-gradient(135deg, #0d5a34, #0d7b4c 55%, #eb9b42);
      }
      .event-placeholder-copy {
        display: grid;
        gap: 0.55rem;
        color: white;
      }
      .event-placeholder-label,
      .event-index {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .event-placeholder-copy strong {
        font-size: clamp(1.4rem, 2vw, 2rem);
        line-height: 1.05;
      }
      .event-body,
      .event-header {
        display: grid;
        gap: 0.8rem;
      }
      .event-header h3,
      .event-description-card p {
        margin: 0;
      }
      .event-header h3 {
        color: #0a4025;
      }
      .event-index {
        color: #0e6b40;
      }
      .event-description-grid {
        display: grid;
        gap: 0.75rem;
      }
      .event-description-grid.single {
        grid-template-columns: 1fr;
      }
      .event-description-grid.double {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .event-description-grid.multi {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .event-description-card {
        padding: 0.95rem 1rem;
        border-radius: 20px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(241, 249, 244, 0.9)),
          white;
        border: 1px solid rgba(13, 90, 52, 0.08);
        box-shadow:
          0 16px 30px rgba(9, 31, 18, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.85);
      }
      .event-pdf-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }
      .event-pdf-link {
        display: grid;
        gap: 0.35rem;
        min-width: min(100%, 220px);
        border: 0;
        border-radius: 18px;
        padding: 0.95rem 1rem;
        text-align: left;
        cursor: pointer;
        color: #0b4025;
        background:
          linear-gradient(180deg, #fff7e7, #ffdba9),
          #ffdba9;
        box-shadow:
          0 18px 28px rgba(143, 88, 14, 0.18),
          inset 0 -3px 0 rgba(177, 108, 19, 0.25);
        transform: translateZ(12px);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease;
      }
      .event-pdf-link:hover {
        transform: translateY(-3px) translateZ(12px);
        box-shadow:
          0 24px 34px rgba(143, 88, 14, 0.22),
          inset 0 -3px 0 rgba(177, 108, 19, 0.25);
      }
      .event-pdf-link__title {
        font-weight: 800;
      }
      .event-pdf-link__cta {
        font-size: 0.84rem;
        color: #92521b;
      }
      @keyframes eventLift {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-7px);
        }
      }
      .pdf-preview-backdrop {
        position: fixed;
        inset: 0;
        z-index: 35;
        background: rgba(5, 16, 12, 0.58);
        backdrop-filter: blur(6px);
      }
      .pdf-preview-modal {
        position: fixed;
        inset: 0;
        z-index: 36;
        width: min(50vw, 760px);
        height: min(78vh, 860px);
        margin: auto;
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 1rem;
        padding: 1rem;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(238, 248, 242, 0.95)),
          white;
        box-shadow: 0 30px 60px rgba(3, 14, 11, 0.28);
      }
      .pdf-preview-head {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: start;
      }
      .pdf-preview-head h3 {
        margin: 0.25rem 0 0;
      }
      .pdf-preview-frame {
        min-height: 0;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(13, 90, 52, 0.12);
        background: rgba(255, 255, 255, 0.72);
      }
      .pdf-preview-frame iframe {
        width: 100%;
        height: 100%;
        border: 0;
        background: white;
      }
      @media (max-width: 960px) {
        .hero,
        .grid-two,
        .grid-three,
        .article-section-grid,
        .event-description-grid.double,
        .event-description-grid.multi {
          grid-template-columns: 1fr;
        }
        .hero {
          min-height: unset;
        }
        .hero-card {
          min-height: 280px;
          transform: none;
        }
        .pdf-preview-modal {
          width: min(88vw, 760px);
        }
      }
      @media (max-width: 720px) {
        .event-grid,
        .pdf-preview-actions {
          grid-template-columns: 1fr;
        }
        .event-card {
          padding: 0.9rem;
        }
        .pdf-preview-modal {
          width: calc(100vw - 1.25rem);
          height: calc(100vh - 1.25rem);
        }
        .pdf-preview-head {
          flex-direction: column;
        }
        .pdf-preview-actions {
          display: grid;
          width: 100%;
        }
      }
    `,
  ],
})
export class LandingPageComponent implements OnInit {
  private readonly homeContentApi = inject(HomeContentApiService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly content = signal<HomeContentDocument | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeEventPdf = signal<HomeContentEventPdf | null>(null);
  readonly activeEventPdfUrl = computed<SafeResourceUrl | null>(() => {
    const preview = this.activeEventPdf();
    return preview ? this.sanitizer.bypassSecurityTrustResourceUrl(preview.href) : null;
  });

  async ngOnInit() {
    try {
      this.content.set(await this.homeContentApi.getHomeContent());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unknown home content error.');
    } finally {
      this.loading.set(false);
    }
  }

  isRouterLink(href: string): boolean {
    return href.startsWith('/') && !href.includes('#') && !this.isPdfLink(href) && !this.isAssetPath(href);
  }

  isExternalLink(href: string): boolean {
    return /^https?:\/\//i.test(href);
  }

  shouldOpenInNewTab(href: string): boolean {
    return this.isExternalLink(href) || this.isPdfLink(href);
  }

  programmeTag(index: number): string {
    return `Programme ${String(index + 1).padStart(2, '0')}`;
  }

  eventTag(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  articleSections(home: HomeContentDocument) {
    return [home.article2.section1, home.article2.section2, home.article2.section3, home.article2.section4];
  }

  publicationCards(home: HomeContentDocument) {
    return home.publications.cards.filter((card) => Boolean(card.kind));
  }

  hasEventImage(card: HomeContentEventCard) {
    return Boolean(card.image?.trim());
  }

  openEventPdfPreview(pdf: HomeContentEventPdf) {
    if (!pdf.href) {
      return;
    }

    this.activeEventPdf.set(pdf);
  }

  closeEventPdfPreview() {
    this.activeEventPdf.set(null);
  }

  trackEvent(index: number, eventCard: HomeContentEventCard) {
    return `${index}-${eventCard.title}`;
  }

  trackDescription(index: number, description: string) {
    return `${index}-${description}`;
  }

  trackEventPdf(index: number, pdf: HomeContentEventPdf) {
    return `${index}-${pdf.title}-${pdf.href}`;
  }

  private isPdfLink(href: string): boolean {
    return /\.pdf($|\?)/i.test(href);
  }

  private isAssetPath(href: string): boolean {
    return href.startsWith('/assets/') || href.startsWith('assets/');
  }
}
