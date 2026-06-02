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
        <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-slate-400 mb-8 text-base">Join the Alldare platform</p>

        <app-input
          label="Login (Username or Email)"
          [value]="loginValue()"
          (valueChange)="loginValue.set($event)"
          placeholder="Choose a login"
        ></app-input>

        <app-input
          label="Password"
          [value]="passwordValue()"
          (valueChange)="passwordValue.set($event)"
          placeholder="Create a password"
          [secureTextEntry]="true"
        ></app-input>

        <app-input
          label="Confirm Password"
          [value]="confirmPasswordValue()"
          (valueChange)="confirmPasswordValue.set($event)"
          placeholder="Confirm your password"
          [secureTextEntry]="true"
        ></app-input>

        @if (error()) {
          <p class="text-red-500 mb-4 text-center text-sm">{{ error() }}</p>
        }

        <app-button
          title="Sign Up"
          (onPress)="handleRegister()"
          [loading]="isLoading()"
          className="mt-2 w-full"
        ></app-button>

        <div class="mt-8 text-center">
          <p class="text-slate-400 text-sm">
            Already have an account?
            <a routerLink="/auth/login" class="text-blue-500 font-bold ml-1">
              Sign In
            </a>
          </p>
        </div>
      </app-card>
    </div>
  `,
  styles: []
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
}
