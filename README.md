# Octiq Enterprise — Flow A: Employee Management UI

Generated React application.

## Prerequisites

- Node.js 20+
- npm 10+

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available scripts

| Script                  | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start development server                    |
| `npm run build`         | Type-check and build for production         |
| `npm run preview`       | Preview production build locally            |
| `npm run typecheck`     | Run TypeScript type checks                  |
| `npm run lint`          | Lint with ESLint (zero warnings)            |
| `npm run format`        | Format code with Prettier                   |
| `npm run test`          | Run tests once with Vitest                  |
| `npm run test:watch`    | Run tests in watch mode                     |
| `npm run test:coverage` | Run tests and generate coverage report      |
| `npm run quality`       | Run typecheck + lint + format check + tests |

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable        | Default | Description                                       |
| --------------- | ------- | ------------------------------------------------- |
| `VITE_USE_MOCK` | `true`  | Use in-memory mock data instead of a real backend |

## Project structure

```
src/
├── app/               # Router, context providers
├── components/        # Shared layout components
├── features/          # Feature modules (one folder per entity)
│   └── <entity>/
│       ├── index.ts              # Barrel exports
│       ├── <Entity>ListPage.tsx
│       ├── <Entity>FormPage.tsx
│       ├── <Entity>DetailPage.tsx
│       └── <entity>Api.ts
├── shared/
│   ├── components/    # Reusable UI primitives
│   └── utils/         # Utility functions
└── styles/            # Global CSS / design tokens
```
