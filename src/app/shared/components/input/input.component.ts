import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="'w-full mb-4 ' + className()">
      @if (label()) {
        <label class="block text-white mb-2 font-semibold text-sm">{{ label() }}</label>
      }
      <input
        [type]="secureTextEntry() ? 'password' : 'text'"
        [value]="value()"
        (input)="onValueChange($event)"
        [placeholder]="placeholder()"
        class="w-full bg-slate-800 border text-white p-4 rounded-xl text-base focus:outline-none focus:border-blue-500 transition-colors"
        [class.border-red-500]="error()"
        [class.border-slate-700]="!error()"
      />
      @if (error()) {
        <p class="text-red-500 mt-1 text-xs">{{ error() }}</p>
      }
    </div>
  `,
  styles: []
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
