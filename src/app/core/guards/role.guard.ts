import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UserRole } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const allowedRoles = (route.data['roles'] as UserRole[]) ?? [];

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (allowedRoles.length === 0 || auth.hasRole(allowedRoles)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
