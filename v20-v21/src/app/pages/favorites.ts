import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCard } from '../components/book-card';
import { FavoritesService } from '../services/favorites.service';

@Component({
  imports: [BookCard, RouterLink],
  template: `
    <h1>My Favorites</h1>
    @if (favoritesService.favorites().length === 0) {
      <p class="empty">
        No favorites yet. <a routerLink="/search">Search for books</a> and add some!
      </p>
    } @else {
      <div class="book-grid">
        @for (book of favoritesService.favorites(); track book.id) {
          <app-book-card [book]="book" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './favorites.scss',
})
export class Favorites {
  protected readonly favoritesService = inject(FavoritesService);
}
