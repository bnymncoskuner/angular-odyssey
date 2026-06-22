import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const authGuard: CanActivateFn = () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (profileService.hasDisplayName()) {
    return true;
  }
  return router.createUrlTree(['/profile']);
};
