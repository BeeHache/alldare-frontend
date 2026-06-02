import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeedService } from '../../core/services/feed.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { CreatePostComponent } from '../posts/create-post/create-post.component';
import { PostResponse } from '../../core/models/post.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ButtonComponent, PostCardComponent, CreatePostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected authService = inject(AuthService);
  private feedService = inject(FeedService);

  feed = signal<PostResponse[]>([]);
  isFeedLoading = signal(false);

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    if (this.authService.isAuthenticated()) {
      this.isFeedLoading.set(true);
      this.feedService.getSubscriptionFeed().subscribe({
        next: (data) => {
          this.feed.set(data);
          this.isFeedLoading.set(false);
        },
        error: () => {
          this.isFeedLoading.set(false);
        }
      });
    }
  }
}
