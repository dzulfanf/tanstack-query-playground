# TanStack Query Playground — Foundation + Module 01 (Query Basics)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the TanStack Query Playground project and implement Module 01 (Query Basics) — a fully interactive learning playground teaching `useQuery`, loading/error/empty states, and the Query Cache lifecycle.

**Architecture:** Vite + React + TypeScript SPA with TanStack Query v5 and TanStack Router v1. Left panel = interactive Pokémon playground. Right panel = tabbed educational panels (Inspector, Activity, Insight, Diagram, Source Code). Module 01 uses PokéAPI directly — no mocking needed.

**Tech Stack:** React 18+, TypeScript 5 (strict), Vite 6, TanStack Query v5, TanStack Router v1, Tailwind CSS v4, shadcn/ui, Framer Motion, React Syntax Highlighter, TanStack Query Devtools, Vitest

## Global Constraints

- TanStack Query v5 API only — `status` is `'pending' | 'error' | 'success'` (not `'loading'`), `gcTime` not `cacheTime`
- Tailwind CSS v4 — CSS-first config, no `tailwind.config.ts` file, use `@import "tailwindcss"` in CSS
- Visual theme: white background, blue primary `#3B82F6`, yellow accent `#FACC15`, rounded-2xl cards, soft shadows
- PokéAPI base URL: `https://pokeapi.co/api/v2`
- No backend — all data from PokéAPI
- TypeScript strict mode enabled
- Every panel teaches exactly one concept
- All text in English
- **Every task must end with a git commit** — commit only the files touched in that task, not everything at once
- **Commits must NOT include `Co-Authored-By: Claude`** — do not add any AI co-author trailer to commit messages

---

## File Structure

```
tanstack-query-playground/
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .gitignore
├── src/
│   ├── main.tsx                            # App entry: providers + RouterProvider
│   ├── index.css                           # Tailwind v4 CSS-first import
│   ├── app/
│   │   ├── router.tsx                      # TanStack Router: root route + module-01 route
│   │   └── layout/
│   │       ├── Header.tsx                  # Module nav tabs + Learning Mode toggle
│   │       └── RootLayout.tsx              # Two-column shell (playground | panels)
│   ├── components/
│   │   └── ui/                             # shadcn auto-generated (Button, Card, Badge, Tabs, Skeleton, Toaster)
│   ├── shared/
│   │   ├── types/
│   │   │   └── pokemon.ts                  # PokéAPI response types
│   │   ├── services/
│   │   │   └── pokemon-api.ts              # fetchPokemonList, fetchPokemon
│   │   ├── lib/
│   │   │   ├── query-client.ts             # QueryClient instance with defaults
│   │   │   └── query-events.ts             # QueryCache event logger (subscribe helper)
│   │   └── hooks/
│   │       └── use-learning-mode.tsx       # Learning Mode React context + hook
│   └── features/
│       ├── pokemon/
│       │   ├── PokemonGrid.tsx             # useQuery list, renders card grid
│       │   ├── PokemonCard.tsx             # Single Pokémon card with sprite
│       │   ├── LoadingSkeleton.tsx         # Skeleton grid while pending
│       │   ├── ErrorState.tsx              # Error UI with retry button
│       │   └── EmptyState.tsx              # Empty state placeholder
│       ├── inspector/
│       │   └── QueryInspector.tsx          # Live query state display panel
│       ├── activity/
│       │   └── QueryActivity.tsx           # Timestamped query event timeline
│       └── module-01/
│           ├── Module01Page.tsx            # Wires playground + all right panels
│           └── panels/
│               ├── EngineeringInsight.tsx  # Problem → TanStack Solution content
│               ├── VisualDiagram.tsx       # Styled useQuery flow diagram
│               └── SourceCodePanel.tsx     # Syntax-highlighted useQuery code
└── tests/
    └── services/
        └── pokemon-api.test.ts             # Unit tests for fetch functions
```

---

## Task 1: Project Scaffolding + Dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/index.css`, `src/main.tsx` (empty), `.gitignore`

**Interfaces:**
- Produces: working `npm run dev` + `npm test`

- [ ] **Step 1: Scaffold Vite project**

Run in the project root (`tanstack-query-playground/`):
```bash
npm create vite@latest . -- --template react-ts
```
When prompted "Current directory is not empty. Remove existing files and continue?" choose Yes (only `prd.md` and `docs/` exist).

- [ ] **Step 2: Install all runtime dependencies**

```bash
npm install \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-router \
  framer-motion \
  react-syntax-highlighter
```

- [ ] **Step 3: Install all dev dependencies**

```bash
npm install -D \
  tailwindcss \
  @tailwindcss/vite \
  vitest \
  @vitejs/plugin-react \
  @types/react-syntax-highlighter
```

- [ ] **Step 4: Install shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Blue
- CSS variables: Yes

Then add the components we need:
```bash
npx shadcn@latest add button card badge tabs skeleton separator
```

