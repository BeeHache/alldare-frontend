import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { SsoButtonsComponent } from '../sso-buttons/sso-buttons.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    SsoButtonsComponent
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginValue = signal('');
  passwordValue = signal('');
  confirmPasswordValue = signal('');
  error = signal('');
  isLoading = signal(false);

  handleRegister() {
    const login = this.loginValue();
    const password = this.passwordValue();
    const confirm = this.confirmPasswordValue();

    if (!login || !password || !confirm) {
      this.error.set('All fields are required.');
      return;
    }

    if (password !== confirm) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.register({ login, password }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Registration failed.');
        this.isLoading.set(false);
      }
    });
  }
}
