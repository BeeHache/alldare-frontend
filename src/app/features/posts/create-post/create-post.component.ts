import { Component, inject, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostType } from '../../../core/models/post.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, CardComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  protected authService = inject(AuthService);

  postCreated = output<void>();

  isLoading = signal(false);
  error = signal('');

  postForm = this.fb.group({
    text: ['', [Validators.required, Validators.maxLength(500)]]
  });

  onSubmit() {
    if (this.postForm.invalid) return;

    const user = this.authService.user();
    if (!user) {
      this.error.set('You must be logged in to post.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const request = {
      authorId: user.id,
      postType: PostType.TEXT,
      content: {
        text: this.postForm.value.text,
        tags: this.extractTags(this.postForm.value.text || '')
      },
      publishedAt: new Date().toISOString()
    };

    this.postService.createPost(request).subscribe({
      next: () => {
        this.postForm.reset();
        this.isLoading.set(false);
        this.postCreated.emit();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to create post.');
        this.isLoading.set(false);
      }
    });
  }

  private extractTags(text: string): string[] {
    const tags = text.match(/#[\w]+/g);
    return tags ? tags.map(t => t.substring(1)) : [];
  }
}
