import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  apiBaseUrl: string;
  endpoints: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private config?: RuntimeConfig;

  async load() {
    this.config = await firstValueFrom(this.http.get<RuntimeConfig>('assets/config.json'));
  }

  getConfig() {
    if (!this.config) {
      throw new Error('Runtime config is not loaded');
    }

    return this.config;
  }
}
