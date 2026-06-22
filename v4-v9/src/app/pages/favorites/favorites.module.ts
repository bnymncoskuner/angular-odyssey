import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { FavoritesComponent } from './favorites.component';

@NgModule({
  declarations: [FavoritesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: FavoritesComponent }])
  ]
})
export class FavoritesModule {}
