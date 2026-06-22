# Angular v17-v19 Era (2023-2024) — Control Flow & Signals

This milestone represents Angular's shift to a reactive-first architecture. Built-in control flow (`@if`, `@for`) replaces structural directives, Signals replace BehaviorSubject for state management, and `@defer` blocks enable declarative lazy rendering. The template syntax becomes cleaner and more intuitive.

## Key Features

- **Built-in control flow** (`@if`, `@for`, `@switch`) — replaces `*ngIf`/`*ngFor` directives
- **`@defer` blocks** — lazy rendering with viewport/idle/timer triggers
- **Signals stable** — `signal()`, `computed()`, `effect()` for reactive state
- **Signal inputs** — `input.required<T>()` replaces `@Input()` decorator
- **`provideZoneChangeDetection()`** — explicit zone configuration
- **Vite + esbuild** as default build system
- **Vitest** support (experimental in v19)
- **`linkedSignal()`** (experimental in v19)
- **`resource()`** API (experimental in v19)
- **No more BehaviorSubject needed** — signals handle state natively
- **No `standalone: true` needed** — standalone is the default (v19+)

## Code Examples

### Built-in Control Flow (@if, @for)

```typescript
// v17-v19/src/app/pages/favorites/favorites.component.ts
@Component({
  selector: "app-favorites",
  imports: [BookCardComponent, RouterLink],
  template: `
    <h1>My Favorites</h1>
    @if (favoritesService.favorites().length === 0) {
      <p class="empty">No favorites yet. <a routerLink="/search">Search for books</a> and add some!</p>
    } @else {
      <div class="book-grid">
        @for (book of favoritesService.favorites(); track book.id) {
          <app-book-card [book]="book" />
        }
      </div>
    }
  `,
})
export class FavoritesComponent {
  protected readonly favoritesService = inject(FavoritesService);
}
```

### @defer Blocks (Lazy Rendering)

```typescript
// v17-v19/src/app/pages/book-detail/book-detail.component.ts
@defer (on viewport; prefetch on idle) {
  <app-related-books [bookId]="id()" />
} @placeholder (minimum 1s) {
  <div class="related-placeholder">
    <h2>Related Books</h2>
    <p>Scroll down to load recommendations...</p>
  </div>
} @loading (minimum 1s) {
  <div class="related-placeholder">
    <h2>Related Books</h2>
    <div class="loading-shimmer"></div>
  </div>
}
```

### Signal-Based State Management

```typescript
// v17-v19/src/app/services/book-search.service.ts
@Injectable({ providedIn: "root" })
export class BookSearchService {
  private readonly http = inject(HttpClient);

  readonly query = signal("");
  readonly books = signal<Book[]>([]);
  readonly totalItems = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<unknown>(null);

  readonly hasMore = computed(() => this.books().length < this.totalItems());

  search(query: string): void {
    this.query.set(query);
    this.books.set([]);
    this.totalItems.set(0);
    this.error.set(null);
    this.fetchPage(0);
  }

  loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.fetchPage(this.books().length);
  }
}
```

### Signal Inputs with input.required()

```typescript
// v17-v19/src/app/pages/book-detail/book-detail.component.ts
export class BookDetailComponent {
  id = input.required<string>(); // ← Route param bound via withComponentInputBinding()

  private http = inject(HttpClient);
  private favoritesService = inject(FavoritesService);

  readonly bookData = signal<Book | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<unknown>(null);

  book = computed(() => this.bookData());
  isFavorite = this.favoritesService.isFavorite(this.book);

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.fetchBook(id);
      }
    });
  }
}
```

### effect() for Side Effects (localStorage Sync)

```typescript
// v17-v19/src/app/services/favorites.service.ts
@Injectable({ providedIn: "root" })
export class FavoritesService {
  private readonly profileService = inject(ProfileService);
  readonly favorites = signal<Book[]>([]);

  constructor() {
    // Load favorites when profile changes
    effect(() => {
      const profile = this.profileService.profile();
      if (profile) {
        this.favorites.set(this.loadFromStorage(profile.displayName));
      } else {
        this.favorites.set([]);
      }
    });

    // Persist favorites when they change
    effect(() => {
      const profile = this.profileService.profile();
      const favs = this.favorites();
      if (profile) {
        localStorage.setItem(this.storagePrefix + profile.displayName, JSON.stringify(favs));
      }
    });
  }
}
```

### Reactive Forms (Still Used, with inject())

