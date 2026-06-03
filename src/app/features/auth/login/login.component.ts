import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoginFormComponent } from '../../../shared/components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
}
