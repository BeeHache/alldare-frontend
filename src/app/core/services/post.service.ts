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

  getMyPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>('/api/v1/posts/me');
  }

  getUserPosts(authorId: string): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`/api/v1/posts?authorId=${authorId}`);
  }

  updatePost(id: string, request: PostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`/api/v1/posts/${id}`, request);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/posts/${id}`);
  }
}
