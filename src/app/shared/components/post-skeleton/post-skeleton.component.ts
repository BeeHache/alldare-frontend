import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-post-skeleton',
  imports: [CommonModule, CardComponent],
  templateUrl: './post-skeleton.component.html',
  styleUrl: './post-skeleton.component.scss'
})
export class PostSkeletonComponent {}
