import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostResponse } from '../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private http = inject(HttpClient);

  getSubscriptionFeed(start = 0, end = 19): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`/api/v1/feeds/me?start=${start}&end=${end}`);
  }

  getPosts(page = 0): Observable<any[]> {
    return this.http.get<any[]>(`/api/v1/posts?page=${page}`);
  }
}
