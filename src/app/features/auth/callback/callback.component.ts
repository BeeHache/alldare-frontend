import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  imports: [CommonModule],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.exchangeCodeForToken(code).subscribe({
        next: () => {
          if (this.authService.isStaff()) {
            const returnUrl = this.route.snapshot.queryParamMap.get('url') || '/admin';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('SSO Callback failed', err);
          this.router.navigate(['/auth/login'], { queryParams: { error: 'sso_failed' } });
        }
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
