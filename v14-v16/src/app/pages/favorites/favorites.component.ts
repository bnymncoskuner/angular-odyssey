import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, BookCardComponent],
  template: `
    <h1>My Favorites</h1>
    <ng-container
      *ngIf="favoritesService.favorites.length === 0; else hasFavorites"
    >
      <p class="empty">
        No favorites yet. <a routerLink="/search">Search for books</a> and add
        some!
      </p>
    </ng-container>
    <ng-template #hasFavorites>
      <div class="book-grid">
        <app-book-card
          *ngFor="let book of favoritesService.favorites"
          [book]="book"
        ></app-book-card>
      </div>
    </ng-template>
  `,
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  favoritesService = inject(FavoritesService);
}
