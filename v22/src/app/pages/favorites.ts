import { ChangeDetectionStrategy, Component, inject, injectAsync, onIdle } from '@angular/core';
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
      <div class="actions">
        <button (click)="exportFavorites()" class="export-btn">📥 Export as JSON</button>
      </div>
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

  // injectAsync: ExportService is lazily loaded only when user clicks "Export"
  // Its code is NOT in the initial bundle — loaded on demand!
  private loadExporter = injectAsync(
    () => import('../services/export.service').then((m) => m.ExportService),
    {
      prefetch: onIdle,
    },
  );

  async exportFavorites(): Promise<void> {
    const exporter = await this.loadExporter();
    exporter.exportAsJson(this.favoritesService.favorites());
  }
}
