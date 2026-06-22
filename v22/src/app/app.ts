import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/search" routerLinkActive="active">Search</a>
        <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
      </div>
      <div class="nav-right">
        @if (profileService.hasDisplayName()) {
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">
            👤 {{ profileService.profile()!.displayName }}
          </a>
          <button (click)="logout()" class="logout-btn">Logout</button>
        } @else {
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">Set up profile</a>
        }
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
})
export class App {
  protected readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  logout(): void {
    this.profileService.clearProfile();
    this.router.navigate(['/search']);
  }
}
