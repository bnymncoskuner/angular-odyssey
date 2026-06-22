import { BookSearchService } from '../services/book-search.service';

export const bookSearchProvider = { provide: BookSearchService, useClass: BookSearchService };
