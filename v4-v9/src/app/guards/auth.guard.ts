import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.profileService.hasDisplayName()) {
      return true;
    }
    return this.router.createUrlTree(['/profile']);
  }
}
