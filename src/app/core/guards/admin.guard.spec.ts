import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

describe('adminGuard', () => {
  let authServiceMock: any;
  let routerMock: any;
  let isLoadingSignal: WritableSignal<boolean>;

  beforeEach(() => {
    isLoadingSignal = signal(true);
    authServiceMock = {
      isStaff: vi.fn(),
      isLoading: isLoadingSignal
    };
    routerMock = {
      createUrlTree: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should return true if user is staff', async () => {
    authServiceMock.isStaff.mockReturnValue(true);
    
    const resultPromise = TestBed.runInInjectionContext(() => {
      const obs: any = adminGuard({} as any, { url: '/admin' } as any);
      return firstValueFrom(obs);
    });

    isLoadingSignal.set(false); // Resolve loading
    const result = await resultPromise;
    
    expect(result).toBe(true);
  });

  it('should redirect to /admin/login if user is not staff', async () => {
    authServiceMock.isStaff.mockReturnValue(false);
    const mockUrlTree = {} as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockUrlTree);

    const resultPromise = TestBed.runInInjectionContext(() => {
      const obs: any = adminGuard({} as any, { url: '/admin/users' } as any);
      return firstValueFrom(obs);
    });

    isLoadingSignal.set(false); // Resolve loading
    const result = await resultPromise;

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/admin/login'], { queryParams: { url: '/admin/users' } });
    expect(result).toBe(mockUrlTree);
  });
});
