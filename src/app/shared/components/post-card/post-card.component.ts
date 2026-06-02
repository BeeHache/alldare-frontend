import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostResponse, PostType } from '../../../core/models/post.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-post-card',
  imports: [CommonModule, CardComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  post = input.required<PostResponse>();
  className = input('');

  protected readonly PostType = PostType;
}
