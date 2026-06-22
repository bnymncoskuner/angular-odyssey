import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Book } from '../models/book.model';
import { BookSearchService } from '../services/book-search.service';
import { BookCard } from './book-card';

@Component({
  selector: 'app-related-books',
  imports: [BookCard],
  template: `
    <h2>Related Books</h2>
    @if (relatedResource.isLoading()) {
      <div class="related-grid">
        @for (i of placeholders; track i) {
          <div class="card-placeholder"></div>
        }
      </div>
    } @else if (books().length > 0) {
      <div class="related-grid">
        @for (book of books(); track book.id) {
          <app-book-card [book]="book" />
        }
      </div>
    } @else {
      <p class="empty">No related books found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './related-books.scss',
})
export class RelatedBooks {
  bookId = input.required<string>();
  placeholders = Array(5).fill(0);

  private bookSearchService = inject(BookSearchService);

  // rxResource: wraps Observable-based service with built-in loading/error signals
  relatedResource = rxResource<Book[], string>({
    params: this.bookId,
    stream: ({ params: id }) => this.bookSearchService.getRelatedBooks(id),
  });

  books = computed<Book[]>(() => this.relatedResource.value() ?? []);
}
