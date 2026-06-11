import { Component, inject, signal, OnInit, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { PostSkeletonComponent } from '../../shared/components/post-skeleton/post-skeleton.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { PostResponse } from '../../core/models/post.model';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileResponse } from '../../core/models/profile.model';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterLink,
    PostCardComponent,
    PostSkeletonComponent,
    ButtonComponent,
    InputComponent,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private destroyRef = inject(DestroyRef);

  userPosts = signal<PostResponse[]>([]);
  isLoading = signal(true);
  profileId = signal<string | null>(null);
  profile = signal<ProfileResponse | null>(null);

  // Edit Profile form signals
  showEditModal = signal(false);
  editUsername = signal('');
  editDisplayName = signal('');
  editBio = signal('');
  editAvatarUrl = signal('');
  editBannerUrl = signal('');
  isSaving = signal(false);

  // Username validation signals
  usernameChecking = signal(false);
  usernameAvailable = signal<boolean | null>(null);
  usernameError = signal<string | null>(null);
  private usernameSubject = new Subject<string>();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const authorId = params.get('authorId');
      this.profileId.set(authorId);
      this.loadProfile();
      this.loadPosts();
    });

    this.usernameSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(username => {
        if (!username || username.trim() === '') {
          this.usernameAvailable.set(null);
          this.usernameError.set('Username is required');
          this.usernameChecking.set(false);
          return of(null);
        }
        if (username === this.profile()?.username) {
          this.usernameAvailable.set(true);
          this.usernameError.set(null);
          this.usernameChecking.set(false);
          return of(null);
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
          this.usernameAvailable.set(false);
          this.usernameError.set('Username can only contain letters, numbers, underscores, and hyphens');
          this.usernameChecking.set(false);
          return of(null);
        }
        return this.profileService.getProfile(username).pipe(
          map(p => {
            this.usernameChecking.set(false);
            this.usernameAvailable.set(false);
            this.usernameError.set('Username is already taken');
            return null;
          }),
          catchError(err => {
            this.usernameChecking.set(false);
            if (err.status === 404) {
              this.usernameAvailable.set(true);
              this.usernameError.set(null);
            } else {
              this.usernameAvailable.set(null);
              this.usernameError.set('Error validating username');
            }
            return of(null);
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
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
        next: (prof) => {
          this.profile.set(prof);
          const editParam = this.route.snapshot.queryParamMap.get('edit');
          if (editParam === 'true') {
            this.openEditModal();
          }
        },
        error: (err) => {
          console.error('Failed to load my profile:', err);
          this.profile.set(this.authService.currentUserProfile());
          const editParam = this.route.snapshot.queryParamMap.get('edit');
          if (editParam === 'true') {
            this.openEditModal();
          }
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

  onUsernameChange(val: string) {
    this.editUsername.set(val);
    const trimmed = val.trim();
    if (trimmed === this.profile()?.username) {
      this.usernameChecking.set(false);
      this.usernameAvailable.set(true);
      this.usernameError.set(null);
      return;
    }
    if (trimmed === '') {
      this.usernameChecking.set(false);
      this.usernameAvailable.set(null);
      this.usernameError.set('Username is required');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      this.usernameChecking.set(false);
      this.usernameAvailable.set(false);
      this.usernameError.set('Username can only contain letters, numbers, underscores, and hyphens');
      return;
    }
    
    this.usernameChecking.set(true);
    this.usernameAvailable.set(null);
    this.usernameError.set(null);
    this.usernameSubject.next(trimmed);
  }

  openEditModal() {
    const prof = this.profile();
    if (prof) {
      this.editUsername.set(prof.username || '');
      this.editDisplayName.set(prof.displayName || '');
      this.editBio.set(prof.bio || '');
      this.editAvatarUrl.set(prof.avatarUrl || '');
      this.editBannerUrl.set(prof.bannerUrl || '');
    }
    this.usernameChecking.set(false);
    this.usernameAvailable.set(true);
    this.usernameError.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  saveProfile() {
    if (this.usernameError() || this.usernameChecking() || !this.editUsername().trim()) {
      return;
    }
    this.isSaving.set(true);
    const request = {
      username: this.editUsername().trim(),
      displayName: this.editDisplayName().trim(),
      bio: this.editBio().trim(),
      avatarUrl: this.editAvatarUrl().trim(),
      bannerUrl: this.editBannerUrl().trim()
    };
    
    this.profileService.updateMyProfile(request).subscribe({
      next: (updatedProfile) => {
        this.profile.set(updatedProfile);
        this.authService.updateProfileSignal(updatedProfile);
        this.isSaving.set(false);
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.isSaving.set(false);
        if (err.status === 409) {
          this.usernameError.set('Username is already taken');
          this.usernameAvailable.set(false);
        } else {
          alert('Failed to update profile. Please try again.');
        }
      }
    });
  }
}
