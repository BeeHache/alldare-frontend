import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SsoButtonsComponent } from '../../../shared/components/sso-buttons/sso-buttons.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    CardComponent,
    SsoButtonsComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
}