- [ ] **Step 5: Configure Tailwind v4 in `vite.config.ts`**

Replace the generated file:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 6: Configure TypeScript paths in `tsconfig.app.json`**

Add to `compilerOptions`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 7: Set up Tailwind v4 CSS-first import in `src/index.css`**

Replace entire file with:
```css
@import "tailwindcss";

:root {
  --color-primary: #3B82F6;
  --color-accent: #FACC15;
}
```

- [ ] **Step 8: Add `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] **Step 9: Add test script to `package.json`**

In `package.json` scripts section, add:
```json
"test": "vitest"
```

- [ ] **Step 10: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server starts on `http://localhost:5173`, browser shows Vite + React boilerplate.

- [ ] **Step 11: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold project with Vite, TanStack Query, shadcn, Tailwind v4"
```

---

## Task 2: PokéAPI Types + Service Layer

**Files:**
- Create: `src/shared/types/pokemon.ts`
- Create: `src/shared/services/pokemon-api.ts`
- Create: `tests/services/pokemon-api.test.ts`

**Interfaces:**
- Produces:
  - `fetchPokemonList(limit?: number, offset?: number): Promise<PokemonListResponse>`
  - `fetchPokemon(idOrName: string | number): Promise<PokemonDetail>`
  - Types: `PokemonListResponse`, `PokemonListItem`, `PokemonDetail`, `PokemonType`, `PokemonStat`, `PokemonAbility`

- [ ] **Step 1: Write the types file**

`src/shared/types/pokemon.ts`:
```ts
export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonType {
  slot: number
  type: { name: string; url: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string; url: string }
}

export interface PokemonAbility {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export interface PokemonSprites {
  front_default: string | null
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  sprites: PokemonSprites
}
```

- [ ] **Step 2: Write failing tests first**

`tests/services/pokemon-api.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'

const mockListResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
}

const mockPokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  stats: [{ base_stat: 35, stat: { name: 'hp', url: '' } }],
  abilities: [{ ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 }],
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: { 'official-artwork': { front_default: 'https://example.com/pikachu-art.png' } },
  },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('fetchPokemonList', () => {
  it('fetches the list with default limit of 20', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockListResponse,
    } as Response)

    const result = await fetchPokemonList()

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    expect(result.results).toHaveLength(2)
    expect(result.count).toBe(1302)
  })

  it('accepts custom limit and offset', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockListResponse,
    } as Response)

    await fetchPokemonList(10, 40)

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=40')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch pokemon list: 500')
  })
})

describe('fetchPokemon', () => {
  it('fetches by name', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonDetail,
    } as Response)

    const result = await fetchPokemon('pikachu')

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
    expect(result.id).toBe(25)
    expect(result.name).toBe('pikachu')
  })

  it('fetches by numeric id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonDetail,
    } as Response)

    await fetchPokemon(25)

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25')
  })

  it('throws on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchPokemon('notapokemon')).rejects.toThrow('Failed to fetch pokemon notapokemon: 404')
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module '@/shared/services/pokemon-api'`

- [ ] **Step 4: Implement the service**

`src/shared/services/pokemon-api.ts`:
```ts
import type { PokemonListResponse, PokemonDetail } from '@/shared/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`)
  return res.json()
}

export async function fetchPokemon(idOrName: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${idOrName}: ${res.status}`)
  return res.json()
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test
```
Expected: All 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/shared/types/pokemon.ts src/shared/services/pokemon-api.ts tests/
git commit -m "feat: add PokéAPI types and service layer with tests"
```

---

## Task 3: TanStack Query Client + Devtools

**Files:**
- Create: `src/shared/lib/query-client.ts`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: `queryClient` singleton, `QueryClientProvider` + `ReactQueryDevtools` wired in `main.tsx`

- [ ] **Step 1: Create the QueryClient**

`src/shared/lib/query-client.ts`:
```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes — data stays fresh for 5 min
      gcTime: 1000 * 60 * 10,     // 10 minutes — cache survives 10 min unused
      retry: 1,
      refetchOnWindowFocus: false, // off by default for clearer learning demos
    },
  },
})
```

- [ ] **Step 2: Wire providers in `src/main.tsx`**

Replace the file:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/lib/query-client'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        <p className="p-8 text-2xl font-bold text-blue-500">TanStack Query Playground</p>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Step 3: Verify devtools panel appears**

```bash
npm run dev
```
Open `http://localhost:5173`. You should see a TanStack Query logo button in the bottom-left corner. Click it — the devtools panel opens. No queries yet.

- [ ] **Step 4: Commit**

```bash
git add src/shared/lib/query-client.ts src/main.tsx
git commit -m "feat: wire TanStack Query client and devtools"
```

---

## Task 4: TanStack Router + App Shell

