import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
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

  handleGoogleSso() {
    window.location.href = this.authService.getGoogleSsoUrl();
  }
}
