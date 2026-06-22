import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { BookListComponent } from './book-list.component';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent, BookListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: SearchComponent }])
  ]
})
export class SearchModule {}
