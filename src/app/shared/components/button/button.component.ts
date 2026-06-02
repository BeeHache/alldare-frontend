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
    const base = 'alldare-button rounded-xl transition-all ';
    // Note: Removed 'p-4' if height or padding is explicitly set
    const hasHeight = this.className().includes('h-');
    const hasPadding = this.className().includes('p-');
    const defaultPadding = (hasHeight || hasPadding) ? '' : 'p-4 ';
    
    let variantClass = '';

    switch (this.variant()) {
      case 'secondary':
        variantClass = 'btn-secondary';
        break;
      case 'outline':
        variantClass = 'btn-outline';
        break;
      default:
        variantClass = 'btn-primary';
        break;
    }

    return base + defaultPadding + variantClass + ' ' + this.className();
  }
}
