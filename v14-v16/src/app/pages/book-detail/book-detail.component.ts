import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RelatedBooksComponent } from '../../components/related-books/related-books.component';
import { Book } from '../../models/book.model';
import { BookSearchService } from '../../services/book-search.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RelatedBooksComponent],
  template: `
    <div *ngIf="isLoading" class="skeleton-detail">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line subtitle"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <div *ngIf="!isLoading && error" class="not-found">
      <h2>Book not found</h2>
      <a routerLink="/search">Back to search</a>
    </div>

    <div *ngIf="!isLoading && !error && book" class="detail">
      <div class="detail-header">
        <img *ngIf="book.thumbnail" [src]="book.thumbnail" [alt]="book.title" />
        <div class="detail-info">
          <h1>{{ book.title }}</h1>
          <p class="authors">By {{ book.authors.join(', ') }}</p>
          <p><strong>Publisher:</strong> {{ book.publisher }}</p>
          <p><strong>Published:</strong> {{ book.publishedDate }}</p>
          <p><strong>Pages:</strong> {{ book.pageCount }}</p>
          <button (click)="toggleFavorite()" class="fav-btn">
            {{
              isFavorite() ? '★ Remove from Favorites' : '☆ Add to Favorites'
            }}
          </button>
        </div>
      </div>
      <div class="description">
        <h2>Description</h2>
        <p>{{ book.description }}</p>
      </div>
      <a routerLink="/search" class="back-link">← Back to search</a>

      <app-related-books [bookId]="id"></app-related-books>
    </div>
  `,
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnChanges {
  @Input() id!: string;

  private bookSearchService = inject(BookSearchService);
  private favoritesService = inject(FavoritesService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  book: Book | null = null;
  isLoading = false;
  error: unknown = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.fetchBook(this.id);
    }
  }

  isFavorite(): boolean {
    return this.book
      ? this.favoritesService.isFavoriteById(this.book.id)
      : false;
  }

  toggleFavorite(): void {
    if (!this.profileService.hasDisplayName()) {
      this.router.navigate(['/profile']);
      return;
    }
    if (!this.book) return;
    if (this.favoritesService.isFavoriteById(this.book.id)) {
      this.favoritesService.remove(this.book.id);
    } else {
      this.favoritesService.add(this.book);
    }
  }

  private fetchBook(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.bookSearchService.getBookById(id).subscribe({
      next: (book) => {
        if (book) {
          this.book = book;
        } else {
          this.error = 'Not found';
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