**Files:**
- Create: `src/app/router.tsx`
- Create: `src/app/layout/Header.tsx`
- Create: `src/app/layout/RootLayout.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: working navigation to `/` (redirects to `/module/01`), `RootLayout` with two-column shell, `Header` with module nav
- Consumes: nothing from earlier tasks yet

- [ ] **Step 1: Create the router**

`src/app/router.tsx`:
```tsx
import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/module/01' })
  },
})

export const module01Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/01',
  component: () => (
    <div className="p-8">
      <p className="text-gray-500">Module 01 — coming in Task 5</p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute, module01Route])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

- [ ] **Step 2: Create the Header**

`src/app/layout/Header.tsx`:
```tsx
import { Link } from '@tanstack/react-router'

const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02', disabled: true },
  { id: '03', label: 'Query Keys', path: '/module/03', disabled: true },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-bold text-blue-500">TanStack Query Playground</span>
        </div>

        <nav className="flex gap-1">
          {MODULES.map((mod) =>
            mod.disabled ? (
              <span
                key={mod.id}
                className="cursor-not-allowed rounded-full px-4 py-1.5 text-sm font-medium text-gray-300"
              >
                {mod.label}
              </span>
            ) : (
              <Link
                key={mod.id}
                to={mod.path}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 [&.active]:bg-blue-500 [&.active]:text-white"
              >
                {mod.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create RootLayout**

`src/app/layout/RootLayout.tsx`:
```tsx
import { Outlet } from '@tanstack/react-router'
import { Header } from '@/app/layout/Header'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Wire router into `src/main.tsx`**

Replace `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient } from '@/shared/lib/query-client'
import { router } from '@/app/router'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Step 5: Verify layout renders**

```bash
npm run dev
```
Open `http://localhost:5173`. Should redirect to `/module/01` and show: sticky header with "TanStack Query Playground" + "Query Basics" tab active. Page body shows placeholder text.

- [ ] **Step 6: Commit**

```bash
git add src/app/ src/main.tsx
git commit -m "feat: add TanStack Router with app shell layout and header"
```

---

## Task 5: Pokemon Grid with useQuery (Playground)

**Files:**
- Create: `src/features/pokemon/PokemonCard.tsx`
- Create: `src/features/pokemon/LoadingSkeleton.tsx`
- Create: `src/features/pokemon/ErrorState.tsx`
- Create: `src/features/pokemon/EmptyState.tsx`
- Create: `src/features/pokemon/PokemonGrid.tsx`
- Create: `src/features/module-01/Module01Page.tsx`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Consumes: `fetchPokemonList` from `@/shared/services/pokemon-api`
- Produces: `<Module01Page />` showing a 4-column Pokémon grid with live useQuery states

- [ ] **Step 1: Create PokemonCard**

`src/features/pokemon/PokemonCard.tsx`:
```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-100 text-orange-700',
  water: 'bg-blue-100 text-blue-700',
  grass: 'bg-green-100 text-green-700',
  electric: 'bg-yellow-100 text-yellow-700',
  psychic: 'bg-pink-100 text-pink-700',
  ice: 'bg-cyan-100 text-cyan-700',
  dragon: 'bg-indigo-100 text-indigo-700',
  dark: 'bg-gray-100 text-gray-700',
  fairy: 'bg-rose-100 text-rose-700',
  normal: 'bg-gray-100 text-gray-600',
  fighting: 'bg-red-100 text-red-700',
  flying: 'bg-sky-100 text-sky-700',
  poison: 'bg-purple-100 text-purple-700',
  ground: 'bg-amber-100 text-amber-700',
  rock: 'bg-stone-100 text-stone-700',
  bug: 'bg-lime-100 text-lime-700',
  ghost: 'bg-violet-100 text-violet-700',
  steel: 'bg-slate-100 text-slate-700',
}

interface Props {
  pokemon: PokemonDetail
  onClick: (pokemon: PokemonDetail) => void
}

export function PokemonCard({ pokemon, onClick }: Props) {
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <Card
      onClick={() => onClick(pokemon)}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-blue-200"
    >
      <div className="mb-2 flex h-24 items-center justify-center rounded-xl bg-gray-50">
        {sprite ? (
          <img
            src={sprite}
            alt={pokemon.name}
            className="h-20 w-20 object-contain transition group-hover:scale-110"
          />
        ) : (
          <span className="text-4xl">❓</span>
        )}
      </div>
      <p className="text-center text-xs font-medium text-gray-400">#{String(pokemon.id).padStart(3, '0')}</p>
      <p className="text-center text-sm font-semibold capitalize text-gray-800">{pokemon.name}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Create LoadingSkeleton**

`src/features/pokemon/LoadingSkeleton.tsx`:
```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Skeleton className="mb-2 h-24 w-full rounded-xl" />
          <Skeleton className="mx-auto mb-1 h-3 w-12" />
          <Skeleton className="mx-auto h-4 w-20" />
          <div className="mt-2 flex justify-center gap-1">
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create ErrorState**

