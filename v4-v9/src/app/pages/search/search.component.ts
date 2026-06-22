import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BookSearchService } from '../../services/book-search.service';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Search Books</h1>
    <form (ngSubmit)="onSearch()" class="search-form">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        name="query"
        placeholder="Search for books..."
        [class.invalid]="searchQuery.length > 0 && searchQuery.length < 2"
      />
      <button type="submit" [disabled]="searchQuery.trim().length < 2">
        Search
      </button>
    </form>
    <p *ngIf="searchQuery.length > 0 && searchQuery.length < 2" class="error">
      Query must be at least 2 characters
    </p>
    <p *ngIf="bookSearchService.error" class="error">
      Search failed. Please try again later.
    </p>
    <app-book-list
      [books]="bookSearchService.books"
      [isLoading]="bookSearchService.isLoading"
      [hasMore]="bookSearchService.hasMore"
      (loadMore)="bookSearchService.loadMore()"
    ></app-book-list>
  `,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchQuery = '';

  constructor(public bookSearchService: BookSearchService) {}

  onSearch(): void {
    this.bookSearchService.search(this.searchQuery);
  }
}
