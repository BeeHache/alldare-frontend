import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>('/api/v1/profiles/me');
  }

  getProfile(username: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`/api/v1/profiles/${username}`);
  }

  getProfileById(id: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`/api/v1/profiles/id/${id}`);
  }
}
