# Angular Official Blog Post Summaries

Reference document for the Angular Odyssey presentation.

## v5 (November 2017)

**Key Features:**

- Build optimizer for smaller production bundles
- HttpClient moved to `@angular/common/http`
- Animations improvements (no longer require web-animations polyfill)
- Internationalized number, date, and currency pipes
- Exported zone.js as a proper dependency
- Angular Universal state transfer

**Notable for presentation:** First release to focus heavily on build/bundle optimization — sets the stage for Angular's ongoing performance story.

## v6 (May 2018)

**Key Features:**

- Angular Elements (Web Components from Angular components)
- Tree-shakable providers (`providedIn: 'root'`)
- `ng update` and `ng add` CLI commands
- Angular Material + CDK stable components
- RxJS 6 (pipeable operators)
- Webpack 4 support
- Ivy announced (under active development, not yet available)

**Notable for presentation:** Tree-shakable providers introduced the `@Injectable({ providedIn: 'root' })` pattern still used today. CLI commands for updates became the standard migration path. Ivy was first publicly announced here.

## v7 (October 2018)

**Key Features:**

- Virtual scrolling (CDK `ScrollingModule`)
- Drag and drop (CDK `DragDropModule`)
- CLI prompts for schematics
- Performance improvements (reflect-metadata polyfill removed)
- Bundle budget defaults in CLI
- Angular Material updated to match Material Design spec
- Ivy still under active development (not yet available)

**Notable for presentation:** CDK virtual scrolling is directly relevant to the infinite scroll feature in the demo app. Ivy timeline: announced v6, still in development v7, preview in v8.

## v8 (May 2019)

**Key Features:**

- Differential loading (separate es5/es2015 bundles)
- Dynamic imports for lazy routes (replacing string-based `loadChildren`)
- Ivy preview (opt-in via flag)
- Web Worker generation support
- TypeScript 3.4 support
- Bazel builder (opt-in preview)

**Notable for presentation:** Dynamic imports for lazy loading is the pattern used in the v4-v9 demo. Ivy preview signaled the biggest internal rewrite since Angular 2.

## v9 (February 2020)

**Key Features:**

- Ivy enabled by default
- Smaller bundles (30% reduction for small apps)
- Faster tests (40-50% improvement)
- AOT compilation by default in dev mode
- Improved debugging with `ng` global object
- Component test harnesses (Material)
- TestBed improvements (auto-teardown)
- TypeScript 3.8

**Notable for presentation:** Ivy becoming default is the last major feature of the v4-v9 milestone. The rendering engine rewrite enabled everything that followed (standalone, signals, etc.).

## v10 (June 2020)

**Key Features:**

- Strict mode opt-in (`ng new --strict`)
- Date range picker (Angular Material)
- Warnings for CommonJS imports
- New default browser config (no IE9/IE10)
- TypeScript 3.9
- Optional stricter settings for new projects

**Notable for presentation:** Strict mode opt-in planted the seed for strict-by-default in v12, leading to better type safety throughout the framework.

## v11 (November 2020)

**Key Features:**

- Automatic font inlining for performance
- Component test harnesses updates
- HMR (Hot Module Replacement) support via CLI flag
- Faster builds with updated language service
- Stricter types for pipes and forms
- Webpack 5 opt-in

**Notable for presentation:** Incremental DX improvements — HMR and font inlining show Angular investing in developer experience.

## v12 (May 2021)

**Key Features:**

- Ivy everywhere (View Engine deprecated)
- Webpack 5 default
- Inline Sass support in `styles` metadata
- Strict mode by default for new apps
- Nullish coalescing (`??`) in templates
- Tailwind CSS support
- `ng build` produces production bundles by default

**Notable for presentation:** Nullish coalescing in templates is visible in the v10-v13 milestone. Strict mode by default marks Angular's commitment to type safety.

## v13 (November 2021)

**Key Features:**

