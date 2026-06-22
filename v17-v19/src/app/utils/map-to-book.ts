import { GoogleBookItem } from '../models/api-response.model';
import { Book } from '../models/book.model';

export function mapToBook(item: GoogleBookItem): Book {
  return {
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors ?? ['Unknown Author'],
    description: item.volumeInfo.description ?? 'No description available',
    publisher: item.volumeInfo.publisher ?? 'Unknown Publisher',
    publishedDate: item.volumeInfo.publishedDate ?? '',
    pageCount: item.volumeInfo.pageCount ?? 0,
    thumbnail: item.volumeInfo.imageLinks?.thumbnail ?? '',
    previewLink: item.volumeInfo.previewLink ?? '',
  };
}
