import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storagePrefix = 'angular-evolution-favorites-';
  private readonly profileService = inject(ProfileService);
  private favoritesSubject = new BehaviorSubject<Book[]>([]);

  favorites$ = this.favoritesSubject.asObservable();

  get favorites(): Book[] {
    return this.favoritesSubject.getValue();
  }

  constructor() {
    this.profileService.profile$.subscribe(profile => {
      if (profile) {
        this.favoritesSubject.next(this.loadFromStorage(profile.displayName));
      } else {
        this.favoritesSubject.next([]);
      }
    });
  }

  add(book: Book): void {
    if (!this.isFavoriteById(book.id)) {
      const updated = [...this.favorites, book];
      this.favoritesSubject.next(updated);
      this.persistToStorage();
    }
  }

  remove(bookId: string): void {
    const updated = this.favorites.filter(b => b.id !== bookId);
    this.favoritesSubject.next(updated);
    this.persistToStorage();
  }

  isFavoriteById(bookId: string): boolean {
    return this.favorites.some(b => b.id === bookId);
  }

  private persistToStorage(): void {
    const profile = this.profileService.profile;
    if (profile) {
      localStorage.setItem(
        this.storagePrefix + profile.displayName,
        JSON.stringify(this.favorites)
      );
    }
  }

  private loadFromStorage(displayName: string): Book[] {
    try {
      const stored = localStorage.getItem(this.storagePrefix + displayName);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
