import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
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
