# Angular v22 Era (2026) — @Service(), injectAsync(), OnPush Default

This milestone represents Angular's service-oriented future. Building on the zoneless foundation from v20-v21, Angular 22 introduces `@Service()` as a cleaner replacement for `@Injectable`, `injectAsync()` for lazy dependency injection, stable Signal Forms, `@boundary`/`@error` for error handling, OnPush as the default change detection strategy, and arrow functions in templates.

## Key Features

- **Zoneless change detection** — no zone.js, `provideBrowserGlobalErrorListeners()` replaces zone error handling
- **`httpResource()`** — reactive HTTP without subscribe, auto-refetches when signals change
- **Signal Forms** — `form()`, `[formField]`, schema-based validation (replaces Reactive Forms)
- **Selectorless components** (v22) — no `selector` property needed in `@Component`
- **No file suffixes** — `app.ts` not `app.component.ts`, `profile.ts` not `profile.component.ts`
- **Class names without suffixes** — `BookDetail` not `BookDetailComponent`, `Favorites` not `FavoritesComponent`
- **`withComponentInputBinding()`** + `input.required()` for route params
- **`@defer` blocks** with `@placeholder` and `@loading`
- **Vitest** as default test runner
- **`effect()`** for side effects (localStorage sync)
- **Profile-scoped favorites** using signals

## Code Examples

### Zoneless Bootstrap (No zone.js!)

```typescript
// v22/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

```typescript
// v22/src/app/app.config.ts
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // ← replaces zone.js error handling
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
```

### httpResource() (Reactive HTTP Without Subscribe)

```typescript
// v22/src/app/pages/book-detail.ts
export class BookDetail {
  id = input.required<string>();

  private favoritesService = inject(FavoritesService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  // httpResource reactively fetches when id() changes — no subscribe!
  bookResource = httpResource<GoogleBookItem>(() => `http://localhost:3000/volumes/${this.id()}`);

  book = computed<Book | null>(() => {
    const item = this.bookResource.value();
    return item ? mapToBook(item) : null;
  });

  isFavorite = this.favoritesService.isFavorite(this.book);
}
```

### Signal Forms (Replaces Reactive Forms)

```typescript
// v22/src/app/pages/profile.ts
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <div class="profile-form">
      <div class="field">
        <label>First Name</label>
        <input type="text" [formField]="profileForm.firstName" placeholder="John" />
        @if (profileForm.firstName().touched() && profileForm.firstName().invalid()) {
          <span class="error">First name must be at least 2 characters</span>
        }
      </div>
      <!-- ... -->
      <button (click)="save()" [disabled]="profileForm().invalid()">
        Save & Continue to Favorites
      </button>
    </div>
  `,
})
export class Profile {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  private profileData = signal({
    firstName: this.profileService.profile()?.firstName ?? '',
    lastName: this.profileService.profile()?.lastName ?? '',
    email: this.profileService.profile()?.email ?? '',
    displayName: this.profileService.profile()?.displayName ?? '',
  });

  profileForm = form(this.profileData, (s) => {
    required(s.firstName);
    minLength(s.firstName, 2);

    required(s.lastName);
    minLength(s.lastName, 2);

    required(s.email);
    pattern(s.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    required(s.displayName);
    minLength(s.displayName, 2);
    maxLength(s.displayName, 30);
  });

  save(): void {
    if (this.profileForm().valid()) {
      const data = this.profileData();
      this.profileService.setProfile(data);
      this.router.navigate(['/favorites']);
    }
  }
}
```

### Selectorless Components

```typescript
// v22/src/app/pages/favorites.ts
@Component({
  // No `selector` property! Component is selectorless.
  imports: [BookCard, RouterLink],
  template: `
    <h1>My Favorites</h1>
    @if (favoritesService.favorites().length === 0) {
      <p class="empty">
        No favorites yet. <a routerLink="/search">Search for books</a> and add some!
      </p>
    } @else {
      <div class="book-grid">
        @for (book of favoritesService.favorites(); track book.id) {
          <app-book-card [book]="book" />
        }
      </div>
    }
  `,
})
export class Favorites {
  protected readonly favoritesService = inject(FavoritesService);
}
```

### No File Suffixes (v20 Style Guide)

```typescript
// v22/src/app/app.routes.ts
export const routes: Routes = [
  { path: 'search', loadComponent: () => import('./pages/search').then((m) => m.Search) },
  {
    path: 'books/:id',
    loadComponent: () => import('./pages/book-detail').then((m) => m.BookDetail),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites').then((m) => m.Favorites),
    canActivate: [authGuard],
  },
  { path: 'profile', loadComponent: () => import('./pages/profile').then((m) => m.Profile) },
];
```

### effect() for Automatic Persistence

```typescript
// v22/src/app/services/favorites.service.ts
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly profileService = inject(ProfileService);
  readonly favorites = signal<Book[]>([]);

  constructor() {
    effect(() => {
      const profile = this.profileService.profile();
      if (profile) {
        this.favorites.set(this.loadFromStorage(profile.displayName));
      } else {
        this.favorites.set([]);
      }
    });

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

### Signal-Based Profile Service

```typescript
// v22/src/app/services/profile.service.ts
@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly profile = signal<UserProfile | null>(this.loadFromStorage());

