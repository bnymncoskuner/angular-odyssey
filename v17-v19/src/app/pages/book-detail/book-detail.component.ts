import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RelatedBooksComponent } from '../../components/related-books/related-books.component';
import { Book } from '../../models/book.model';
import { BookSearchService } from '../../services/book-search.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RelatedBooksComponent],
  template: `
    @if (isLoading()) {
      <div class="skeleton-detail">
        <div class="skeleton-image"></div>
        <div class="skeleton-info">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line subtitle"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    } @else if (error()) {
      <div class="not-found">
        <h2>Book not found</h2>
        <a routerLink="/search">Back to search</a>
      </div>
    } @else if (book()) {
      <div class="detail">
        <div class="detail-header">
          @if (book()!.thumbnail) {
            <img [src]="book()!.thumbnail" [alt]="book()!.title" />
          }
          <div class="detail-info">
            <h1>{{ book()!.title }}</h1>
            <p class="authors">By {{ book()!.authors.join(', ') }}</p>
            <p><strong>Publisher:</strong> {{ book()!.publisher }}</p>
            <p><strong>Published:</strong> {{ book()!.publishedDate }}</p>
            <p><strong>Pages:</strong> {{ book()!.pageCount }}</p>
            <button (click)="toggleFavorite()" class="fav-btn">
              {{
                isFavorite() ? '★ Remove from Favorites' : '☆ Add to Favorites'
              }}
            </button>
          </div>
        </div>
        <div class="description">
          <h2>Description</h2>
          <p>{{ book()!.description }}</p>
        </div>
        <a routerLink="/search" class="back-link">← Back to search</a>

        @defer (on viewport; prefetch on idle) {
          <app-related-books [bookId]="id()" />
        } @placeholder (minimum 1s) {
          <div class="related-placeholder">
            <h2>Related Books</h2>
            <p>Scroll down to load recommendations...</p>
          </div>
        } @loading (minimum 1s) {
          <div class="related-placeholder">
            <h2>Related Books</h2>
            <div class="loading-shimmer"></div>
          </div>
        }
      </div>
    }
  `,
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent {
  id = input.required<string>();

  private bookSearchService = inject(BookSearchService);
  private favoritesService = inject(FavoritesService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  // rxResource: wraps Observable-based service with built-in loading/error signals
  bookResource = rxResource<Book | null, string>({
    request: this.id,
    loader: ({ request: id }) => this.bookSearchService.getBookById(id),
  });

  book = computed<Book | null>(() => this.bookResource.value() ?? null);
  isLoading = computed(() => this.bookResource.isLoading());
  error = computed(() => this.bookResource.error());
  isFavorite = this.favoritesService.isFavorite(this.book);

  toggleFavorite(): void {
    if (!this.profileService.hasDisplayName()) {
      this.router.navigate(['/profile']);
      return;
    }
    const b = this.book();
    if (!b) return;
    if (this.favoritesService.isFavoriteById(b.id)) {
      this.favoritesService.remove(b.id);
    } else {
      this.favoritesService.add(b);
    }
  }
}
