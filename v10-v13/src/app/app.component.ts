import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/search" routerLinkActive="active">Search</a>
        <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
      </div>
      <div class="nav-right">
        <ng-container *ngIf="profileService.hasDisplayName(); else noProfile">
          <a
            routerLink="/profile"
            routerLinkActive="active"
            class="profile-link"
          >
            👤 {{ profileService.profile?.displayName }}
          </a>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </ng-container>
        <ng-template #noProfile>
          <a
            routerLink="/profile"
            routerLinkActive="active"
            class="profile-link"
            >Set up profile</a
          >
        </ng-template>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public profileService: ProfileService,
    private router: Router,
  ) {}

  logout(): void {
    this.profileService.clearProfile();
    this.router.navigate(['/search']);
  }
}
