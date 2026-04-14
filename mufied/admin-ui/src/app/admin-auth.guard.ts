import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  const authenticated = await auth.ensureAuthenticated();
  return authenticated ? true : router.createUrlTree(['/login']);
};
