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
    const base = 'alldare-button p-4 rounded-xl transition-all ';
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

    return base + variantClass + ' ' + this.className();
  }
}