- View Engine fully removed
- IE11 support dropped
- Persistent build cache (`.angular/cache`)
- Dynamic component creation simplified (no `ComponentFactoryResolver`)
- TypeScript 4.4
- Angular APF (Angular Package Format) updated
- RxJS 7.4 support

**Notable for presentation:** Dropping IE11 and View Engine removal were breaking changes that enabled modern JS output and smaller bundles — cleanup that made future innovations possible.

## v14 (June 2022)

**Key Features:**

- Standalone components (developer preview)
- Strictly typed reactive forms
- `inject()` function for DI
- Extended diagnostics (template warnings)
- CDK menu and dialog primitives (stable)
- Page title from route config
- Optional injectors

**Notable for presentation:** Standalone components and `inject()` are the defining features of the v14-v16 milestone — the biggest architectural shift since Angular 2.

## v15 (November 2022)

**Key Features:**

- Standalone APIs stable
- Directive composition API
- Image directive (`NgOptimizedImage`) stable
- esbuild builder (developer preview)
- Functional router guards (`CanActivateFn`)
- Improved stack traces
- MDC-based Material components

**Notable for presentation:** Functional guards and stable standalone APIs complete the "standalone revolution." esbuild preview begins the move away from Webpack.

## v16 (May 2023)

**Key Features:**

- Angular Signals (developer preview) — `signal()`, `computed()`, `effect()`
- RxJS interop package (`@angular/core/rxjs-interop`) — `toSignal()`, `toObservable()`, `takeUntilDestroyed`
- Server-side rendering non-destructive hydration (developer preview) — up to 45% LCP improvement
- esbuild + Vite dev server (developer preview) — 72% faster cold production builds
- Required inputs (`@Input({ required: true })`)
- Router input binding (`withComponentInputBinding()`) — route data/params/query as component inputs
- `DestroyRef` for cleanup (`inject(DestroyRef)`)
- Self-closing tags in templates
- CSP nonce support for inline styles
- Jest support (experimental)
- Standalone migration schematics (`ng generate @angular/core:standalone`)

**Notable for presentation:** Signals are the most consequential addition since Ivy — they eventually replace RxJS for state management and enable zoneless change detection. RxJS interop (`toSignal`/`toObservable`) provides the bridge between signals and observables.

## v17 (November 2023)

**Key Features:**

- Built-in control flow (`@if`, `@for`, `@switch`) — developer preview
- Deferrable views (`@defer`) — developer preview
- Vite + esbuild as default builder
- New angular.dev docs site
- Hydration stable
- `@angular/ssr` package
- Standalone default for `ng generate`
- View transitions API support
- `@for` with mandatory `track` — up to 90% faster than `*ngFor` in benchmarks
- `afterRender` / `afterNextRender` lifecycle hooks
- Lazy loading animations module (`provideAnimationsAsync()`)

**Notable for presentation:** `@if`/`@for` replace `*ngIf`/`*ngFor` — the most visible template syntax change in Angular's history. `@defer` enables the lazy-loaded related-books section in the demo. Vite+esbuild becoming default brought up to 87% faster builds for hybrid rendering.

## v18 (May 2024)

**Key Features:**

- Zoneless change detection (experimental)
- Angular Material 3 stable
- Deferrable views stable
- Built-in control flow stable
- Signal inputs/queries/outputs (developer preview)
- Event replay (developer preview)
- angular.dev as official home
- `ng-content` fallback content

**Notable for presentation:** Control flow and deferrable views going stable means the v17-v19 milestone patterns are production-ready. Zoneless experimental previews Angular's future.

## v19 (November 2024)

**Key Features:**

- Incremental hydration (developer preview)
- `linkedSignal()` (experimental)
- `resource()` / `rxResource()` (experimental)
- Signal inputs/outputs/queries stable
- Event replay stable and enabled by default
- Route-level render mode (`RenderMode.Server`, `Client`, `Prerender`)
- HMR for styles (instant, enabled by default)
- Standalone as default (removed from metadata property)
- `@let` template variables stable
- Time picker (Material), 2D drag & drop (CDK)
- Schematics for migrating to signal inputs/outputs/queries
- Language service integration with schematics (quick fixes in IDE)

