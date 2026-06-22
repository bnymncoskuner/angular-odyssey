import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  book = input.required<Book>();
}
