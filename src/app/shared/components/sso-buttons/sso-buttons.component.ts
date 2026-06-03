import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sso-buttons',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './sso-buttons.component.html',
  styleUrl: './sso-buttons.component.scss'
})
export class SsoButtonsComponent {
  private authService = inject(AuthService);

  handleGoogleSso() {
    window.location.href = this.authService.getGoogleSsoUrl();
  }

  handleGithubSso() {
    window.location.href = this.authService.getGithubSsoUrl();
  }
}
