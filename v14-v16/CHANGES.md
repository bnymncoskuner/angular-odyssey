# Angular v14-v16 Era (2022-2023) — The Standalone Revolution

This milestone represents the biggest architectural shift since Angular 2: standalone components eliminate the need for NgModules, the `inject()` function replaces constructor injection, and functional guards replace class-based guards. The module system becomes optional — components declare their own dependencies.

## Key Features

- **Standalone components** (`standalone: true`) — no more NgModules needed for components
- **`inject()` function** — replaces constructor-based dependency injection
- **Functional route guards** (`CanActivateFn`) — replaces class-based `implements CanActivate`
- **`bootstrapApplication()`** — replaces `platformBrowserDynamic().bootstrapModule()`
- **`loadComponent`** — replaces `loadChildren` with modules for lazy loading
- **`withComponentInputBinding()`** — route params automatically bound as `@Input()`
- **`ApplicationConfig`** — provider-based app configuration
- **Signals** (developer preview in v16) — not used here but available
- **esbuild** (developer preview) — faster builds
- Still uses `*ngIf`/`*ngFor`, `BehaviorSubject` for state

## Code Examples

### Standalone Component

```typescript
// v14-v16/src/app/pages/favorites/favorites.component.ts
@Component({
  selector: "app-favorites",
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
  template: `
    <h1>My Favorites</h1>
    <ng-container *ngIf="favoritesService.favorites.length === 0; else hasFavorites">
      <p class="empty">No favorites yet. <a routerLink="/search">Search for books</a> and add some!</p>
    </ng-container>
    <ng-template #hasFavorites>
      <div class="book-grid">
        <app-book-card *ngFor="let book of favoritesService.favorites" [book]="book"></app-book-card>
      </div>
    </ng-template>
  `,
})
export class FavoritesComponent {
  favoritesService = inject(FavoritesService);
}
```

### bootstrapApplication() with ApplicationConfig

```typescript
// v14-v16/src/main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

```typescript
// v14-v16/src/app/app.config.ts
import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient()],
};
```

### inject() Function (Replaces Constructor DI)

```typescript
// v14-v16/src/app/services/book-search.service.ts
@Injectable({ providedIn: "root" })
export class BookSearchService {
  private readonly http = inject(HttpClient); // ← inject() instead of constructor
  // ...
}
```

```typescript
// v14-v16/src/app/pages/profile/profile.component.ts
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm = this.fb.group({
    /* ... */
  });
}
```

### Functional Route Guard

```typescript
// v14-v16/src/app/guards/auth.guard.ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ProfileService } from "../services/profile.service";

export const authGuard: CanActivateFn = () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  return profileService.hasDisplayName() ? true : router.createUrlTree(["/profile"]);
};
```

### loadComponent (Lazy Loading Without Modules)

```typescript
// v14-v16/src/app/app.routes.ts
export const routes: Routes = [
  { path: "", redirectTo: "search", pathMatch: "full" },
  { path: "search", loadComponent: () => import("./pages/search/search.component").then((m) => m.SearchComponent) },
  { path: "books/:id", loadComponent: () => import("./pages/book-detail/book-detail.component").then((m) => m.BookDetailComponent) },
  { path: "favorites", loadComponent: () => import("./pages/favorites/favorites.component").then((m) => m.FavoritesComponent), canActivate: [authGuard] },
  { path: "profile", loadComponent: () => import("./pages/profile/profile.component").then((m) => m.ProfileComponent) },
];
```

### Still Uses BehaviorSubject for State

```typescript
// v14-v16/src/app/services/book-search.service.ts
private booksSubject = new BehaviorSubject<Book[]>([]);
private isLoadingSubject = new BehaviorSubject<boolean>(false);
books$ = this.booksSubject.asObservable();
isLoading$ = this.isLoadingSubject.asObservable();
```

## What Changed from v10-v13

### NgModule → Standalone Component

```typescript
// v10-v13: Component declared in a module
// favorites.module.ts
@NgModule({
  declarations: [FavoritesComponent],
  imports: [CommonModule, RouterModule.forChild([...]), SharedModule],
})
export class FavoritesModule {}

// v14-v16: Component declares its own imports
@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
  // ...
})
export class FavoritesComponent {}
```

### Constructor DI → inject()

```typescript
// v10-v13: Constructor injection
export class ProfileComponent {
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    /* ... */
  }
}

// v14-v16: inject() function
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
}
```

### Class Guard → Functional Guard

```typescript
// v10-v13: Class-based guard
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) {}
  canActivate(): boolean | UrlTree {
    if (this.profileService.hasDisplayName()) return true;
    return this.router.createUrlTree(["/profile"]);
  }
}

// v14-v16: Functional guard (just a function!)
export const authGuard: CanActivateFn = () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  return profileService.hasDisplayName() ? true : router.createUrlTree(["/profile"]);
};
```

### Module Bootstrap → Application Bootstrap

```typescript
// v10-v13
platformBrowserDynamic().bootstrapModule(AppModule);

// v14-v16
bootstrapApplication(AppComponent, appConfig);
```

### loadChildren (module) → loadComponent (standalone)

```typescript
// v10-v13
{ path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule) }

// v14-v16
{ path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) }
```

### What Stayed the Same from v10-v13

| Pattern            | Still Used in v14-v16         |
| ------------------ | ----------------------------- |
| `*ngIf` / `*ngFor` | ✅ Same structural directives |
| BehaviorSubject    | ✅ Same state management      |
| Reactive Forms     | ✅ Same `fb.group()` pattern  |
| Karma + Jasmine    | ✅ Same test runner           |

### What's New

| Feature                       | Replaces                                     |
| ----------------------------- | -------------------------------------------- |
| `standalone: true`            | NgModules for component organization         |
| `inject()`                    | Constructor parameter injection              |
| `CanActivateFn`               | `implements CanActivate` class               |
| `bootstrapApplication()`      | `platformBrowserDynamic().bootstrapModule()` |
| `loadComponent`               | `loadChildren` with module                   |
| `ApplicationConfig`           | Module-level providers                       |
| `withComponentInputBinding()` | Manual `ActivatedRoute` param reading        |
