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
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    CardComponent
  ],
  template: `
    <div class="flex items-center justify-center p-4 bg-black min-h-screen">
      <app-card className="w-full max-w-md">
        <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p class="text-slate-400 mb-8 text-base">Sign in to your Alldare account</p>

        <app-input
          label="Login (Username or Email)"
          [value]="loginValue()"
          (valueChange)="loginValue.set($event)"
          placeholder="Enter your login"
          [error]="error() && !loginValue() ? 'Required' : ''"
        ></app-input>

        <app-input
          label="Password"
          [value]="passwordValue()"
          (valueChange)="passwordValue.set($event)"
          placeholder="Enter your password"
          [secureTextEntry]="true"
          [error]="error() && !passwordValue() ? 'Required' : ''"
        ></app-input>

        @if (error()) {
          <p class="text-red-500 mb-4 text-center text-sm">{{ error() }}</p>
        }

        <app-button
          title="Sign In"
          (onPress)="handleLogin()"
          [loading]="isLoading()"
          className="mt-2 w-full"
        ></app-button>

        <div class="mt-8 flex flex-row justify-center items-center">
          <div class="h-[1px] flex-1 bg-slate-800"></div>
          <span class="mx-4 text-slate-500 text-xs uppercase">or continue with</span>
          <div class="h-[1px] flex-1 bg-slate-800"></div>
        </div>

        <app-button
          title="Sign in with SSO"
          variant="outline"
          (onPress)="handleSsoRedirect()"
          className="mt-6 w-full"
        ></app-button>

        <div class="mt-8 text-center">
          <p class="text-slate-400 text-sm">
            Don't have an account?
            <a routerLink="/auth/register" class="text-blue-500 font-bold ml-1">
              Sign Up
            </a>
          </p>
        </div>
      </app-card>
    </div>
  `,
  styles: []
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
