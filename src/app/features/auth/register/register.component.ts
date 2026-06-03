import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RegisterFormComponent } from '../../../shared/components/register-form/register-form.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    RegisterFormComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
}
