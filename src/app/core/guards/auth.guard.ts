// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTE_PATHS } from '../../../app/app.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  sessionStorage.setItem('redirectUrl', state.url);
  
  // Redirect to login page
  router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.LOGIN}`]);
  return false;
};