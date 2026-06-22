import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookSearchService } from '../../services/book-search.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

      <app-related-books [bookId]="bookId"></app-related-books>
    </div>
  `,
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  bookId = '';
  book: Book | null = null;
  isLoading = false;
  error: unknown = null;

  constructor(
    private route: ActivatedRoute,
    private bookSearchService: BookSearchService,
    private favoritesService: FavoritesService,
    private profileService: ProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.bookId) {
      this.fetchBook(this.bookId);
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
