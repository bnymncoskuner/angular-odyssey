import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleBookItem, GoogleBooksApiResponse } from '../models/api-response.model';
import { Book } from '../models/book.model';
import { mapToBook } from '../utils/map-to-book';

@Service()
export class BookSearchService {
  private readonly http = inject(HttpClient);

  readonly query = signal('');
  readonly pageSize = 10;

  // Accumulated books from all pages loaded so far
  readonly books = signal<Book[]>([]);
  readonly totalItems = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<unknown>(null);

  readonly hasMore = computed(() => this.books().length < this.totalItems());

  search(query: string): void {
    this.query.set(query);
    this.books.set([]);
    this.totalItems.set(0);
    this.error.set(null);
    this.fetchPage(0);
  }

  loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.fetchPage(this.books().length);
  }

  getBookById(id: string): Observable<Book | null> {
    return this.http.get<GoogleBookItem>(`http://localhost:3000/volumes/${id}`).pipe(
      map((item) => mapToBook(item)),
      catchError(() => of(null)),
    );
  }

  getRelatedBooks(id: string): Observable<Book[]> {
    return this.http
      .get<GoogleBooksApiResponse>(`http://localhost:3000/volumes/${id}/related`)
      .pipe(
        map((response) => (response.items ?? []).map(mapToBook)),
        catchError(() => of([])),
      );
  }

  private fetchPage(startIndex: number): void {
    const q = this.query();
    if (!q || q.trim().length < 2) return;

    this.isLoading.set(true);
    this.http
      .get<GoogleBooksApiResponse>(
        `http://localhost:3000/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${this.pageSize}`,
      )
      .subscribe({
        next: (response) => {
          const newBooks = (response.items ?? []).map(mapToBook);
          this.books.update((existing) => [...existing, ...newBooks]);
          this.totalItems.set(response.totalItems);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err);
          this.isLoading.set(false);
        },
      });
  }
}
