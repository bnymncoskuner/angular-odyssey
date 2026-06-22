# Angular v4-v9 Era (2017-2020) — The Classic Angular

This milestone represents the "classic" Angular architecture that dominated from Angular 4 through Angular 9. NgModules are the organizational unit, dependency injection is constructor-based, and RxJS `BehaviorSubject` is the go-to pattern for state management.

## Key Features

- **NgModules** as the organizational unit (`AppModule`, feature modules)
- **Constructor-based dependency injection** — services injected via constructor parameters
- **Class-based route guards** — `implements CanActivate` interface
- **`*ngIf` and `*ngFor` structural directives** — template control flow
- **Untyped reactive forms** — `FormGroup` without generics (type is `FormGroup`, not `FormGroup<{...}>`)
- **`HttpClient` with RxJS** — `subscribe()` and `pipe()` for HTTP calls
- **`BehaviorSubject`** for state management — expose `Observable` via `.asObservable()`
- **`async` pipe** for template subscriptions
- **Lazy loading** via `loadChildren: () => import(...).then(m => m.Module)`
- **Karma + Jasmine** for testing
- **`platformBrowserDynamic().bootstrapModule(AppModule)`** — module-based bootstrap
- **No optional chaining in templates** — use `||` for defaults, no `?.` in expressions

## Code Examples

### NgModule (AppModule)

```typescript
// v4-v9/src/app/app.module.ts
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Module-Based Bootstrap

```typescript
// v4-v9/src/main.ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

### Constructor-Based Dependency Injection

```typescript
// v4-v9/src/app/pages/book-detail/book-detail.component.ts
export class BookDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private favoritesService: FavoritesService,
    private profileService: ProfileService,
    private router: Router,
  ) {}
}
```

### Class-Based Route Guard

```typescript
// v4-v9/src/app/guards/auth.guard.ts
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.profileService.hasDisplayName()) {
      return true;
    }
    return this.router.createUrlTree(["/profile"]);
  }
}
```

### Lazy Loading with NgModules

```typescript
// v4-v9/src/app/app-routing.module.ts
const routes: Routes = [
  { path: "search", loadChildren: () => import("./pages/search/search.module").then((m) => m.SearchModule) },
  { path: "books/:id", loadChildren: () => import("./pages/book-detail/book-detail.module").then((m) => m.BookDetailModule) },
  { path: "favorites", loadChildren: () => import("./pages/favorites/favorites.module").then((m) => m.FavoritesModule), canActivate: [AuthGuard] },
];
```

### BehaviorSubject State Management

```typescript
// v4-v9/src/app/services/book-search.service.ts
@Injectable({ providedIn: "root" })
export class BookSearchService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>(null);

  books$ = this.booksSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  get books(): Book[] {
    return this.booksSubject.getValue();
  }
}
```

### *ngIf and *ngFor Structural Directives

```html
<!-- v4-v9/src/app/pages/favorites/favorites.component.ts -->
<ng-container *ngIf="favoritesService.favorites.length === 0; else hasFavorites">
  <p class="empty">No favorites yet. <a routerLink="/search">Search for books</a> and add some!</p>
</ng-container>
<ng-template #hasFavorites>
  <div class="book-grid">
    <app-book-card *ngFor="let book of favoritesService.favorites" [book]="book"></app-book-card>
  </div>
</ng-template>
```

### Untyped Reactive Forms

```typescript
// v4-v9/src/app/pages/profile/profile.component.ts
export class ProfileComponent {
  profileForm: FormGroup; // ← Untyped! No generics.

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      displayName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    });
  }
}
```

### HttpClient with subscribe()

```typescript
// v4-v9/src/app/pages/book-detail/book-detail.component.ts
private fetchBook(id: string): void {
  this.isLoading = true;
  this.http
    .get<GoogleBookItem>(`http://localhost:3000/volumes/${id}`)
    .subscribe({
      next: (item) => {
        this.book = mapToBook(item);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
      },
    });
}
```

### Profile Service with BehaviorSubject + localStorage

```typescript
// v4-v9/src/app/services/profile.service.ts
@Injectable({ providedIn: "root" })
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(this.loadFromStorage());
  profile$ = this.profileSubject.asObservable();

  get profile(): UserProfile | null {
    return this.profileSubject.getValue();
  }

  setProfile(profile: UserProfile): void {
    this.profileSubject.next(profile);
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }
}
```

## Baseline Patterns Summary

| Pattern      | v4-v9 Approach                               |
| ------------ | -------------------------------------------- |
| Organization | NgModules                                    |
| DI           | Constructor injection                        |
| Guards       | Class-based (`implements CanActivate`)       |
| Control flow | `*ngIf`, `*ngFor`, `ng-template`             |
| Forms        | Untyped `FormGroup`                          |
| State        | `BehaviorSubject` + `.asObservable()`        |
| HTTP         | `HttpClient.get().subscribe()`               |
| Bootstrap    | `platformBrowserDynamic().bootstrapModule()` |
| Lazy loading | `loadChildren` → module                      |
| Testing      | Karma + Jasmine                              |
