import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CallbackComponent } from './features/auth/callback/callback.component';
import { AdminLoginComponent } from './features/admin/login/login.component';
import { ControlPanelComponent } from './features/admin/dashboard/control-panel.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { 
    path: 'admin', 
    component: ControlPanelComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: 'api/auth/callback/alldare', component: CallbackComponent },
  { path: '**', redirectTo: '' }
];
