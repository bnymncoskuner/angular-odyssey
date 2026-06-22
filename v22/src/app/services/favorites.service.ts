import { computed, effect, inject, Service, signal, Signal } from '@angular/core';
import { Book } from '../models/book.model';
import { ProfileService } from './profile.service';

@Service()
export class FavoritesService {
  private readonly storagePrefix = 'angular-evolution-favorites-';
  private readonly profileService = inject(ProfileService);

  readonly favorites = signal<Book[]>([]);

  constructor() {
    // Load favorites when profile changes
    effect(() => {
      const profile = this.profileService.profile();
      if (profile) {
        this.favorites.set(this.loadFromStorage(profile.displayName));
      } else {
        this.favorites.set([]);
      }
    });

    // Persist favorites when they change (only if profile exists)
    effect(() => {
      const profile = this.profileService.profile();
      const favs = this.favorites();
      if (profile) {
        localStorage.setItem(this.storagePrefix + profile.displayName, JSON.stringify(favs));
      }
    });
  }

  add(book: Book): void {
    if (!this.isFavoriteById(book.id)) {
      this.favorites.update((favs) => [...favs, book]);
    }
  }

  remove(bookId: string): void {
    this.favorites.update((favs) => favs.filter((b) => b.id !== bookId));
  }

  isFavoriteById(bookId: string): boolean {
    return this.favorites().some((b) => b.id === bookId);
  }

  isFavorite(bookSignal: Signal<Book | null>): Signal<boolean> {
    return computed(() => {
      const book = bookSignal();
      if (!book) return false;
      return this.favorites().some((b) => b.id === book.id);
    });
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
