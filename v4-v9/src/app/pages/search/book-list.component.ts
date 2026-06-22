import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p *ngIf="books.length === 0 && !isLoading" class="empty">
      No books to display. Try searching!
    </p>
    <div class="book-grid">
      <app-book-card *ngFor="let book of books" [book]="book"></app-book-card>
      <ng-container *ngIf="isLoading">
        <div *ngFor="let i of placeholders" class="card-placeholder"></div>
      </ng-container>
    </div>
    <p *ngIf="!isLoading && !hasMore && books.length > 0" class="end">
      No more results
    </p>
    <div class="scroll-sentinel"></div>
  `,
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Input() isLoading = false;
  @Input() hasMore = true;
  @Output() loadMore = new EventEmitter<void>();

  placeholders = Array(4).fill(0);

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isLoading || !this.hasMore) {
      return;
    }
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const bottomVisible = rect.bottom <= window.innerHeight + 200;
    if (bottomVisible) {
      this.loadMore.emit();
    }
  }
}
