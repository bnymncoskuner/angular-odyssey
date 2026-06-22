# Angular Odyssey: From Modules to Signals

A presentation demo showcasing how Angular has evolved from version 4 to version 22. The same Google Books search application is implemented across six version milestones, each using the **actual Angular version** of its era — ensuring correctness by construction.

## Project Structure

Each milestone is a fully independent Angular project with its own dependencies:

```
angular-odyssey/
├── slides/      → Reveal.js presentation (served on :8080)
├── api/         → Mock Google Books API (Node 20, Express)       :3000
├── v4-v9/       → Angular 9  (Node 12)  — NgModules, class guards, RxJS HTTP  :4200
├── v10-v13/     → Angular 13 (Node 16)  — Strict mode, typed forms, Ivy       :4201
├── v14-v16/     → Angular 16 (Node 18)  — Standalone, inject(), signals       :4202
├── v17-v19/     → Angular 19 (Node 20)  — @if/@for/@defer, signals stable     :4203
├── v20-v21/     → Angular 21 (Node 22)  — Zoneless, httpResource, signal forms :4204
├── v22/         → Angular 22 (Node 22)  — @Service(), injectAsync(), OnPush    :4205
├── docs/        → Blog post summaries and reference material
├── start-all.sh → Starts all apps + API + slides server
└── stop-all.sh  → Stops all background processes
```

## Version Compatibility Matrix

| Milestone | Angular CLI | Angular | Node.js  | TypeScript | RxJS             |
| --------- | ----------- | ------- | -------- | ---------- | ---------------- |
| v4-v9     | ~9.1.15     | ~9.1.13 | 12.x     | ~3.8.x     | ^6.5.5           |
| v10-v13   | ~13.3.0     | ~13.3.0 | 16.x     | ~4.6.x     | ^6.5.5 or ^7.4.0 |
| v14-v16   | ~16.0.0     | ~16.0.0 | 18.x     | ~5.0.x     | ^6.5.5 or ^7.4.0 |
| v17-v19   | ~19.0.0     | ~19.x   | 20.x     | ~5.6.x     | ^6.5.5 or ^7.4.0 |
| v20-v21   | ~21.x       | ~21.x   | 22.22.3+ | ~5.9.x     | ~7.8.0           |
| v22       | ~22.0.1     | ~22.0.1 | 22.22.3+ | ~6.0.2     | ~7.8.0           |

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- npm (comes with Node)

### Install Required Node Versions

```bash
nvm install 12
nvm install 16
nvm install 18
nvm install 20
nvm install 22.22.3
```

## Quick Start

### Start Everything at Once

```bash
./start-all.sh
```

This starts the slides server (port 8080), the API (port 3000), and all 6 Angular apps (ports 4200–4205). Uses nvm to switch Node versions automatically. Press Ctrl+C to stop all.

### Or Start Individually

#### 1. Start the API Server (required)

All milestone apps connect to a shared mock Google Books API:

```bash
cd api
nvm use         # switches to Node 20
npm install     # first time only
npm start       # runs on http://localhost:3000
```

The API provides:

- `GET /volumes?q={query}&startIndex={n}&maxResults={n}` — Search books
- `GET /volumes/:id` — Get a single book by ID
- `GET /volumes/:id/related` — Get related books

#### 2. Run a Milestone App

Each project is configured on a unique port so they can all run simultaneously:

```bash
cd v4-v9 && nvm use && ng serve        # http://localhost:4200
cd v10-v13 && nvm use && ng serve      # http://localhost:4201
cd v14-v16 && nvm use && ng serve      # http://localhost:4202
cd v17-v19 && nvm use && ng serve      # http://localhost:4203
cd v20-v21 && nvm use && ng serve      # http://localhost:4204
cd v22 && nvm use && ng serve          # http://localhost:4205
```

First time setup for each project:

```bash
cd <folder>
nvm use         # switches to the correct Node version via .nvmrc
npm install     # install dependencies (first time only)
ng serve        # serve the app on its configured port
```

#### Port Assignments

| Project | Port | URL                   |
| ------- | ---- | --------------------- |
| Slides  | 8080 | http://localhost:8080 |
| API     | 3000 | http://localhost:3000 |
| v4-v9   | 4200 | http://localhost:4200 |
| v10-v13 | 4201 | http://localhost:4201 |
| v14-v16 | 4202 | http://localhost:4202 |
| v17-v19 | 4203 | http://localhost:4203 |
| v20-v21 | 4204 | http://localhost:4204 |
| v22     | 4205 | http://localhost:4205 |

