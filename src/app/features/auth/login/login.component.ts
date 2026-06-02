import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // State using Signals (local to component)
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
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Invalid credentials.');
        this.isLoading.set(false);
      }
    });
  }

  handleSsoRedirect() {
    window.location.href = this.authService.getSsoUrl();
  }
}