```typescript
// v17-v19/src/app/pages/profile/profile.component.ts
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileForm = this.fb.group({
    firstName: [this.profileService.profile()?.firstName ?? "", [Validators.required, Validators.minLength(2)]],
    lastName: [this.profileService.profile()?.lastName ?? "", [Validators.required, Validators.minLength(2)]],
    email: [this.profileService.profile()?.email ?? "", [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    displayName: [this.profileService.profile()?.displayName ?? "", [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
  });
}
```

### App Config with Zone Change Detection

```typescript
// v17-v19/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()), provideHttpClient()],
};
```

## What Changed from v14-v16

### *ngIf / *ngFor → @if / @for

```html
<!-- v14-v16: Structural directives -->
<ng-container *ngIf="favoritesService.favorites.length === 0; else hasFavorites">
  <p class="empty">No favorites yet.</p>
</ng-container>
<ng-template #hasFavorites>
  <div class="book-grid">
    <app-book-card *ngFor="let book of favoritesService.favorites" [book]="book"></app-book-card>
  </div>
</ng-template>

<!-- v17-v19: Built-in control flow -->
@if (favoritesService.favorites().length === 0) {
<p class="empty">No favorites yet.</p>
} @else {
<div class="book-grid">
  @for (book of favoritesService.favorites(); track book.id) {
  <app-book-card [book]="book" />
  }
</div>
}
```

### BehaviorSubject → signal()

```typescript
// v14-v16: BehaviorSubject pattern
private booksSubject = new BehaviorSubject<Book[]>([]);
private isLoadingSubject = new BehaviorSubject<boolean>(false);
books$ = this.booksSubject.asObservable();
isLoading$ = this.isLoadingSubject.asObservable();

get books(): Book[] { return this.booksSubject.getValue(); }

search(query: string): void {
  this.booksSubject.next([]);
}

// v17-v19: Signals
readonly books = signal<Book[]>([]);
readonly isLoading = signal(false);
readonly hasMore = computed(() => this.books().length < this.totalItems());

search(query: string): void {
  this.books.set([]);
}
```

### @Input() → input.required()

```typescript
// v14-v16: Decorator-based input
export class BookDetailComponent {
  @Input() id!: string; // or read from ActivatedRoute
}

// v17-v19: Signal input
export class BookDetailComponent {
  id = input.required<string>(); // reactive, typed, required
}
```

### Manual localStorage → effect()

```typescript
// v14-v16: Manual persistence in each method
setProfile(profile: UserProfile): void {
  this.profileSubject.next(profile);
  localStorage.setItem(this.storageKey, JSON.stringify(profile));  // manual sync
}

// v17-v19: Automatic persistence via effect()
readonly profile = signal<UserProfile | null>(this.loadFromStorage());
constructor() {
  effect(() => {
    const p = this.profile();
    if (p) localStorage.setItem(this.storageKey, JSON.stringify(p));
    else localStorage.removeItem(this.storageKey);
  });
}
```

### No @defer → @defer Blocks

```html
<!-- v14-v16: Component always loaded eagerly in template -->
<app-related-books [bookId]="bookId"></app-related-books>

<!-- v17-v19: Deferred loading with triggers -->
@defer (on viewport; prefetch on idle) {
<app-related-books [bookId]="id()" />
} @placeholder (minimum 1s) {
<p>Scroll down to load recommendations...</p>
}
```

### What Stayed the Same from v14-v16

| Pattern                       | Still Used in v17-v19                              |
| ----------------------------- | -------------------------------------------------- |
| Standalone components         | ✅ (now the default, no `standalone: true` needed) |
| `inject()` function           | ✅ Same                                            |
| Functional guards             | ✅ Same                                            |
| `bootstrapApplication()`      | ✅ Same                                            |
| `loadComponent`               | ✅ Same                                            |
| Reactive Forms (`fb.group()`) | ✅ Same                                            |

### What's New

| Feature                        | Replaces                              |
| ------------------------------ | ------------------------------------- |
| `@if` / `@for` / `@switch`     | `*ngIf` / `*ngFor` / `[ngSwitch]`     |
| `@defer`                       | Eager component loading               |
| `signal()` / `computed()`      | `BehaviorSubject` / `.asObservable()` |
| `effect()`                     | Manual side-effect code               |
| `input.required<T>()`          | `@Input()` decorator                  |
| Vite + esbuild                 | Webpack                               |
| `provideZoneChangeDetection()` | Implicit zone.js                      |