`src/features/pokemon/ErrorState.tsx`:
```tsx
import { Button } from '@/components/ui/button'

interface Props {
  error: Error
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
      <span className="text-5xl">😵</span>
      <div>
        <p className="text-lg font-semibold text-red-700">Something went wrong</p>
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      </div>
      <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
        Try Again
      </Button>
    </div>
  )
}
```

- [ ] **Step 4: Create EmptyState**

`src/features/pokemon/EmptyState.tsx`:
```tsx
export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-5xl">🔍</span>
      <p className="text-lg font-semibold text-gray-600">No Pokémon found</p>
      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
    </div>
  )
}
```

- [ ] **Step 5: Create PokemonGrid with useQuery**

`src/features/pokemon/PokemonGrid.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import { EmptyState } from '@/features/pokemon/EmptyState'
import type { PokemonDetail } from '@/shared/types/pokemon'

interface Props {
  onSelect: (pokemon: PokemonDetail) => void
}

export function PokemonGrid({ onSelect }: Props) {
  const [selectedQueryKey, setSelectedQueryKey] = useState<string | null>(null)

  const listQuery = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
  })

  const detailQueries = useQuery({
    queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
    queryFn: async () => {
      if (!listQuery.data) return []
      const details = await Promise.all(
        listQuery.data.results.map((p) => fetchPokemon(p.name)),
      )
      return details
    },
    enabled: !!listQuery.data,
  })

  if (listQuery.isPending || detailQueries.isPending) {
    return <LoadingSkeleton />
  }

  if (listQuery.isError) {
    return <ErrorState error={listQuery.error as Error} onRetry={() => listQuery.refetch()} />
  }

  if (detailQueries.isError) {
    return <ErrorState error={detailQueries.error as Error} onRetry={() => detailQueries.refetch()} />
  }

  const pokemon = detailQueries.data ?? []

  if (pokemon.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Create Module01Page**

`src/features/module-01/Module01Page.tsx`:
```tsx
import { useState } from 'react'
import { PokemonGrid } from '@/features/pokemon/PokemonGrid'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function Module01Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex gap-6">
      {/* Left: Playground */}
      <div className="flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 01 — Query Basics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click any Pokémon to see useQuery in action. Watch the right panel update live.
          </p>
        </div>
        <PokemonGrid onSelect={setSelected} />
      </div>

      {/* Right: Panels placeholder — filled in Tasks 6–9 */}
      <aside className="w-80 shrink-0">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {selected ? (
            <div className="text-center">
              <img
                src={selected.sprites.other['official-artwork'].front_default ?? selected.sprites.front_default ?? ''}
                alt={selected.name}
                className="mx-auto h-28 w-28"
              />
              <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
              <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400">Select a Pokémon to inspect its query state</p>
          )}
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 7: Wire Module01Page into the router**

In `src/app/router.tsx`, replace the module01Route component:
```tsx
import { Module01Page } from '@/features/module-01/Module01Page'

export const module01Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/01',
  component: Module01Page,
})
```

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```
Navigate to `http://localhost:5173`. Should see:
- Header with "Query Basics" tab active
- 20 Pokémon cards loading as skeletons, then populating with sprites and type badges
- Right panel shows "Select a Pokémon" placeholder
- Clicking a card shows selected Pokémon's sprite in right panel
- TanStack Query Devtools shows `['pokemon', 'list']` and `['pokemon', 'details', [...]]` queries

- [ ] **Step 9: Commit**

```bash
git add src/features/
git commit -m "feat: Module 01 pokemon grid with useQuery loading/error/empty states"
```

---

## Task 6: Query Inspector Panel

**Files:**
- Create: `src/features/inspector/QueryInspector.tsx`
- Create: `src/shared/lib/query-events.ts`
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `useQueryClient()` hook from TanStack Query
- Produces: `<QueryInspector queryKey={...} />` showing live query state fields

- [ ] **Step 1: Create the query event logger**

`src/shared/lib/query-events.ts`:
```ts
import type { Query, QueryCacheNotifyEvent } from '@tanstack/react-query'

export interface QueryEvent {
  id: string
  timestamp: number
  type: QueryCacheNotifyEvent['type']
  queryKey: unknown[]
  status: Query['state']['status']
  fetchStatus: Query['state']['fetchStatus']
}

export function formatQueryKey(key: unknown[]): string {
  return JSON.stringify(key)
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
```

- [ ] **Step 2: Create QueryInspector**