**Notable for presentation:** Signal inputs going stable completes the signal-based component model. `resource()` API previews the reactive data-fetching pattern used in v20-v21 and v22. HMR for styles brought instant edit/refresh without page reload.

## v20 (May 2025)

**Key Features:**

- `effect()`, `linkedSignal()`, `toSignal()` stable
- Zoneless (developer preview) with `provideBrowserGlobalErrorListeners()`
- Incremental hydration stable
- Route-level render mode stable
- `httpResource()` (experimental)
- Resource streaming
- Chrome DevTools Angular performance panel (via `ng.enableProfiling()`)
- Style guide: no file/class suffixes (no more `.component.ts`)
- Extended template expressions (`**`, `in`, untagged template literals)
- Vitest (experimental)
- `createComponent` with bindings and directives
- Deprecation of `*ngIf`, `*ngFor`, `*ngSwitch`
- Host binding type checking and language service support
- Angular mascot RFC

**Notable for presentation:** `httpResource()` replaces `HttpClient.subscribe()` in the v20-v21 demo — reactive HTTP without manual subscription. No-suffix style guide changes file naming conventions. `*ngIf`/`*ngFor`/`*ngSwitch` deprecated (removed in v22).

## v21 (November 2025)

**Key Features:**

- Signal Forms (experimental) — `form()`, `[formField]` directive (also `[field]` in early docs)
- Angular Aria (developer preview) — headless accessible components (12 patterns)
- Vitest stable and default test runner
- Zoneless default (no zone.js included by default)
- Angular MCP Server stable (7 tools for AI agents)
- CLDR v47
- Regex in templates
- Custom `IntersectionObserver` for `@defer`
- Signals formatter in DevTools
- Karma deprecated, Jest/Web Test Runner deprecated
- Angular mascot announced

**Notable for presentation:** Signal Forms and zoneless-by-default are the final pieces of the fully reactive Angular. The v20-v21 milestone showcases both: `form()` replaces `fb.group()`, zone.js is gone entirely. Vitest replaces Karma as default test runner.

## v22 (May 2026)

**Key Features:**

- Signal Forms stable (production ready, Angular Material + Aria support)
- Angular Aria stable (12 accessible headless UI patterns)
- `resource()` / `httpResource()` / `rxResource()` stable (async reactivity)
- `@Service()` decorator — replaces `@Injectable({ providedIn: 'root' })`
- `injectAsync()` — lazy-load services on demand (async DI, code splitting), supports `prefetch: onIdle`
- Selectorless components (no `selector` needed for routed components)
- `OnPush` is the default change detection strategy (no need to specify)
- `ChangeDetectionStrategy.Default` renamed to `ChangeDetectionStrategy.Eager`
- `@boundary` / `@error` blocks (developer preview Q3 2026) — error boundaries in templates
- Spread/rest syntax in templates (objects, arrays, function calls)
- Arrow functions in templates
- Multi-case `@switch` with exhaustive checks (`@default never`)
- Comments in HTML element attributes (`// comment`, `/* comment */`)
- Host directive de-duplication
- `NgIf`/`NgFor`/`NgSwitch` directives removed (deprecated in v20)
- TypeScript 6 support
- WebMCP (experimental) — tools for AI agents to interact with Angular apps
- Angular Agent Skills for AI coding assistants
- Router: Navigation API integration (`withExperimentalPlatformNavigation()`), auto-cleanup injectors
- Webpack deprecated in favor of application builder

**Notable for presentation:** `@Service()` and `injectAsync()` are demonstrated in the v22 demo app. `@Service()` simplifies DI decorator boilerplate, `injectAsync()` enables lazy-loading individual services (shown with ExportService on favorites page — separate chunk loaded only on click). `@boundary`/`@error` provides error boundaries similar to React's ErrorBoundary.
