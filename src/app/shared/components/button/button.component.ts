import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      (click)="onPress.emit($event)"
      [class]="buttonClasses"
    >
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      } @else {
        {{ title() }}
      }
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  title = input('');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  loading = input(false);
  disabled = input(false);
  className = input('');

  onPress = output<MouseEvent>();

  get buttonClasses(): string {
    const base = 'flex items-center justify-center p-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ';
    let variantClass = '';

    switch (this.variant()) {
      case 'secondary':
        variantClass = 'bg-slate-700 text-white hover:bg-slate-600';
        break;
      case 'outline':
        variantClass = 'bg-transparent border border-slate-700 text-white hover:bg-slate-800';
        break;
      default:
        variantClass = 'bg-blue-600 text-white hover:bg-blue-500';
        break;
    }

    return base + variantClass + ' ' + this.className();
  }
}