## Presentation Guide

### Suggested Order

Start from the oldest version and progress forward to show the evolution:

1. **v4-v9** — The "classic" Angular era
2. **v10-v13** — Strict mode and Ivy
3. **v14-v16** — The standalone revolution
4. **v17-v19** — Control flow and signals
5. **v20-v21** — Zoneless, httpResource, signal forms
6. **v22** — The fully reactive, service-oriented future

### Key Talking Points Per Milestone

| Milestone   | Key Evolution Points                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **v4-v9**   | NgModules everywhere, `@Injectable` + constructor DI, class-based `CanActivate` guards, `*ngIf`/`*ngFor`, `BehaviorSubject` for state, Karma + Jasmine                                                                               |
| **v10-v13** | Strict mode by default, Ivy renderer, typed reactive forms, `strictTemplates`, ViewEngine removed                                                                                                                                    |
| **v14-v16** | `standalone: true` components, `inject()` function, `CanActivateFn` functional guards, Angular Signals (dev preview), esbuild (dev preview)                                                                                          |
| **v17-v19** | `@if`/`@for`/`@switch` control flow, `@defer` for lazy rendering, signals stable (`signal()`, `computed()`, `effect()`), `input()`, `output()`, `model()` for two-way binding, `rxResource`, Vite + esbuild default, SSR + hydration |
| **v20-v21** | Zoneless change detection (no zone.js), `httpResource()` for reactive HTTP, `linkedSignal()`, Signal Forms (experimental), `rxResource` stable (`params`+`stream`), Vitest default, no file suffixes                                 |
| **v22**     | `@Service()` replaces `@Injectable`, `injectAsync()` for lazy DI, Signal Forms stable, `@boundary`/`@error`, OnPush default, arrow functions in templates, spread syntax in templates                                                |

### Side-by-Side Comparison Tips

Open two milestone folders side by side and compare:

- **Guards**: `auth.guard.ts` — class → functional → inject-based
- **State**: `state.service.ts` — BehaviorSubject → signals → linkedSignal
- **Templates**: `book-list.component.html` — `*ngFor` → `@for`
- **Forms**: `search.component.ts` — FormBuilder → typed forms → signal forms
- **Bootstrap**: `main.ts` — `bootstrapModule()` → `bootstrapApplication()` → zoneless

## The Application

Each milestone implements the same Google Books search app with:

- 🔍 **Book Search** — Search the Google Books API by keyword
- 📜 **Infinite Scroll** — Progressive loading as you scroll
- 📖 **Book Details** — Full book information view
- ⭐ **Favorites** — Save books to a favorites list (persisted in localStorage)
- 🔒 **Route Guard** — Favorites protected by a "set display name" guard
- 📦 **Lazy Loading** — Feature modules/components loaded on demand
- 📝 **Form Validation** — Real-time validation on search and profile forms
- 🗃️ **State Management** — Centralized state (evolves from RxJS to Signals)

## Official Blog Posts

- v5: https://blog.angular.dev/version-5-0-0-of-angular-now-available-37e414935ced
- v6: https://blog.angular.dev/version-6-of-angular-now-available-cc56b0efa7a4
- v7: https://blog.angular.dev/version-7-of-angular-cli-prompts-virtual-scroll-drag-and-drop-and-more-c594e22e7b8c
- v8: https://blog.angular.dev/version-8-of-angular-smaller-bundles-cli-apis-and-alignment-with-the-ecosystem-af0261112a27
- v9: https://blog.angular.dev/version-9-of-angular-now-available-project-ivy-has-arrived-23c97b63cfa3
- v10: https://blog.angular.dev/version-10-of-angular-now-available-78960babd41
- v11: https://blog.angular.dev/version-11-of-angular-now-available-74721b7952f7
- v12: https://blog.angular.dev/angular-v12-is-now-available-32ed51fbfd49
- v13: https://blog.angular.dev/angular-v13-is-now-available-cce66f7bc296
- v14: https://blog.angular.dev/angular-v14-is-now-available-391a6db736af
- v15: https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8
- v16: https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d
- v17: https://blog.angular.dev/introducing-angular-v17-4d7033312e4b
- v18: https://blog.angular.dev/angular-v18-is-now-available-e79d5ac0affe
- v19: https://blog.angular.dev/meet-angular-v19-7b29dfd05b84
- v20: https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301
- v21: https://blog.angular.dev/announcing-angular-v21-57946c34f14b
- v22: https://blog.angular.dev/announcing-angular-v22-c52bb83a4664

## License

MIT
