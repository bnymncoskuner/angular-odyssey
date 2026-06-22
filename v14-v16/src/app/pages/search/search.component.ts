import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from '../../components/book-list/book-list.component';
import { BookSearchService } from '../../services/book-search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, BookListComponent],
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
    <p *ngIf="bookSearch.error" class="error">
      Search failed. Please try again later.
    </p>
    <app-book-list
      [books]="bookSearch.books"
      [isLoading]="bookSearch.isLoading"
      [hasMore]="bookSearch.hasMore"
      (loadMore)="bookSearch.loadMore()"
    ></app-book-list>
  `,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  bookSearch = inject(BookSearchService);
  searchQuery = '';

  onSearch(): void {
    this.bookSearch.search(this.searchQuery);
  }
}
