import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GoogleBookItem, GoogleBooksApiResponse } from '../models/api-response.model';
import { Book } from '../models/book.model';
import { mapToBook } from '../utils/map-to-book';
import { BookSearchService } from './book-search.service';

/**
 * Static implementation of BookSearchService for production/GitHub Pages deployment.
 * Replaces HTTP calls to the API server with client-side filtering and pagination
 * over a bundled static JSON dataset. Swapped in via Angular DI using fileReplacements
 * in angular.json (no environment checks in application code).
 */
@Injectable()
export class StaticBookSearchService extends BookSearchService {
  private readonly httpClient = inject(HttpClient);
  private allBooks: GoogleBookItem[] = [];
  private dataLoaded = false;
  private filteredBooks: GoogleBookItem[] = [];

  constructor() {
    super();
    this.loadStaticData();
  }

  private loadStaticData(): void {
    if (!this.dataLoaded) {
      this.httpClient.get<GoogleBooksApiResponse>('./assets/api/books.json').subscribe(data => {
        this.allBooks = data.items || [];
        this.dataLoaded = true;
      });
    }
  }

  override search(query: string): void {
    if (!query || query.trim().length < 2) { return; }

    const q = query.toLowerCase();
    this.filteredBooks = this.allBooks.filter(item => {
      const title = (item.volumeInfo.title || '').toLowerCase();
      const authors = (item.volumeInfo.authors || []).join(' ').toLowerCase();
      const description = (item.volumeInfo.description || '').toLowerCase();
      return title.includes(q) || authors.includes(q) || description.includes(q);
    });

    const pageSize = 10;
    const page = this.filteredBooks.slice(0, pageSize).map(mapToBook);

    this.booksSubject.next(page);
    this.totalItemsSubject.next(this.filteredBooks.length);
    this.errorSubject.next(null);
    this.query = query;
  }

  override loadMore(): void {
    if (this.isLoading || !this.hasMore) { return; }

    const currentLength = this.books.length;
    const pageSize = 10;
    const nextPage = this.filteredBooks.slice(currentLength, currentLength + pageSize).map(mapToBook);

    this.booksSubject.next([...this.books, ...nextPage]);
  }

  override getBookById(id: string): Observable<Book | null> {
    const item = this.allBooks.find(b => b.id === id);
    return of(item ? mapToBook(item) : null);
  }

  override getRelatedBooks(id: string): Observable<Book[]> {
    const otherBooks = this.allBooks.filter(b => b.id !== id);
    const shuffled = otherBooks.sort(() => Math.random() - 0.5);
    return of(shuffled.slice(0, 5).map(mapToBook));
  }
}
