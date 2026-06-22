import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', loadComponent: () => import('./pages/search').then(m => m.Search) },
  { path: 'books/:id', loadComponent: () => import('./pages/book-detail').then(m => m.BookDetail) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites').then(m => m.Favorites), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile').then(m => m.Profile) },
  { path: '**', redirectTo: 'search' },
];
