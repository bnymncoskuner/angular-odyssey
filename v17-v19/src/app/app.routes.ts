import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) },
  { path: 'books/:id', loadComponent: () => import('./pages/book-detail/book-detail.component').then(m => m.BookDetailComponent) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: '**', redirectTo: 'search' },
];
