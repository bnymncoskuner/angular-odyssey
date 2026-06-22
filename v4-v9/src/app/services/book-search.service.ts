import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleBookItem, GoogleBooksApiResponse } from '../models/api-response.model';
import { Book } from '../models/book.model';
import { mapToBook } from '../utils/map-to-book';

@Injectable({ providedIn: 'root' })
export class BookSearchService {
  protected readonly pageSize = 10;

  protected query = '';
  protected booksSubject = new BehaviorSubject<Book[]>([]);
  protected totalItemsSubject = new BehaviorSubject<number>(0);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  protected errorSubject = new BehaviorSubject<any>(null);

  books$ = this.booksSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  get books(): Book[] {
    return this.booksSubject.getValue();
  }

  get totalItems(): number {
    return this.totalItemsSubject.getValue();
  }

  get isLoading(): boolean {
    return this.isLoadingSubject.getValue();
  }

  get error(): any {
    return this.errorSubject.getValue();
  }

  get hasMore(): boolean {
    return this.books.length < this.totalItems;
  }

  search(query: string): void {
    this.query = query;
    this.booksSubject.next([]);
    this.totalItemsSubject.next(0);
    this.errorSubject.next(null);
    this.fetchPage(0);
  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore) { return; }
    this.fetchPage(this.books.length);
  }

  getBookById(id: string): Observable<Book | null> {
    return this.http.get<GoogleBookItem>(`http://localhost:3000/volumes/${id}`).pipe(
      map(item => mapToBook(item)),
      catchError(() => of(null))
    );
  }

  getRelatedBooks(id: string): Observable<Book[]> {
    return this.http.get<GoogleBooksApiResponse>(`http://localhost:3000/volumes/${id}/related`).pipe(
      map(response => (response.items || []).map(mapToBook)),
      catchError(() => of([]))
    );
  }

  private fetchPage(startIndex: number): void {
    const q = this.query;
    if (!q || q.trim().length < 2) { return; }

    this.isLoadingSubject.next(true);
    this.http
      .get<GoogleBooksApiResponse>(
        `http://localhost:3000/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${this.pageSize}`
      )
      .subscribe({
        next: (response) => {
          const items = response.items || [];
          const newBooks = items.map(mapToBook);
          this.booksSubject.next([...this.books, ...newBooks]);
          this.totalItemsSubject.next(response.totalItems);
          this.isLoadingSubject.next(false);
        },
        error: (err) => {
          this.errorSubject.next(err);
          this.isLoadingSubject.next(false);
        },
      });
  }
}
