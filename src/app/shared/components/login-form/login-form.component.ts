import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginValue = signal('');
  passwordValue = signal('');
  error = signal('');
  isLoading = signal(false);

  handleLogin() {
    const login = this.loginValue();
    const password = this.passwordValue();

    if (!login || !password) {
      this.error.set('Please enter your login and password.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.login({ login, password }).subscribe({
      next: () => {
        if (this.authService.isStaff()) {
          this.router.navigate(['/control-panel']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Invalid credentials.');
        this.isLoading.set(false);
      }
    });
  }
}
