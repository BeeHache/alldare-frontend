import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  label = input<string>();
  value = input('');
  placeholder = input('');
  secureTextEntry = input(false);
  error = input<string>();
  className = input('');

  valueChange = output<string>();

  onValueChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.valueChange.emit(val);
  }
}
