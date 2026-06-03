import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoginFormComponent } from '../../../shared/components/login-form/login-form.component';

@Component({
  selector: 'app-admin-login',
  imports: [
    CommonModule,
    CardComponent,
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent {
}
