// core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn, type ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTE_PATHS } from '../../../app/app.routes';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Check if user is authenticated
  if (!currentUser?.isAuthenticated) {
    sessionStorage.setItem('redirectUrl', state.url);
    router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.LOGIN}`]);
    return false;
  }

  // If no specific roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // For future implementation - check user roles
  // This would typically check against currentUser.roles array
  const userRoles = (currentUser as any).roles || ['user']; // Default role
  
  const hasRequiredRole = requiredRoles.some(role => 
    userRoles.includes(role)
  );

  if (hasRequiredRole) {
    return true;
  }

  // Redirect to unauthorized page or features page
  router.navigate([`/${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.FEATURES}`]);
  return false;
};