`src/features/inspector/QueryInspector.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
}

const FETCH_STATUS_COLORS = {
  fetching: 'bg-blue-100 text-blue-700',
  paused: 'bg-orange-100 text-orange-700',
  idle: 'bg-gray-100 text-gray-600',
}

interface Props {
  queryKey?: unknown[]
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-gray-800">{children}</span>
    </div>
  )
}

export function QueryInspector({ queryKey }: Props) {
  const queryClient = useQueryClient()
  const [queryState, setQueryState] = useState<Query | null>(null)

  useEffect(() => {
    const cache = queryClient.getQueryCache()

    const refresh = () => {
      if (!queryKey) {
        const all = cache.getAll()
        setQueryState(all[all.length - 1] ?? null)
        return
      }
      const q = cache.find({ queryKey })
      setQueryState(q ?? null)
    }

    refresh()
    const unsub = cache.subscribe(refresh)
    return unsub
  }, [queryClient, queryKey])

  if (!queryState) {
    return (
      <div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-400">
        No query to inspect yet
      </div>
    )
  }

  const { state } = queryState
  const staleTime = (queryState.options.staleTime as number | undefined) ?? 0
  const gcTime = (queryState.options.gcTime as number | undefined) ?? 300_000
  const isStale = queryState.isStale()
  const observerCount = queryState.observers.length
  const updatedAt = state.dataUpdatedAt
    ? new Date(state.dataUpdatedAt).toLocaleTimeString('en-US', { hour12: false })
    : '—'

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-gray-900">🔍 Query Inspector</h3>

      <div className="mb-3 rounded-lg bg-gray-50 px-2 py-1">
        <p className="truncate font-mono text-xs text-gray-500">
          {JSON.stringify(queryState.queryKey)}
        </p>
      </div>

      <Field label="Status">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[state.status]}`}>
          {state.status}
        </span>
      </Field>

      <Field label="Fetch Status">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FETCH_STATUS_COLORS[state.fetchStatus]}`}>
          {state.fetchStatus}
        </span>
      </Field>

      <Field label="Stale">{isStale ? '⚠️ Yes' : '✅ No'}</Field>
      <Field label="Observers">{observerCount}</Field>
      <Field label="Updated At">{updatedAt}</Field>
      <Field label="staleTime">{staleTime === Infinity ? '∞' : `${staleTime / 1000}s`}</Field>
      <Field label="gcTime">{`${gcTime / 1000}s`}</Field>
    </div>
  )
}
```

- [ ] **Step 3: Add QueryInspector to Module01Page right panel**

In `src/features/module-01/Module01Page.tsx`, update the `<aside>`:
```tsx
import { QueryInspector } from '@/features/inspector/QueryInspector'

// Inside the aside, replace the placeholder div:
<aside className="w-80 shrink-0 space-y-4">
  {selected && (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
      <img
        src={selected.sprites.other['official-artwork'].front_default ?? selected.sprites.front_default ?? ''}
        alt={selected.name}
        className="mx-auto h-28 w-28"
      />
      <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
      <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
    </div>
  )}
  <QueryInspector queryKey={['pokemon', 'details', undefined]} />
</aside>
```

- [ ] **Step 4: Verify in browser**

Run dev server. The right panel should now show the Query Inspector with live status, fetchStatus, stale state, and observer count. While the Pokémon are loading, status should show `pending`. After data loads, it should show `success` and stale=No.

- [ ] **Step 5: Commit**

```bash
git add src/features/inspector/ src/shared/lib/query-events.ts src/features/module-01/Module01Page.tsx
git commit -m "feat: add QueryInspector panel showing live query state"
```

---

## Task 7: Query Activity Timeline

**Files:**
- Create: `src/features/activity/QueryActivity.tsx`
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `QueryCacheNotifyEvent` from TanStack Query via `queryClient.getQueryCache().subscribe()`
- Produces: `<QueryActivity />` component showing scrollable timestamped event log

- [ ] **Step 1: Create QueryActivity component**

`src/features/activity/QueryActivity.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { QueryCacheNotifyEvent } from '@tanstack/react-query'
import { formatTime, formatQueryKey } from '@/shared/lib/query-events'

interface LogEntry {
  id: number
  timestamp: number
  type: QueryCacheNotifyEvent['type']
  queryKey: unknown[]
  detail?: string
}

const EVENT_STYLES: Record<string, { icon: string; color: string }> = {
  added: { icon: '➕', color: 'text-green-600' },
  removed: { icon: '🗑️', color: 'text-red-500' },
  updated: { icon: '🔄', color: 'text-blue-600' },
  observed: { icon: '👁️', color: 'text-purple-600' },
  unobserved: { icon: '👁️‍🗨️', color: 'text-gray-400' },
}

export function QueryActivity() {
  const queryClient = useQueryClient()
  const [events, setEvents] = useState<LogEntry[]>([])
  const counterRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      setEvents((prev) => {
        const entry: LogEntry = {
          id: ++counterRef.current,
          timestamp: Date.now(),
          type: event.type,
          queryKey: event.query.queryKey as unknown[],
          detail: event.type === 'updated' ? event.query.state.status : undefined,
        }
        const next = [...prev, entry]
        return next.length > 50 ? next.slice(-50) : next
      })
    })
    return unsub
  }, [queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">📊 Query Activity</h3>
        <button
          onClick={() => setEvents([])}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="h-48 overflow-y-auto p-3 font-mono">
        {events.length === 0 ? (
          <p className="text-center text-xs text-gray-400 pt-8">
            Events will appear here when queries run
          </p>
        ) : (
          <div className="space-y-1">
            {events.map((entry) => {
              const style = EVENT_STYLES[entry.type] ?? { icon: '•', color: 'text-gray-500' }
              return (
                <div key={entry.id} className="flex items-start gap-2">
                  <span className="shrink-0 text-gray-400 text-xs">{formatTime(entry.timestamp)}</span>
                  <span className="shrink-0">{style.icon}</span>
                  <span className={`text-xs ${style.color}`}>
                    {entry.type}
                    {entry.detail ? ` → ${entry.detail}` : ''}
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    {formatQueryKey(entry.queryKey)}
                  </span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add QueryActivity to Module01Page**

In `src/features/module-01/Module01Page.tsx` aside, add after `<QueryInspector>`:
```tsx
import { QueryActivity } from '@/features/activity/QueryActivity'

