import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostRequest, PostResponse } from '../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);

  createPost(request: PostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>('/api/v1/posts', request);
  }

  getPost(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`/api/v1/posts/${id}`);
  }
}
