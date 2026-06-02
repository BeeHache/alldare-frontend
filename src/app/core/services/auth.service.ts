import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Account } from '../models/account.model';
import { RegisterRequest, RegisterResponse, LoginResponse } from '../models/auth.model';
import { tap, catchError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  // State using Signals
  private _user = signal<Account | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal<boolean>(true);

  // Computed properties
  user = computed(() => this._user());
  token = computed(() => this._token());
  isLoading = computed(() => this._isLoading());
  isAuthenticated = computed(() => !!this._token());

  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    this.initAuth();
  }

  private initAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      if (savedToken) {
        this._token.set(savedToken);
        this.fetchMe().subscribe({
          next: () => this._isLoading.set(false),
          error: () => {
            this.logout();
            this._isLoading.set(false);
          }
        });
      } else {
        this._isLoading.set(false);
      }
    } else {
      this._isLoading.set(false);
    }
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/v1/auth/register', data);
  }

  login(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/v1/auth/login', data).pipe(
      tap(res => {
        this.setSession(res.accessToken);
      })
    );
  }

  fetchMe(): Observable<Account> {
    return this.http.get<Account>('/api/v1/auth/me').pipe(
      tap(user => this._user.set(user))
    );
  }

  setSession(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this._token.set(token);
    this.fetchMe().subscribe();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this._token.set(null);
    this._user.set(null);
  }

  getSsoUrl(): string {
    const clientId = "alldare-web";
    const redirectUri = window.location.origin + "/api/auth/callback/alldare";
    const state = Math.random().toString(36).substring(7);
    // Note: In production, we'd want to store 'state' and verify it in the callback
    return `/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile&state=${state}`;
  }

  getGoogleSsoUrl(): string {
    // This initiates the OIDC flow where alldare-auth acts as a client to Google
    return `/oauth2/authorization/google`;
  }

  exchangeCodeForToken(code: string): Observable<LoginResponse> {
    const redirectUri = window.location.origin + "/api/auth/callback/alldare";
    const params = {
      grant_type: 'authorization_code',
      code: code,
      client_id: 'alldare-web',
      redirect_uri: redirectUri
    };

    // Note: backend expects x-www-form-urlencoded for standard OAuth2 token endpoint
    const body = new URLSearchParams(params).toString();
    
    return this.http.post<LoginResponse>('/oauth2/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        const token = res.accessToken || res.access_token;
        if (token) {
          this.setSession(token);
        }
      })
    );
  }
}