// Add inside <aside className="...">:
<QueryActivity />
```

- [ ] **Step 3: Verify in browser**

Reload the page. The Query Activity timeline should immediately show `added` and `updated` events as the two list/detail queries run. The events should be timestamped and color-coded. Refreshing the page shows another burst of events.

- [ ] **Step 4: Commit**

```bash
git add src/features/activity/ src/features/module-01/Module01Page.tsx
git commit -m "feat: add Query Activity timeline with live QueryCache event log"
```

---

## Task 8: Learning Mode — Toast Notifications

**Files:**
- Create: `src/shared/hooks/use-learning-mode.tsx`
- Modify: `src/main.tsx`
- Modify: `src/app/layout/Header.tsx`
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Produces: `LearningModeProvider`, `useLearningMode()` → `{ enabled: boolean; toggle: () => void }`
- When enabled: toast notifications fire for every QueryCache event

**Note:** Install shadcn Sonner toast before this task:
```bash
npx shadcn@latest add sonner
```

- [ ] **Step 1: Install Sonner toast**

```bash
npx shadcn@latest add sonner
```

- [ ] **Step 2: Create Learning Mode context and hook**

`src/shared/hooks/use-learning-mode.tsx`:
```tsx
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface LearningModeContext {
  enabled: boolean
  toggle: () => void
}

const Ctx = createContext<LearningModeContext>({
  enabled: false,
  toggle: () => {},
})

const EVENT_MESSAGES: Record<string, string> = {
  added: '🆕 Query Created — TanStack Query is tracking this data',
  removed: '🗑️ Query Removed — garbage collected from cache',
  observed: '👁️ Observer Added — a component subscribed to this query',
  unobserved: '👁️‍🗨️ Observer Removed — no components watching this query',
  updated: '🔄 Query Updated — state changed',
}

export function LearningModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const queryClient = useQueryClient()
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      if (!enabledRef.current) return
      const msg = EVENT_MESSAGES[event.type]
      if (msg) toast(msg, { duration: 2000 })
    })
    return unsub
  }, [queryClient])

  return (
    <Ctx.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLearningMode() {
  return useContext(Ctx)
}
```

- [ ] **Step 3: Add Toaster + LearningModeProvider to main.tsx**

```tsx
import { LearningModeProvider } from '@/shared/hooks/use-learning-mode'
import { Toaster } from '@/components/ui/sonner'

// Wrap RouterProvider:
<QueryClientProvider client={queryClient}>
  <LearningModeProvider>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" />
  </LearningModeProvider>
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

- [ ] **Step 4: Add Learning Mode toggle to Header**

In `src/app/layout/Header.tsx`:
```tsx
import { useLearningMode } from '@/shared/hooks/use-learning-mode'

// Inside Header():
const { enabled, toggle } = useLearningMode()

// Add at the end of the header flex row:
<button
  onClick={toggle}
  className={`ml-auto flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
    enabled
      ? 'bg-yellow-400 text-yellow-900 shadow-sm'
      : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
  }`}
>
  <span>{enabled ? '🎓' : '💡'}</span>
  {enabled ? 'Learning: ON' : 'Learning: OFF'}
</button>
```

- [ ] **Step 5: Verify in browser**

Toggle the Learning Mode button. It should turn yellow. Reload the page — toast notifications should appear in the bottom-right corner for each query event: "Query Created", "Observer Added", "Query Updated", etc.

- [ ] **Step 6: Commit**

```bash
git add src/shared/hooks/ src/main.tsx src/app/layout/Header.tsx
git commit -m "feat: Learning Mode toggle with toast notifications for query events"
```

---

## Task 9: Engineering Insight + Visual Diagram + Source Code Panels

**Files:**
- Create: `src/features/module-01/panels/EngineeringInsight.tsx`
- Create: `src/features/module-01/panels/VisualDiagram.tsx`
- Create: `src/features/module-01/panels/SourceCodePanel.tsx`
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `react-syntax-highlighter`
- Produces: three static educational panels for Module 01

