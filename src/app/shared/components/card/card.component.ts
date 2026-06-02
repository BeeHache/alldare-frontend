import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="'bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 ' + className()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  className = input('');
}
