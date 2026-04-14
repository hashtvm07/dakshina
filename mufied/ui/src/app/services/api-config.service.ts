import { Injectable } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  endpoints: Record<string, string>;
}

@Injectable()
export class ApiConfigService {
  private config: ApiConfig | null = null;

  async load(): Promise<void> {
    const response = await fetch('/assets/apis.json');
    this.config = await response.json();
  }

  url(key: string): string {
    if (!this.config) {
      throw new Error('API configuration has not been loaded.');
    }

    const endpoint = this.config.endpoints[key];
    if (!endpoint) {
      throw new Error(`Endpoint "${key}" is missing in assets/apis.json.`);
    }

    return `${this.config.baseUrl}${endpoint}`;
  }
}
