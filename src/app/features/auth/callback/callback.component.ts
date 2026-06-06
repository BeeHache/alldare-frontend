import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-50">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-slate-900 mb-2">Completing Login...</h2>
        <p class="text-slate-600">Please wait while we set up your session.</p>
        <div class="mt-4 flex justify-center">
           <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.authService.setSession(token).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Failed to initialize session', err);
            this.router.navigate(['/auth/login'], { queryParams: { error: 'session_failed' } });
          }
        });
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
