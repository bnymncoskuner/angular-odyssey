# Angular v10-v13 Era (2020-2022) — Strict Mode & Ivy

This milestone represents the Ivy era — Angular's new rendering engine became the default in v9 and the old ViewEngine was fully removed in v13. The architecture remains the same as v4-v9 (NgModules, constructor DI, class guards), but with significantly stricter type checking and the foundation for future standalone APIs.

## Key Features

- **Ivy rendering engine** — default since v9, ViewEngine fully removed in v13
- **Strict mode** — `strictTemplates`, stricter type checking in templates
- **Typed reactive forms** — Angular 13 infers types from `fb.group()` (no explicit `FormGroup` annotation needed)
- **`strictInjectionParameters`** — enforces explicit `@Inject()` or type annotations
- **IE11 support dropped** (v13) — enables modern JavaScript output
- **Persistent build cache** — `.angular/cache` directory for faster rebuilds
- **Optional chaining in templates** — `?.` operator now works in template expressions
- **Same architectural patterns as v4-v9** — still uses NgModules, class guards, constructor DI

## Code Examples

### NgModule (Same Pattern as v4-v9)

```typescript
// v10-v13/src/app/app.module.ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Module-Based Bootstrap (Same as v4-v9)

```typescript
// v10-v13/src/main.ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

### Class-Based Guard (Same Pattern)

```typescript
// v10-v13/src/app/guards/auth.guard.ts
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

### Typed Reactive Forms (Key Difference from v4-v9)

```typescript
// v10-v13/src/app/pages/profile/profile.component.ts
export class ProfileComponent {
  profileForm; // ← Type inferred! No explicit FormGroup annotation needed.

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: [this.profileService.profile?.firstName ?? "", [Validators.required, Validators.minLength(2)]],
      lastName: [this.profileService.profile?.lastName ?? "", [Validators.required, Validators.minLength(2)]],
      email: [this.profileService.profile?.email ?? "", [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      displayName: [this.profileService.profile?.displayName ?? "", [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    });
  }

  save(): void {
    if (this.profileForm.valid) {
      const data = this.profileForm.getRawValue();
      // data.firstName is typed as `string | null` — strict!
      this.profileService.setProfile({
        firstName: data.firstName!,
        lastName: data.lastName!,
        email: data.email!,
        displayName: data.displayName!,
      });
    }
  }
}
```

### Optional Chaining in Templates

```html
<!-- v10-v13 templates can use ?. operator -->
<span *ngIf="profileForm.get('firstName')?.touched && profileForm.get('firstName')?.invalid" class="error"> First name must be at least 2 characters </span>
```

### BehaviorSubject with Stricter Types

```typescript
// v10-v13/src/app/services/book-search.service.ts
@Injectable({ providedIn: "root" })
export class BookSearchService {
  private errorSubject = new BehaviorSubject<unknown>(null); // ← `unknown` instead of `any`

  constructor(private http: HttpClient) {}

  private fetchPage(startIndex: number): void {
    this.http.get<GoogleBooksApiResponse>(/* ... */).subscribe({
      next: (response) => {
        const newBooks = (response.items ?? []).map(mapToBook); // ← nullish coalescing
        // ...
      },
    });
  }
}
```

### Lazy Loading (Same Pattern as v4-v9)

```typescript
// v10-v13/src/app/app-routing.module.ts
const routes: Routes = [
  { path: "search", loadChildren: () => import("./pages/search/search.module").then((m) => m.SearchModule) },
  { path: "favorites", loadChildren: () => import("./pages/favorites/favorites.module").then((m) => m.FavoritesModule), canActivate: [AuthGuard] },
];
```

## What Changed from v4-v9

### Forms: Untyped → Typed

```typescript
// v4-v9: Explicit untyped FormGroup
profileForm: FormGroup;  // type is `FormGroup` — all values are `any`
this.profileForm = this.fb.group({ ... });
const data = this.profileForm.getRawValue();  // data is `any`

// v10-v13: Type inference from fb.group()
profileForm;  // type is inferred as FormGroup<{ firstName: FormControl<string | null>, ... }>
this.profileForm = this.fb.group({ ... });
const data = this.profileForm.getRawValue();  // data.firstName is `string | null`
```

### Template Expressions: No Optional Chaining → Optional Chaining

```html
<!-- v4-v9: No optional chaining, must use && guards -->
<span *ngIf="profileForm.get('firstName').touched && profileForm.get('firstName').invalid">
  <!-- v10-v13: Optional chaining works in templates -->
  <span *ngIf="profileForm.get('firstName')?.touched && profileForm.get('firstName')?.invalid"></span
></span>
```

### Error Types: `any` → `unknown`

```typescript
// v4-v9
private errorSubject = new BehaviorSubject<any>(null);

// v10-v13 (strict mode)
private errorSubject = new BehaviorSubject<unknown>(null);
```

### Nullish Coalescing in Code

```typescript
// v4-v9
const items = response.items || [];
const thumbnail = (info.imageLinks && info.imageLinks.thumbnail) || "";

// v10-v13
const items = response.items ?? [];
const thumbnail = info.imageLinks?.thumbnail ?? "";
```

### What Stayed the Same

| Pattern                    | Still Used in v10-v13 |
| -------------------------- | --------------------- |
| NgModules                  | ✅ Same               |
| Constructor DI             | ✅ Same               |
| Class-based guards         | ✅ Same               |
| `*ngIf` / `*ngFor`         | ✅ Same               |
| BehaviorSubject            | ✅ Same               |
| `loadChildren` → module    | ✅ Same               |
| `platformBrowserDynamic()` | ✅ Same               |
| Karma + Jasmine            | ✅ Same               |

### What's New

| Feature                        | Impact                                         |
| ------------------------------ | ---------------------------------------------- |
| Ivy renderer                   | Smaller bundles, faster compilation            |
| Strict templates               | Catches type errors in templates at build time |
| Typed forms                    | `getRawValue()` returns typed objects          |
| Optional chaining in templates | Cleaner null-safe expressions                  |
| Persistent build cache         | Faster rebuilds via `.angular/cache`           |
| IE11 dropped (v13)             | Modern JS output, smaller bundles              |
