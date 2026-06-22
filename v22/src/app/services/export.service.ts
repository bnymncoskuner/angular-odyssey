import { Service } from '@angular/core';
import { Book } from '../models/book.model';

/**
 * Export service — demonstrates injectAsync().
 * This service is lazily loaded only when the user clicks "Export".
 * Its code is not included in the initial bundle.
 */
@Service()
export class ExportService {
  exportAsJson(books: Book[]): void {
    const data = JSON.stringify(books, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
