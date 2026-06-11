import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserMediaResponse } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private http = inject(HttpClient);

  getMyMedia(): Observable<UserMediaResponse[]> {
    return this.http.get<UserMediaResponse[]>('/api/v1/storage/my-media');
  }

  getPresignedUrl(authorId: string, extension: string, contentType: string, isPublic: boolean): Observable<{ uploadUrl: string, fileName: string }> {
    return this.http.get<{ uploadUrl: string, fileName: string }>(`/api/v1/storage/presigned-url`, {
      params: {
        authorId,
        extension,
        contentType,
        isPublic: String(isPublic)
      }
    });
  }

  uploadFileDirect(uploadUrl: string, file: File): Observable<HttpEvent<any>> {
    const req = new HttpRequest('PUT', uploadUrl, file, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  updateVisibility(id: string, worldRead: boolean): Observable<any> {
    return this.http.patch<any>(`/api/v1/storage/metadata/${id}`, { worldRead });
  }

  deleteFile(fileName: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/storage/${fileName}`);
  }
}
