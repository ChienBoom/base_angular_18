import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppConfig {
    useSSO: boolean;
    enableMessages: boolean;
    enableChats: boolean;
    enableShortcuts: boolean;
    enableNotifications: boolean;
    enableSearchs: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | undefined;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/configs/config.json');
  }

  setConfig(config: AppConfig) {
    this.config = config;
  }

  getConfig(): AppConfig | undefined {
    return this.config;
  }
}
