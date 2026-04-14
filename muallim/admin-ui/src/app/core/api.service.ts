import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  get<T>(key: string, params?: Record<string, string>) {
    return this.http.get<T>(this.buildUrl(key), { params });
  }

  post<T>(key: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(key), body);
  }

  put<T>(key: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(key), body);
  }

  delete<T>(key: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(key));
  }

  byPath<T>(path: string) {
    const config = this.runtimeConfig.getConfig();
    return this.http.get<T>(`${config.apiBaseUrl}${path}`);
  }

  putByPath<T>(path: string, body: unknown) {
    const config = this.runtimeConfig.getConfig();
    return this.http.put<T>(`${config.apiBaseUrl}${path}`, body);
  }

  deleteByPath<T>(path: string) {
    const config = this.runtimeConfig.getConfig();
    return this.http.delete<T>(`${config.apiBaseUrl}${path}`);
  }

  postByPath<T>(path: string, body: unknown) {
    const config = this.runtimeConfig.getConfig();
    return this.http.post<T>(`${config.apiBaseUrl}${path}`, body);
  }

  private buildUrl(key: string) {
    const config = this.runtimeConfig.getConfig();
    const endpoint = config.endpoints[key];

    if (!endpoint) {
      throw new Error(`Missing endpoint configuration for ${key}`);
    }

    return `${config.apiBaseUrl}${endpoint}`;
  }
}
