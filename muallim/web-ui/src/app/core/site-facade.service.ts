import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface SitePayload {
  settings: {
    registerEnabled: boolean;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroImageUrl: string;
    bannerImageUrl: string;
    aboutTitle: string;
    aboutBody: string;
  };
  blocks: Array<{ id: number; title: string; body: string; imageUrl?: string; sortOrder: number }>;
  media: Array<{ id: number; title: string; imageUrl: string; category: string }>;
}

@Injectable({ providedIn: 'root' })
export class SiteFacadeService {
  private readonly api = inject(ApiService);
  private readonly sitePayloadSubject = new BehaviorSubject<SitePayload | null>(null);

  readonly sitePayload$ = this.sitePayloadSubject.asObservable();

  loadSite() {
    return this.api
      .get<SitePayload>('sitePublic')
      .pipe(tap((payload) => this.sitePayloadSubject.next(payload)));
  }
}
