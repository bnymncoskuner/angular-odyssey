import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent, RouterLink],
  template: `
    <h1>My Favorites</h1>
    @if (favoritesService.favorites().length === 0) {
      <p class="empty">
        No favorites yet. <a routerLink="/search">Search for books</a> and add
        some!
      </p>
    } @else {
      <div class="book-grid">
        @for (book of favoritesService.favorites(); track book.id) {
          <app-book-card [book]="book" />
        }
      </div>
    }
  `,
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  protected readonly favoritesService = inject(FavoritesService);
}
