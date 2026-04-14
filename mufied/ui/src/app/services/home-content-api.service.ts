import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface HomeContentStat {
  value: string;
  label: string;
}

export type HomeContentDocumentKind = 'question-bank' | 'other-docs';

export interface HomeContentLinkCard {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  kind?: HomeContentDocumentKind;
  featured?: boolean;
}

export interface HomeContentEventPdf {
  title: string;
  href: string;
  ctaLabel: string;
}

export interface HomeContentEventCard {
  title: string;
  descriptions: string[];
  image: string;
  pdfs: HomeContentEventPdf[];
}

export interface HomeContentFooterCard {
  title: string;
  description: string;
  links?: {
    label: string;
    href: string;
  }[];
}

export interface HomeContentArticleSection {
  title: string;
  description: string;
}

export interface HallTicketSettings {
  title1: string;
  title2: string;
  footerLine1: string;
  footerLine2: string;
  footerLine3: string;
  footerLine4: string;
  footerLine5: string;
}

export interface HomeContentDocument {
  hero: {
    bannerImage: string;
    logoImage: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryActionLabel: string;
    primaryActionHref: string;
    secondaryActionLabel: string;
    secondaryActionHref: string;
    badgeText: string;
    floatingCards: {
      primary: {
        title: string;
        items: string[];
      };
      secondary: {
        title: string;
        items: string[];
      };
    };
  };
  intro: {
    image: string;
    label: string;
    title: string;
    paragraphs: string[];
    stats: HomeContentStat[];
  };
  article1: {
    section1: HomeContentArticleSection;
    section2: HomeContentArticleSection;
  };
  article2: {
    section1: HomeContentArticleSection;
    section2: HomeContentArticleSection;
    section3: HomeContentArticleSection;
    section4: HomeContentArticleSection;
  };
  programmes: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentLinkCard[];
  };
  events: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentEventCard[];
  };
  admission: {
    process: {
      label: string;
      title: string;
      items: string[];
      primaryActionLabel: string;
      primaryActionHref: string;
      secondaryActionLabel: string;
      secondaryActionHref: string;
    };
    campus: {
      label: string;
      title: string;
      paragraph1: string;
      paragraph2: string;
      authorityEmail: string;
    };
  };
  publications: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentLinkCard[];
  };
  hallTicket: HallTicketSettings;
  footer: {
    logoImage: string;
    label: string;
    title: string;
    cards: HomeContentFooterCard[];
  };
}

