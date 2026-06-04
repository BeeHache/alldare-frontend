import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SsoButtonsComponent } from '../../../shared/components/sso-buttons/sso-buttons.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    CardComponent,
    SsoButtonsComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
}
