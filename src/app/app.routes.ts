import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthCallbackComponent } from './features/auth/callback/callback.component';
import { AdminLoginComponent } from './features/admin/login/login.component';
import { ControlPanelComponent } from './features/admin/dashboard/control-panel.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminOverviewComponent } from './features/admin/overview/overview.component';
import { adminGuard } from './core/guards/admin.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { MediaManagementComponent } from './features/media/media-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { 
    path: 'admin', 
    component: ControlPanelComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: '', component: AdminOverviewComponent, pathMatch: 'full' }
    ]
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:authorId', component: ProfileComponent },
  { path: 'media', component: MediaManagementComponent },
  { path: '**', redirectTo: '' }
];
