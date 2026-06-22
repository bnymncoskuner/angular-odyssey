import { BookSearchService } from '../services/book-search.service';
import { StaticBookSearchService } from '../services/static-book-search.service';

export const bookSearchProvider = { provide: BookSearchService, useClass: StaticBookSearchService };
