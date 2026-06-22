import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookListComponent } from '../../components/book-list/book-list.component';
import { BookSearchService } from '../../services/book-search.service';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, BookListComponent],
  template: `
    <h1>Search Books</h1>
    <form (ngSubmit)="onSearch()" class="search-form">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        name="query"
        placeholder="Search for books..."
        [class.invalid]="searchQuery().length > 0 && searchQuery().length < 2"
      />
      <button type="submit" [disabled]="searchQuery().trim().length < 2">
        Search
      </button>
    </form>
    @if (searchQuery().length > 0 && searchQuery().length < 2) {
      <p class="error">Query must be at least 2 characters</p>
    }
    @if (bookSearch.error()) {
      <p class="error">Search failed. Please try again later.</p>
    }
    <app-book-list
      [books]="bookSearch.books()"
      [isLoading]="bookSearch.isLoading()"
      [hasMore]="bookSearch.books().length < bookSearch.totalItems()"
      (loadMore)="bookSearch.loadMore()"
    />
  `,
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  protected readonly bookSearch = inject(BookSearchService);
  protected readonly searchQuery = signal('');

  onSearch(): void {
    this.bookSearch.search(this.searchQuery());
  }
}
