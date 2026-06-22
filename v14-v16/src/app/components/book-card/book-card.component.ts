import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/books', book.id]" class="card">
      <img
        *ngIf="book.thumbnail; else noCover"
        [src]="book.thumbnail"
        [alt]="book.title"
        class="thumbnail"
      />
      <ng-template #noCover>
        <div class="no-cover">No Cover</div>
      </ng-template>
      <div class="info">
        <h3>{{ book.title }}</h3>
        <p class="authors">{{ book.authors.join(', ') }}</p>
      </div>
    </a>
  `,
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent {
  @Input() book!: Book;
}