@Injectable({ providedIn: 'root' })
export class HomeContentApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  getHomeContent() {
    return firstValueFrom(this.http.get<HomeContentDocument>(this.apiConfig.url('homeContent'))).then((content) =>
      this.normalizeHomeContent(content),
    );
  }

  private normalizeHomeContent(content: HomeContentDocument): HomeContentDocument {
    const hero = content.hero as HomeContentDocument['hero'] & {
      floatingItems?: string[];
      card?: {
        kicker?: string;
        points?: string[];
        body?: string;
      };
    };

    return {
      ...content,
      hero: {
        bannerImage: this.normalizeAssetPath(hero.bannerImage),
        logoImage: this.normalizeAssetPath(hero.logoImage),
        eyebrow: hero.eyebrow,
        title: hero.title,
        subtitle: hero.subtitle,
        primaryActionLabel: hero.primaryActionLabel,
        primaryActionHref: hero.primaryActionHref,
        secondaryActionLabel: hero.secondaryActionLabel,
        secondaryActionHref: hero.secondaryActionHref,
        badgeText: hero.badgeText ?? hero.card?.kicker ?? '2026 Intake',
        floatingCards: {
          primary: {
            title: hero.floatingCards?.primary?.title ?? hero.card?.points?.[0] ?? 'MUFIED Admission',
            items: hero.floatingCards?.primary?.items ?? hero.floatingItems ?? [],
          },
          secondary: {
            title: hero.floatingCards?.secondary?.title ?? hero.card?.points?.[1] ?? 'Official Schema',
            items:
              hero.floatingCards?.secondary?.items ??
              [hero.card?.body ?? hero.card?.points?.[2] ?? ''],
          },
        },
      },
      intro: {
        ...content.intro,
        image: this.normalizeAssetPath(content.intro.image),
      },
      article1: {
        section1: content.article1?.section1 ?? {
          title: 'വിദ്യാഭ്യാസ ദൗത്യം',
          description: '',
        },
        section2: content.article1?.section2 ?? {
          title: 'പഠന പരിസരം',
          description: '',
        },
      },
      article2: {
        section1: content.article2?.section1 ?? {
          title: 'ആമുഖം',
          description: '',
        },
        section2: content.article2?.section2 ?? {
          title: 'മുഫീദ് കോഴ്സ്',
          description: '',
        },
        section3: content.article2?.section3 ?? {
          title: 'ലക്ഷ്യം',
          description: '',
        },
        section4: content.article2?.section4 ?? {
          title: 'പി.ജി. കോഴ്സ്',
          description: '',
        },
      },
      publications: {
        ...content.publications,
        cards: content.publications.cards.map((card) => ({
          ...card,
          kind: this.inferDocumentKind(card),
          href: this.normalizePublicationHref(card),
        })),
      },
      events: {
        label: content.events?.label ?? 'Featured Events',
        title: content.events?.title ?? 'Campus events, launches, and public notices',
        subtitle:
          content.events?.subtitle ??
          'Add visually rich event cards from the admin portal with optional image highlights, stacked descriptions, and downloadable PDFs.',
        cards: (content.events?.cards ?? []).map((card) => ({
          title: card.title ?? '',
          descriptions: Array.isArray(card.descriptions) ? card.descriptions : [],
          image: this.normalizeAssetPath(card.image ?? ''),
          pdfs: (card.pdfs ?? []).map((pdf) => ({
            title: pdf.title ?? '',
            href: this.normalizeAssetPath(pdf.href ?? ''),
            ctaLabel: pdf.ctaLabel ?? 'Preview PDF',
          })),
        })),
      },
      hallTicket: {
        title1: content.hallTicket?.title1 ?? 'Jamia Mannaniyya Islamic University, Varkala',
        title2: content.hallTicket?.title2 ?? 'Mannaniyya Unified Faculty of Integrated Education',
        footerLine1:
          content.hallTicket?.footerLine1 ??
          'Mannaniyya Unified Faculty of Integrated Education Department',
        footerLine2:
          content.hallTicket?.footerLine2 ??
          'Mannaniyya Umarul Farooq Campus, Kilikolloor, Kollam-4',
        footerLine3:
          content.hallTicket?.footerLine3 ??
          'Ph: 04742733868, Mob: 9447724432, 9895833868',
        footerLine4:
          content.hallTicket?.footerLine4 ?? 'mufied313@gmail.com, www.mufied.in/admin-ui',
        footerLine5:
          content.hallTicket?.footerLine5 ??
          'Cource Recognized by: Jamia Mannaniyya Islamic University, Varkkala',
      },
      admission: {
        ...content.admission,
        campus: {
          ...content.admission.campus,
          authorityEmail: content.admission?.campus?.authorityEmail ?? 'admissions@mufied.in',
        },
      },
      footer: {
        ...content.footer,
        logoImage: this.normalizeAssetPath(content.footer.logoImage),
      },
    };
  }

  private normalizeAssetPath(path: string): string {
    if (!path) {
      return '';
    }

    if (path === '/assets/images/brochure-front.pdf') {
      return '/assets/brochure-front.pdf';
    }

    if (path === '/assets/images/brochure-back.pdf') {
      return '/assets/brochure-back.pdf';
    }

    if (path.startsWith('/assets/') || !path.startsWith('assets/')) {
      return path;
    }

    return `/${path}`;
  }

  private normalizePublicationHref(card: HomeContentLinkCard): string {
    const normalizedHref = this.normalizeAssetPath(card.href);
    if (normalizedHref) {
      return normalizedHref;
    }

    const kind = this.inferDocumentKind(card);
    if (kind === 'question-bank') {
      return '/assets/qn-bank/EXAM-2K26.pdf';
    }

    if (kind === 'other-docs') {
      return '/assets/brochure-front.pdf';
    }

    return '';
  }

  private inferDocumentKind(card: HomeContentLinkCard): HomeContentDocumentKind | undefined {
    if (card.kind) {
      return card.kind;
    }

    if (!this.isPdfCard(card)) {
      return undefined;
    }

    return /\/qn-bank\//i.test(card.href) ? 'question-bank' : 'other-docs';
  }

  private isPdfCard(card: HomeContentLinkCard): boolean {
    const href = card.href ?? '';
    const ctaLabel = card.ctaLabel ?? '';
    return /\.pdf($|\?)/i.test(href) || ctaLabel.toLowerCase().includes('pdf');
  }
}