- [ ] **Step 1: Create EngineeringInsight panel**

`src/features/module-01/panels/EngineeringInsight.tsx`:
```tsx
interface InsightSection {
  emoji: string
  label: string
  content: string
}

const SECTIONS: InsightSection[] = [
  {
    emoji: '🔴',
    label: 'Problem',
    content: 'Every time you visit a page, a new network request fires — even for data you fetched 2 seconds ago.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'React has no memory between renders. Each useEffect + fetch knows nothing about previous fetches.',
  },
  {
    emoji: '⚠️',
    label: 'Why React Alone Isn\'t Enough',
    content: 'useState/useEffect manages UI state. It was never designed to cache server responses, handle race conditions, or retry on failure.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'useQuery stores the response in a Query Cache keyed by queryKey. The next component that needs the same data gets it instantly — no new network request.',
  },
]

export function EngineeringInsight() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🧩 Engineering Insight</h3>
      </div>
      <div className="divide-y divide-gray-50 px-4">
        {SECTIONS.map((s) => (
          <div key={s.label} className="py-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              {s.emoji} {s.label}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create VisualDiagram panel**

`src/features/module-01/panels/VisualDiagram.tsx`:
```tsx
const FLOW_STEPS = [
  { label: 'Component mounts', icon: '🧩' },
  { label: 'useQuery() called', icon: '🔑' },
  { label: 'QueryClient checks cache', icon: '🗂️' },
  { label: 'Cache miss → network request', icon: '🌐' },
  { label: 'Response received', icon: '📦' },
  { label: 'Stored in Query Cache', icon: '💾' },
  { label: 'Component re-renders with data', icon: '✅' },
]

export function VisualDiagram() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 w-full justify-center">
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="my-1 h-4 w-px bg-blue-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create SourceCodePanel**

`src/features/module-01/panels/SourceCodePanel.tsx`:
```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `import { useQuery } from '@tanstack/react-query'

function PokemonGrid() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['pokemon', 'list'],  // cache key
    queryFn: () => fetchPokemonList(20, 0),
  })

  if (isPending) return <LoadingSkeleton />
  if (isError) return <ErrorState error={error} />

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.results.map((p) => (
        <PokemonCard key={p.name} name={p.name} />
      ))}
    </div>
  )
}`

export function SourceCodePanel() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">💻 Source Code</h3>
      </div>
      <SyntaxHighlighter
        language="tsx"
        style={oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: '#fafafa' }}
        wrapLines
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  )
}
```

- [ ] **Step 4: Add tabbed right panel to Module01Page**

Wrap the right panel with shadcn Tabs. Update `src/features/module-01/Module01Page.tsx`:

```tsx
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PokemonGrid } from '@/features/pokemon/PokemonGrid'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight } from '@/features/module-01/panels/EngineeringInsight'
import { VisualDiagram } from '@/features/module-01/panels/VisualDiagram'
import { SourceCodePanel } from '@/features/module-01/panels/SourceCodePanel'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function Module01Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex gap-6">
      {/* Left: Playground */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 01 — Query Basics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click any Pokémon to select it. Watch the Inspector and Activity panels update live.
          </p>
        </div>
        <PokemonGrid onSelect={setSelected} />
      </div>

      {/* Right: Educational panels */}
      <aside className="w-80 shrink-0">
        {selected && (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <img
              src={
                selected.sprites.other['official-artwork'].front_default ??
                selected.sprites.front_default ??
                ''
              }
              alt={selected.name}
              className="mx-auto h-28 w-28"
            />
            <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
            <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
          </div>
        )}

        <Tabs defaultValue="inspector">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="inspector" className="text-xs">Inspector</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">Insight</TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs">Diagram</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="inspector">
            <QueryInspector />
          </TabsContent>
          <TabsContent value="activity">
            <QueryActivity />
          </TabsContent>
          <TabsContent value="insight">
            <EngineeringInsight />
          </TabsContent>
          <TabsContent value="diagram">
            <VisualDiagram />
          </TabsContent>
          <TabsContent value="code">
            <SourceCodePanel />
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  )
}
```

- [ ] **Step 5: Verify all panels in browser**

Run dev server. Click each tab in the right panel and verify:
- **Inspector:** shows `status: success`, `fetchStatus: idle`, `Stale: No`, `Observers: 1`
- **Activity:** shows timestamped event log with `added`, `updated`, `observed` events
- **Insight:** shows 4 sections (Problem → Solution)
- **Diagram:** shows 7-step flow from Component to Re-render
- **Code:** shows syntax-highlighted `useQuery` code

- [ ] **Step 6: Commit**

```bash
git add src/features/module-01/panels/ src/features/module-01/Module01Page.tsx
git commit -m "feat: add Engineering Insight, Visual Diagram, and Source Code panels for Module 01"
```

