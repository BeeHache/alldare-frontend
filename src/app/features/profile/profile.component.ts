import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { PostSkeletonComponent } from '../../shared/components/post-skeleton/post-skeleton.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PostResponse } from '../../core/models/post.model';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileResponse } from '../../core/models/profile.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, PostCardComponent, PostSkeletonComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  private profileService = inject(ProfileService);

  userPosts = signal<PostResponse[]>([]);
  isLoading = signal(true);
  profileId = signal<string | null>(null);
  profile = signal<ProfileResponse | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const authorId = params.get('authorId');
      this.profileId.set(authorId);
      this.loadProfile();
      this.loadPosts();
    });
  }

  loadProfile() {
    const authorId = this.profileId();
    if (authorId) {
      this.profileService.getProfileById(authorId).subscribe({
        next: (prof) => this.profile.set(prof),
        error: (err) => {
          console.error('Failed to load profile:', err);
          this.profile.set(null);
        }
      });
    } else {
      this.profileService.getMyProfile().subscribe({
        next: (prof) => this.profile.set(prof),
        error: (err) => {
          console.error('Failed to load my profile:', err);
          this.profile.set(this.authService.currentUserProfile());
        }
      });
    }
  }

  loadPosts() {
    this.isLoading.set(true);
    const authorId = this.profileId();

    const postsObservable$ = authorId
      ? this.postService.getUserPosts(authorId)
      : this.postService.getMyPosts();

    postsObservable$.subscribe({
      next: (posts) => {
        this.userPosts.set(posts);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onPostDeleted(postId: string) {
    this.userPosts.update(posts => posts.filter(p => p.id !== postId));
  }
}
