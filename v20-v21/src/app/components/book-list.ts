import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    output,
} from '@angular/core';
import { Book } from '../models/book.model';
import { BookCard } from './book-card';

@Component({
  selector: 'app-book-list',
  imports: [BookCard],
  template: `
    @if (books().length === 0 && !isLoading()) {
      <p class="empty">No books to display. Try searching!</p>
    }
    <div class="book-grid">
      @for (book of books(); track book.id) {
        <app-book-card [book]="book" />
      }
      @if (isLoading()) {
        @for (i of placeholders; track i) {
          <div class="card-placeholder"></div>
        }
      }
    </div>
    @if (!isLoading() && !hasMore() && books().length > 0) {
      <p class="end">No more results</p>
    }
    <div class="scroll-sentinel"></div>
  `,
  styleUrl: './book-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class BookList {
  books = input.required<Book[]>();
  isLoading = input(false);
  hasMore = input(true);
  loadMore = output<void>();

  placeholders = Array(4).fill(0);

  private el = inject(ElementRef);

  onScroll(): void {
    if (this.isLoading() || !this.hasMore()) return;
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const bottomVisible = rect.bottom <= window.innerHeight + 200;
    if (bottomVisible) {
      this.loadMore.emit();
    }
  }
}
