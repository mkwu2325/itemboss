// core/guards/guest.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTE_PATHS } from '../../../app/app.routes';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return true;
  }

  // Redirect authenticated users to features page
  router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.FEATURES}`]);
  return false;
};