---

## Task 10: Module 01 Summary + Polish

**Files:**
- Create: `src/features/module-01/panels/ModuleSummary.tsx`
- Modify: `src/features/module-01/Module01Page.tsx`
- Modify: `src/app/layout/Header.tsx` (add Pokémon GO styling)

**Interfaces:**
- Produces: complete, polished Module 01 with summary section below the grid

- [ ] **Step 1: Create ModuleSummary**

`src/features/module-01/panels/ModuleSummary.tsx`:
```tsx
const TAKEAWAYS = [
  { emoji: '🔑', text: 'queryKey is the cache key. Same key = same cache entry.' },
  { emoji: '📊', text: 'isPending is true only on the very first load. isError/isSuccess reflect the result.' },
  { emoji: '💾', text: 'Data is stored in Query Cache automatically. No useState needed.' },
  { emoji: '⚡', text: 'Second visit = instant render from cache, not a new network request.' },
  { emoji: '🔄', text: 'TanStack Query retries failed requests automatically (default: 3 times).' },
]

export function ModuleSummary() {
  return (
    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
      <h2 className="mb-4 text-lg font-bold text-blue-900">✅ Module 01 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">React has no built-in server state cache. Every render fetches fresh.</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">useQuery caches the response by queryKey and reuses it across components and navigations.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-blue-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add ModuleSummary below the grid in Module01Page**

In `src/features/module-01/Module01Page.tsx`, inside the left column `<div className="flex-1 min-w-0">`, add after `<PokemonGrid>`:
```tsx
import { ModuleSummary } from '@/features/module-01/panels/ModuleSummary'

// After <PokemonGrid onSelect={setSelected} />:
<ModuleSummary />
```

- [ ] **Step 3: Verify final state in browser**

Open `http://localhost:5173`. Go through the complete Module 01 experience:
1. Page loads → skeleton appears, then 20 Pokémon cards appear
2. TanStack Devtools shows 2 queries
3. Toggle Learning Mode → toast notifications appear on reload
4. Click Inspector tab → see live query state
5. Click Activity tab → see timestamped event log
6. Click Insight → 4-section Problem/Solution narrative
7. Click Diagram → 7-step flow
8. Click Code → syntax highlighted `useQuery` example
9. Scroll down → Module Summary with key takeaways

- [ ] **Step 4: Run all tests**

```bash
npm test
```
Expected: All 5 service tests PASS.

- [ ] **Step 5: Final commit**

```bash
git add src/features/module-01/panels/ModuleSummary.tsx src/features/module-01/Module01Page.tsx
git commit -m "feat: complete Module 01 with summary section and full educational panel suite"
```

---

## Self-Review

### Spec Coverage Check

| PRD Requirement | Task |
|---|---|
| Module 01: useQuery, Loading, Error, Empty State | Task 5 |
| 🎮 Playground (interactive demo) | Task 5 |
| 🧩 Engineering Insight panel | Task 9 |
| 🖼 Visual Diagram panel | Task 9 |
| 💻 Source Code panel | Task 9 |
| 📊 Query Activity timeline | Task 7 |
| 🔍 Query Inspector | Task 6 |
| ✅ Summary section | Task 10 |
| Learning Mode toggle with notifications | Task 8 |
| Pokémon GO visual theme (white, blue, yellow, rounded) | Tasks 5, 10 |
| Responsive mobile layout | Not covered — Module 02+ plan |
| TanStack Query Devtools | Task 3 |
| PokéAPI integration | Task 2 |
| TanStack Router | Task 4 |
| Tailwind CSS v4 + shadcn/ui | Task 1 |
| Framer Motion | Not covered — add animations in polish pass |
| React Syntax Highlighter | Task 9 |

### Gaps Identified

1. **Mobile responsive layout** (tabs for Playground/Insight/Diagram/Source/Inspector/Activity on mobile) — deferred to Module 02 plan to keep this plan shippable
2. **Framer Motion animations** (card hover, skeleton transition) — can be added as a polish pass after Module 01 is functional
3. **Performance Comparison** (React Only vs TanStack Query) — planned as a standalone module per the PRD roadmap

### Modules 02–09

Each subsequent module is a separate plan. Suggested order:
- `2026-XX-XX-module-02-query-cache.md` — cache hit/miss, instant navigation
- `2026-XX-XX-module-03-query-keys.md` — dynamic query keys with search
- `2026-XX-XX-module-04-background-fetch.md` — isLoading vs isFetching
- `2026-XX-XX-module-05-infinite-query.md` — useInfiniteQuery
- `2026-XX-XX-module-06-prefetch.md` — hover prefetch
- `2026-XX-XX-module-07-dependent-query.md` — enabled flag, chained queries
- `2026-XX-XX-module-08-mutations.md` — MSW + useMutation + optimistic updates
- `2026-XX-XX-module-09-advanced-cache.md` — staleTime, gcTime, retry sliders
