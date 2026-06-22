import { GoogleBookItem } from '../models/api-response.model';
import { Book } from '../models/book.model';

export function mapToBook(item: GoogleBookItem): Book {
  const info = item.volumeInfo;
  return {
    id: item.id,
    title: info.title,
    authors: info.authors || ['Unknown Author'],
    description: info.description || 'No description available',
    publisher: info.publisher || 'Unknown Publisher',
    publishedDate: info.publishedDate || '',
    pageCount: info.pageCount || 0,
    thumbnail: (info.imageLinks && info.imageLinks.thumbnail) || '',
    previewLink: info.previewLink || '',
  };
}
