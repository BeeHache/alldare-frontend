import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Account } from '../models/account.model';
import { RegisterRequest, LoginResponse } from '../models/auth.model';
import { tap, Observable, switchMap, map } from 'rxjs';

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
  isStaff = computed(() => {
    const user = this._user();
    if (!user) return false;
    return user.roles.some(role => {
      const roleName = typeof role === 'string' ? role : role.name;
      return ['ADMIN', 'MOD', 'MODERATOR'].includes(roleName.toUpperCase());
    });
  });

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

  login(data: RegisterRequest): Observable<Account> {
    return this.http.post<LoginResponse>('/api/v1/auth/login', data).pipe(
      switchMap(res => this.setSession(res.accessToken))
    );
  }

  fetchMe(): Observable<Account> {
    return this.http.get<Account>('/api/v1/auth/me').pipe(
      tap(user => this._user.set(user))
    );
  }

  setSession(token: string): Observable<Account> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this._token.set(token);
    return this.fetchMe();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this._token.set(null);
    this._user.set(null);
  }

  getGoogleSsoUrl(): string {
    // This initiates the OIDC flow where alldare-auth acts as a client to Google
    return `/oauth2/authorization/google`;
  }

  getGithubSsoUrl(): string {
    // This initiates the OAuth2 flow where alldare-auth acts as a client to GitHub
    return `/oauth2/authorization/github`;
  }

  // --- Admin API ---
  
  getUsers(page = 0, size = 20): Observable<any> {
    return this.http.get<any>(`/api/v1/admin/users?page=${page}&size=${size}`);
  }

  updateUserStatus(id: string, status: string): Observable<Account> {
    return this.http.patch<Account>(`/api/v1/admin/users/${id}/status`, { status });
  }
}
