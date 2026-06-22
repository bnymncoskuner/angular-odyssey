import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Book } from '../../models/book.model';
import { BookSearchService } from '../../services/book-search.service';

@Component({
  selector: 'app-related-books',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Related Books</h2>
    <ng-container *ngIf="isLoading; else loaded">
      <div class="related-grid">
        <div *ngFor="let i of placeholders" class="card-placeholder"></div>
      </div>
    </ng-container>
    <ng-template #loaded>
      <div *ngIf="books.length > 0; else empty" class="related-grid">
        <app-book-card *ngFor="let book of books" [book]="book"></app-book-card>
      </div>
      <ng-template #empty>
        <p class="empty">No related books found.</p>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./related-books.component.scss'],
})
export class RelatedBooksComponent implements OnChanges {
  @Input() bookId: string;

  placeholders = Array(5).fill(0);
  books: Book[] = [];
  isLoading = false;

  constructor(
    private bookSearchService: BookSearchService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bookId && this.bookId) {
      this.fetchRelated(this.bookId);
    }
  }

  private fetchRelated(id: string): void {
    this.isLoading = true;
    this.bookSearchService.getRelatedBooks(id).subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.books = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
