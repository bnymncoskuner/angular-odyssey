import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule) },
  { path: 'books/:id', loadChildren: () => import('./pages/book-detail/book-detail.module').then(m => m.BookDetailModule) },
  { path: 'favorites', loadChildren: () => import('./pages/favorites/favorites.module').then(m => m.FavoritesModule), canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: '**', redirectTo: 'search' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
