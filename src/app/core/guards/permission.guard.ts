import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthFacade } from '../../store/auth/auth.facade';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const required = (route.data['permissions'] as string[]) ?? [];

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (required.length === 0 || required.every((p) => auth.hasPermission(p))) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
