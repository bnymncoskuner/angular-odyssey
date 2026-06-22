import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookCardComponent } from './book-card/book-card.component';

@NgModule({
  declarations: [BookCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [BookCardComponent]
})
export class SharedModule {}
