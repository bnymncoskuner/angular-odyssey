import { effect, Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/state.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly storageKey = 'angular-evolution-profile';
  readonly profile = signal<UserProfile | null>(this.loadFromStorage());

  constructor() {
    effect(() => {
      const p = this.profile();
      if (p) {
        localStorage.setItem(this.storageKey, JSON.stringify(p));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    });
  }

  hasDisplayName(): boolean {
    const p = this.profile();
    return !!p && p.displayName.trim().length > 0;
  }

  setProfile(profile: UserProfile): void {
    this.profile.set(profile);
  }

  clearProfile(): void {
    this.profile.set(null);
  }

  private loadFromStorage(): UserProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
