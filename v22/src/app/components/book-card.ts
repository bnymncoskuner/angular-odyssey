import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/books', book().id]" class="card">
      @if (book().thumbnail) {
        <img [src]="book().thumbnail" [alt]="book().title" class="thumbnail" />
      } @else {
        <div class="no-cover">No Cover</div>
      }
      <div class="info">
        <h3>{{ book().title }}</h3>
        <p class="authors">{{ book().authors.join(', ') }}</p>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './book-card.scss',
})
export class BookCard {
  book = input.required<Book>();
}
