import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Book } from '../../models/book.model';
import { BookSearchService } from '../../services/book-search.service';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-related-books',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent],
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
  styleUrl: './related-books.component.scss',
})
export class RelatedBooksComponent {
  bookId = input.required<string>();
  placeholders = Array(5).fill(0);

  private bookSearchService = inject(BookSearchService);

  // rxResource (introduced in v19): wraps Observable with built-in loading/error signals
  relatedResource = rxResource<Book[], string>({
    request: this.bookId,
    loader: ({ request: id }) => this.bookSearchService.getRelatedBooks(id),
  });

  books = computed<Book[]>(() => this.relatedResource.value() ?? []);
}
