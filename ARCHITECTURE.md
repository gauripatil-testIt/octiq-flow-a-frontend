# Octiq Enterprise — Flow A: Employee Management UI — Architecture

## Tech Stack

| Layer   | Choice                         | Why                                                   |
| ------- | ------------------------------ | ----------------------------------------------------- |
| UI      | React 18 + TypeScript          | Component model, type safety                          |
| Routing | React Router v6                | File-based + nested routes                            |
| Forms   | React Hook Form + Zod          | Performant, schema-validated                          |
| Styling | Tailwind CSS                   | Utility-first, design-token-friendly                  |
| State   | URL params + local state       | Server state lives in the URL; no global store needed |
| Mocking | In-memory stub (VITE_USE_MOCK) | Zero-backend dev without extra tooling                |
| Testing | Vitest + Testing Library       | Fast, jsdom-based unit + integration tests            |
| E2E     | Playwright                     | Real-browser smoke tests (`npm run test:e2e`)         |
| Build   | Vite 5                         | Sub-second HMR, native ESM                            |

## Folder Structure

```
src/
├── app/              # Router, global providers, App.tsx
├── features/         # One folder per domain entity
│   └── <entity>/
│       ├── <Entity>ListPage.tsx
│       ├── <Entity>FormPage.tsx
│       ├── <Entity>DetailPage.tsx
│       ├── <entity>Api.ts      # All fetch logic for this entity
│       ├── index.ts             # Barrel re-exports
│       ├── <Entity>ListPage.test.tsx
│       └── <Entity>FormPage.test.tsx
├── shared/
│   ├── components/  # Reusable UI components (Button, Modal, …)
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Pure helpers (cn, constants, matchRowSearch)
└── test/
    └── setup.ts     # jest-dom matchers
```

## Key Design Decisions

### Mock-first development

`VITE_USE_MOCK=true` (default) — every entity API module has an in-memory stub seeded with realistic data. Set `VITE_USE_MOCK=false` in `.env` to call the real backend at `VITE_API_URL`.

### URL-driven table state

Pagination, sorting, and search are stored in URL search params (`?page=2&sort=name,asc&search=foo`). This makes table state bookmarkable and shareable with no extra state management.

### Design tokens over hardcoded colors

All color values come from CSS custom properties (`--color-*`) mapped to Tailwind classes (`text-foreground`, `bg-border/40`). Switching themes requires only changing the token values in `src/styles/theme.css`.

### Error boundaries

`GlobalErrorBoundary` wraps the router outlet. It increments a `resetKey` on "Try again" which forces children to remount via `React.Fragment key={resetKey}`, clearing all component state cleanly.

## Adding a New Entity

1. Add the entity to the spec JSON and re-run `synth generate`.
2. The generator creates `<Entity>ListPage`, `<Entity>FormPage`, `<Entity>DetailPage`, `<entity>Api`, and tests.
3. Wire the routes in `src/app/router.tsx` (already done by the generator).
4. Seed realistic data in `<entity>Api.ts` under `_store`.
