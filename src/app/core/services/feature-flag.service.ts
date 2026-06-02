import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UnleashClient } from 'unleash-proxy-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  
  private client?: UnleashClient;
  
  // State using Signals
  private _flags = signal<Record<string, boolean>>({});
  private _isReady = signal<boolean>(false);

  // Computed properties
  isReady = computed(() => this._isReady());

  constructor() {
    this.initUnleash();
  }

  private initUnleash() {
    if (isPlatformBrowser(this.platformId)) {
      this.client = new UnleashClient({
        url: window.location.origin + '/api/frontend',
        clientKey: 'proxy-secret', // Matches UNLEASH_PROXY_SECRETS in docker-compose
        appName: 'alldare-web',
        refreshInterval: 15,
      });

      this.client.on('ready', () => {
        this.updateFlags();
        this._isReady.set(true);
      });

      this.client.on('update', () => {
        this.updateFlags();
      });

      // Pass user context for targeting
      const user = this.authService.user();
      if (user) {
        this.client.updateContext({ userId: user.id });
      }

      this.client.start();
    }
  }

  private updateFlags() {
    if (this.client) {
      // In a real app, you might want to fetch all toggles
      // unleash-proxy-client doesn't expose a 'getAllToggles' easily 
      // so we might need to track specific keys or use the internal state
      // For now, we'll implement a reactive check
    }
  }

  isEnabled(flagName: string): boolean {
    return this.client?.isEnabled(flagName) || false;
  }
}