  constructor() {
    effect(() => {
      const p = this.profile();
      if (p) {
        localStorage.setItem(this.storageKey, JSON.stringify(p));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    });
  }

  hasDisplayName(): boolean {
    const p = this.profile();
    return !!p && p.displayName.trim().length > 0;
  }

  setProfile(profile: UserProfile): void {
    this.profile.set(profile);
  }
}
```

## What Changed from v17-v19

### Reactive Forms → Signal Forms

```typescript
// v17-v19: Reactive Forms with FormBuilder
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

profileForm = this.fb.group({
  firstName: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
});

// Template: formControlName="firstName"
// Validation: profileForm.get('firstName')?.invalid

// v22: Signal Forms
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';

private profileData = signal({ firstName: '', email: '' });
profileForm = form(this.profileData, (s) => {
  required(s.firstName);
  minLength(s.firstName, 2);
  required(s.email);
  pattern(s.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

// Template: [formField]="profileForm.firstName"
// Validation: profileForm.firstName().invalid()
```

### HttpClient + subscribe() → httpResource()

```typescript
// v17-v19: Manual HTTP with subscribe
readonly bookData = signal<Book | null>(null);
readonly isLoading = signal(false);

constructor() {
  effect(() => {
    const id = this.id();
    if (id) this.fetchBook(id);
  });
}

private fetchBook(id: string): void {
  this.isLoading.set(true);
  this.http.get<GoogleBookItem>(`http://localhost:3000/volumes/${id}`)
    .subscribe({
      next: (item) => { this.bookData.set(mapToBook(item)); this.isLoading.set(false); },
      error: (err) => { this.error.set(err); this.isLoading.set(false); },
    });
}

// v22: httpResource (reactive, no subscribe!)
bookResource = httpResource<GoogleBookItem>(() => `http://localhost:3000/volumes/${this.id()}`);
book = computed<Book | null>(() => {
  const item = this.bookResource.value();
  return item ? mapToBook(item) : null;
});
// isLoading: bookResource.isLoading()
// error: bookResource.error()
```

### Zone.js → Zoneless

```typescript
// v17-v19: Zone-based change detection
import { provideZoneChangeDetection } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // ...
  ],
};

// v22: Zoneless (no zone.js at all!)
import { provideBrowserGlobalErrorListeners } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // handles errors without zone.js
    // ...
  ],
};
```

### File Naming: Suffixed → No Suffix

```
v17-v19/                          v22/
├── app.component.ts              ├── app.ts
├── pages/                        ├── pages/
│   ├── favorites/                │   ├── favorites.ts
│   │   └── favorites.component.ts│   ├── profile.ts
│   ├── profile/                  │   ├── book-detail.ts
│   │   └── profile.component.ts  │   └── search.ts
│   └── book-detail/              └── ...
│       └── book-detail.component.ts
```

### Class Names: Suffixed → No Suffix

```typescript
// v17-v19
export class FavoritesComponent {}
export class BookDetailComponent {}
export class ProfileComponent {}

// v22
export class Favorites {}
export class BookDetail {}
export class Profile {}
```

### Selectors: Required → Optional (Selectorless)

```typescript
// v17-v19
@Component({
  selector: 'app-favorites',
  imports: [BookCardComponent, RouterLink],
  template: `...`,
})
export class FavoritesComponent {}

// v22: No selector needed for routed components
@Component({
  imports: [BookCard, RouterLink],
  template: `...`,
})
export class Favorites {}
```

### What Stayed the Same from v17-v19

| Pattern                                | Still Used in v22 |
| -------------------------------------- | ----------------- |
| `@if` / `@for` control flow            | ✅ Same           |
| `@defer` blocks                        | ✅ Same           |
| `signal()` / `computed()` / `effect()` | ✅ Same           |
| `input.required<T>()`                  | ✅ Same           |
| `inject()` function                    | ✅ Same           |
| Functional guards                      | ✅ Same           |
| `bootstrapApplication()`               | ✅ Same           |
| `loadComponent`                        | ✅ Same           |

### What's New

| Feature                                           | Replaces                                         |
| ------------------------------------------------- | ------------------------------------------------ |
| Zoneless (`provideBrowserGlobalErrorListeners()`) | `provideZoneChangeDetection()` + zone.js         |
| `httpResource()`                                  | `HttpClient.get().subscribe()`                   |
| Signal Forms (`form()`, `[formField]`)            | Reactive Forms (`fb.group()`, `formControlName`) |
| Selectorless components                           | `selector: 'app-...'`                            |
| No file suffixes (`profile.ts`)                   | `profile.component.ts`                           |
| No class suffixes (`Profile`)                     | `ProfileComponent`                               |
| Vitest                                            | Karma + Jasmine                                  |
