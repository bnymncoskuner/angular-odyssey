import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/state.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly storageKey = 'angular-evolution-profile';
  private profileSubject = new BehaviorSubject<UserProfile | null>(this.loadFromStorage());

  profile$ = this.profileSubject.asObservable();

  get profile(): UserProfile | null {
    return this.profileSubject.getValue();
  }

  hasDisplayName(): boolean {
    const p = this.profile;
    return !!p && p.displayName.trim().length > 0;
  }

  setProfile(profile: UserProfile): void {
    this.profileSubject.next(profile);
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  clearProfile(): void {
    this.profileSubject.next(null);
    localStorage.removeItem(this.storageKey);
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
