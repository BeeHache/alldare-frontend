import { Component, input, signal, computed, inject, ChangeDetectionStrategy, HostListener, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostResponse, PostType } from '../../../core/models/post.model';
import { CardComponent } from '../card/card.component';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-post-card',
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCardComponent {
  private authService = inject(AuthService);
  private postService = inject(PostService);

  postState = signal<PostResponse | null>(null);
  post = input.required<PostResponse>();
  className = input('');
  postDeleted = output<string>();

  isMenuOpen = signal(false);

  resolvedPost = computed(() => this.postState() || this.post());

  isOwner = computed(() => {
    const currentUser = this.authService.user();
    return currentUser && currentUser.id === this.resolvedPost().authorId;
  });

  isEditing = signal(false);
  editText = signal('');
  isUpdating = signal(false);

  protected readonly PostType = PostType;

  startEditing() {
    const content = this.resolvedPost().content;
    this.editText.set(content['text'] || '');
    this.isEditing.set(true);
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.closeMenu();
  }

  deletePost() {
    const postVal = this.resolvedPost();
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postVal.id).subscribe({
        next: () => {
          this.postDeleted.emit(postVal.id);
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
        }
      });
    }
  }

  saveEdit() {
    if (this.isUpdating()) return;

    this.isUpdating.set(true);
    const postVal = this.resolvedPost();
    const updatedContent = { ...postVal.content, text: this.editText() };

    const updateRequest = {
      authorId: postVal.authorId,
      postType: postVal.postType,
      content: updatedContent,
      publishedAt: postVal.publishedAt
    };

    this.postService.updatePost(postVal.id, updateRequest).subscribe({
      next: (updatedPost) => {
        this.postState.set(updatedPost);
        this.isEditing.set(false);
        this.isUpdating.set(false);
      },
      error: () => {
        this.isUpdating.set(false);
      }
    });
  }
}
