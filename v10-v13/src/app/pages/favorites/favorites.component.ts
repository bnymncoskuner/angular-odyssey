import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  constructor(public favoritesService: FavoritesService) {}
}
