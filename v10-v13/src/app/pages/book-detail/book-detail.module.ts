import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { BookDetailComponent } from './book-detail.component';
import { RelatedBooksComponent } from './related-books.component';

@NgModule({
  declarations: [BookDetailComponent, RelatedBooksComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: BookDetailComponent }])
  ]
})
export class BookDetailModule {}
