# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A code snippet manager with a React frontend and Express backend, sharing TypeScript types via a `shared/` directory.

## Commands

### Backend (`backend/`)
```bash
npm run dev          # Development server (tsx watch)
npm run build        # Production build (tsup → dist/index.cjs)
npm run db:push      # Push schema changes to local MySQL
npm run db:push:prod # Push schema changes to production MySQL
```

### Frontend (`frontend/`)
```bash
npm run dev     # Vite dev server (port 5173)
npm run build   # TypeScript check + Vite build
npm run lint    # ESLint
npm run preview # Preview production build
```

### Environment setup
- Backend: copy `.env.local` and configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `PORT`
- Frontend: `.env` must set `VITE_API_URL=http://localhost:3001`
- Requires a running MySQL instance

## Architecture

### Monorepo structure
- `frontend/` — React 19 + Vite SPA
- `backend/` — Express 5 API server
- `shared/types/` — TypeScript types shared by both sides

### Path aliases
- Frontend `@/` → `frontend/src/`
- Both sides `@shared/*` → `shared/*` (configured in `frontend/tsconfig.app.json` and `vite-tsconfig-paths`)

### Backend layers (Controller → Service → Repository)
- **Routes** (`src/routes/`): register Express routers for `/snippets`, `/tags`, `/categories`
- **Controllers** (`src/controllers/`): parse request/response, delegate to services
- **Services** (`src/services/`): business logic, validation, throws typed errors (`AppError` subclasses)
- **Repositories** (`src/repositories/`): Drizzle ORM queries against MySQL
- **Schema** (`src/lib/schema.ts`): Drizzle table definitions; migrations in `drizzle/`
- **Error handling**: `AppError` hierarchy → `errorHandler` middleware maps to HTTP status codes
- **Normalization**: `normalizeToDb`/`normalizeToFrontend` utilities called at the service layer for title casing

### Database
- MySQL with Drizzle ORM (mysql2 driver with connection pool)
- Tables: `snippets`, `category`, `tags`, `snippet_tags` (junction)
- Tag updates use a delete-then-reinsert strategy in `SnippetService.update()`
- SQL migrations are in `backend/drizzle/`; use `db:push` during development

### Frontend state management
- **TanStack Query** (`@tanstack/react-query`): all server state; hooks in `src/hooks/` (useSnippets, useCategories, useTags)
- **SnippetContext** (`src/contexts/SnippetContext.tsx`): client-side filtering by category, tags, search text, and tracking the selected snippet. Filtering is applied in sequence: category → tags → search.
- Mutations use optimistic updates (create/update) with rollback on error
- **Services** (`src/services/`): thin fetch wrappers that call `VITE_API_URL`

### Frontend UI
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- UI primitives in `src/components/ui/` — mix of shadcn-style components and Base UI (`@base-ui/react`)
- Monaco Editor for code editing (`@monaco-editor/react`)
- React Compiler enabled via `babel-plugin-react-compiler`
- PWA via `vite-plugin-pwa` with NetworkFirst caching for API calls; production backend is `snippets-manager.onrender.com`
