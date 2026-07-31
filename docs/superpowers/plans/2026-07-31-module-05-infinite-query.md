# Module 05 — Infinite Query Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 05 that teaches `useInfiniteQuery` via an accumulating Pokémon grid with a "Load More" button, making visible how `pages[]` grows, how `getNextPageParam` signals more data, and how `isFetchingNextPage` enables a loading indicator without hiding already-loaded cards.

**Architecture:** A single new page (`Module05Page`) wraps `PokemonInfiniteGrid` which owns the `useInfiniteQuery` call and renders all pages flattened via `flatMap`. No Pokémon selection — the module focuses purely on pagination behavior. Query key `['pokemon', 'infinite']` is distinct from other modules so the Inspector shows a clean isolated cache entry.

**Tech Stack:** React 18 + TypeScript strict + Vite 6 + TanStack Query v5 + TanStack Router v1 + Tailwind CSS v4 + shadcn/ui + `react-syntax-highlighter`

## Global Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`; use utility classes only
- `glass-panel` utility already in `src/index.css` — use it, do not inline equivalent styles
- All breakpoints use `lg:` (1024px) — do not introduce new breakpoints
- `PokemonDetail` type from `@/shared/types/pokemon`
- `fetchPokemonList`, `fetchPokemon` from `@/shared/services/pokemon-api`
- No automated component tests — Vitest runs in node env without DOM
- Run `npm run build` after each task before committing
- TanStack Query v5: `useInfiniteQuery` requires `initialPageParam` (not optional)
- TanStack Router v1: add routes via `createRoute`, register in `routeTree`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Modify** | `src/app/router.tsx` | Add module05Route, add to routeTree |
| **Modify** | `src/app/layout/Header.tsx` | Add Module 05 to MODULES array |
| **Create** | `src/features/module-05/panels/EngineeringInsight05.tsx` | useInfiniteQuery vs useQuery explanation |
| **Create** | `src/features/module-05/panels/VisualDiagram05.tsx` | pages[] array accumulation diagram |
| **Create** | `src/features/module-05/panels/SourceCodePanel05.tsx` | Annotated PokemonInfiniteGrid source |
| **Create** | `src/features/module-05/panels/ModuleSummary05.tsx` | 3 key takeaways |
| **Create** | `src/features/module-05/PokemonInfiniteGrid.tsx` | Infinite grid with Load More button |
| **Create** | `src/features/module-05/Module05Page.tsx` | Two-column page layout |

---

### Task 1: Add Module 05 route and nav link

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Header.tsx`

**Interfaces:**
- Consumes: `Module05Page` (stub created in this task)
- Produces: `/module/05` route accessible in the app

- [ ] **Step 1: Create a stub Module05Page so the import resolves**

Create `src/features/module-05/Module05Page.tsx`:

```tsx
export function Module05Page() {
  return <div className="p-8 text-gray-500">Module 05 — coming soon</div>
}
```

- [ ] **Step 2: Add the route to router.tsx**

In `src/app/router.tsx`, add the import after the module04 import:

```tsx
import { Module05Page } from '@/features/module-05/Module05Page'
```

Add the route definition after `module04Route`:

```tsx
export const module05Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/05',
  component: Module05Page,
})
```

Update `routeTree` to include `module05Route`:

```tsx
const routeTree = rootRoute.addChildren([
  indexRoute,
  module01Route,
  module02Route,
  module02DetailRoute,
  module03Route,
  module04Route,
  module05Route,
])
```

- [ ] **Step 3: Add Module 05 to the Header nav**

In `src/app/layout/Header.tsx`, update the `MODULES` array:

```tsx
const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02' },
  { id: '03', label: 'Query Keys', path: '/module/03' },
  { id: '04', label: 'Background Fetching', path: '/module/04' },
  { id: '05', label: 'Infinite Query', path: '/module/05' },
]
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 5: Verify nav link appears and route loads**

```bash
npm run dev
```

Open browser → confirm "Infinite Query" appears in nav → click it → `/module/05` loads the stub text.

- [ ] **Step 6: Commit**

```bash
git add src/features/module-05/Module05Page.tsx src/app/router.tsx src/app/layout/Header.tsx
git commit -m "feat: add Module 05 route and nav link"
```

---

### Task 2: Create panel files

**Files:**
- Create: `src/features/module-05/panels/EngineeringInsight05.tsx`
- Create: `src/features/module-05/panels/VisualDiagram05.tsx`
- Create: `src/features/module-05/panels/SourceCodePanel05.tsx`
- Create: `src/features/module-05/panels/ModuleSummary05.tsx`

**Interfaces:**
- Consumes: `react-syntax-highlighter` (already installed)
- Produces: four named exports used by `Module05Page` in Task 4

- [ ] **Step 1: Create EngineeringInsight05**

Create `src/features/module-05/panels/EngineeringInsight05.tsx`:

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
    content: 'useQuery fetches a single page. To load more, you\'d have to manually track offsets and merge arrays — error-prone and full of edge cases.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'Paginated APIs return a "next" cursor or offset. Each page of results should accumulate in the UI, not replace the previous page.',
  },
  {
    emoji: '⚠️',
    label: 'The Structure',
    content: 'useInfiniteQuery stores data as pages[] instead of a flat result. Each fetchNextPage call appends a new item to the pages array.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'getNextPageParam tells TanStack Query what to pass as pageParam next time. Return undefined to signal "no more pages." Use pages.flatMap() to render everything as a single list.',
  },
]

export function EngineeringInsight05() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🧩 Engineering Insight</h3>
      </div>
      <div className="divide-y divide-white/20 px-4">
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

- [ ] **Step 2: Create VisualDiagram05**

Create `src/features/module-05/panels/VisualDiagram05.tsx`:

```tsx
interface PageRow {
  label: string
  items: string
  isNew?: boolean
}

const PAGE_ROWS: PageRow[] = [
  { label: 'pages[0]', items: 'Bulbasaur … Raticate' },
  { label: 'pages[1]', items: 'Fearow … Arcanine', isNew: true },
  { label: 'pages[2]', items: 'Poliwrath … Haunter', isNew: true },
]

export function VisualDiagram05() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          data.pages — grows with each Load More
        </p>
        <div className="space-y-1.5">
          {PAGE_ROWS.map((row) => (
            <div
              key={row.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                row.isNew
                  ? 'bg-blue-50 border border-blue-200/60 text-blue-800'
                  : 'bg-white/40 text-gray-700'
              }`}
            >
              <span className="font-mono text-xs font-bold w-16 shrink-0">{row.label}</span>
              <span className="text-xs text-gray-500">→</span>
              <span className="text-xs">[{row.items}]</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-col items-center gap-1">
          <div className="h-4 w-px bg-gray-300" />
          <div className="rounded-xl bg-green-50 border border-green-200/60 px-3 py-2 w-full text-center">
            <p className="text-xs font-semibold text-green-800">pages.flatMap(p =&gt; p.details)</p>
            <p className="text-xs text-green-700 mt-0.5">→ single flat list rendered in the grid</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white/40 p-3 text-xs text-gray-600 space-y-1">
          <p><strong>getNextPageParam</strong> returns next offset or <code>undefined</code></p>
          <p><strong>isFetchingNextPage</strong> is true only while fetching the next batch</p>
          <p><strong>hasNextPage</strong> is false when getNextPageParam returns undefined</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create SourceCodePanel05**

Create `src/features/module-05/panels/SourceCodePanel05.tsx`:

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `import { useInfiniteQuery } from '@tanstack/react-query'

function PokemonInfiniteGrid() {
  const query = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const list = await fetchPokemonList(20, pageParam)
      const details = await Promise.all(
        list.results.map((p) => fetchPokemon(p.name))
      )
      return { details, hasMore: !!list.next }
    },
    initialPageParam: 0,                         // required in v5
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore
        ? allPages.length * 20                   // next offset
        : undefined,                             // no more pages
  })

  // Flatten all pages into a single array for the grid
  const pokemon = query.data?.pages.flatMap((p) => p.details) ?? []

  if (query.isPending) return <LoadingSkeleton />
  if (query.isError)   return <ErrorState />

  return (
    <div>
      <PokemonGrid pokemon={pokemon} />

      {query.hasNextPage && (
        <button
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}   // prevent double-fetch
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
        </button>
      )}

      {!query.hasNextPage && pokemon.length > 0 && (
        <p>All {pokemon.length} Pokémon loaded</p>
      )}
    </div>
  )
}`

export function SourceCodePanel05() {
  return (
    <div className="rounded-2xl glass-panel overflow-hidden">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">💻 Source Code</h3>
      </div>
      <SyntaxHighlighter
        language="tsx"
        style={oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: 'rgba(255,255,255,0.3)' }}
        wrapLines
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  )
}
```

- [ ] **Step 4: Create ModuleSummary05**

Create `src/features/module-05/panels/ModuleSummary05.tsx`:

```tsx
const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'useInfiniteQuery stores data as pages[] — not a flat array. Use pages.flatMap() to render all loaded items in one grid.',
  },
  {
    emoji: '📄',
    text: 'getNextPageParam returning undefined means "no more pages." Any other value becomes the next pageParam passed to queryFn.',
  },
  {
    emoji: '⏳',
    text: 'isFetchingNextPage lets you show a loading indicator on the button without hiding already-loaded cards. It\'s separate from isFetching.',
  },
]

export function ModuleSummary05() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 05 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Manually tracking offsets and merging page arrays is error-prone and verbose.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700"><code className="text-xs bg-white/60 px-1 rounded">useInfiniteQuery</code> manages page accumulation, next-page params, and loading state automatically.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-indigo-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/module-05/panels/
git commit -m "feat: add Module 05 panel files (Insight, Diagram, Code, Summary)"
```

---

### Task 3: Create PokemonInfiniteGrid

**Files:**
- Create: `src/features/module-05/PokemonInfiniteGrid.tsx`

**Interfaces:**
- Consumes:
  - `useInfiniteQuery` from `@tanstack/react-query`
  - `fetchPokemonList(limit: number, offset: number): Promise<PokemonListResponse>` from `@/shared/services/pokemon-api` — `PokemonListResponse.next` is `string | null`
  - `fetchPokemon(idOrName: string | number): Promise<PokemonDetail>` from `@/shared/services/pokemon-api`
  - `PokemonCard` from `@/features/pokemon/PokemonCard` — `Props: { pokemon: PokemonDetail; onClick: (p: PokemonDetail) => void }`
  - `LoadingSkeleton` from `@/features/pokemon/LoadingSkeleton`
  - `ErrorState` from `@/features/pokemon/ErrorState` — `Props: { error: Error; onRetry: () => void }`
  - `PokemonDetail` from `@/shared/types/pokemon`
- Produces:
  ```ts
  export function PokemonInfiniteGrid(): JSX.Element
  ```
  (no props — no Pokémon selection in this module)

- [ ] **Step 1: Create PokemonInfiniteGrid**

Create `src/features/module-05/PokemonInfiniteGrid.tsx`:

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'

export function PokemonInfiniteGrid() {
  const query = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const list = await fetchPokemonList(20, pageParam)
      const details = await Promise.all(
        list.results.map((p) => fetchPokemon(p.name)),
      )
      return { details, hasMore: !!list.next }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * 20 : undefined,
  })

  const pokemon = query.data?.pages.flatMap((p) => p.details) ?? []

  if (query.isPending) {
    return <LoadingSkeleton />
  }

  if (query.isError) {
    return (
      <ErrorState
        error={query.error as Error}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onClick={() => {}} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {query.hasNextPage && (
          <button
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
          </button>
        )}
        {!query.hasNextPage && pokemon.length > 0 && (
          <p className="text-sm text-gray-400">All {pokemon.length} Pokémon loaded</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/module-05/PokemonInfiniteGrid.tsx
git commit -m "feat: add PokemonInfiniteGrid with useInfiniteQuery and Load More button"
```

---

### Task 4: Create Module05Page and wire everything together

**Files:**
- Modify: `src/features/module-05/Module05Page.tsx` (replace the stub)

**Interfaces:**
- Consumes:
  - `PokemonInfiniteGrid` from `@/features/module-05/PokemonInfiniteGrid` — no props
  - `QueryInspector` from `@/features/inspector/QueryInspector`
  - `QueryActivity` from `@/features/activity/QueryActivity`
  - `EngineeringInsight05` from `@/features/module-05/panels/EngineeringInsight05`
  - `VisualDiagram05` from `@/features/module-05/panels/VisualDiagram05`
  - `SourceCodePanel05` from `@/features/module-05/panels/SourceCodePanel05`
  - `ModuleSummary05` from `@/features/module-05/panels/ModuleSummary05`
  - `LearningTabs` from `@/shared/components/LearningTabs`
- Produces: `export function Module05Page(): JSX.Element`

- [ ] **Step 1: Replace the Module05Page stub with the full implementation**

Replace the entire contents of `src/features/module-05/Module05Page.tsx`:

```tsx
import { PokemonInfiniteGrid } from '@/features/module-05/PokemonInfiniteGrid'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight05 } from '@/features/module-05/panels/EngineeringInsight05'
import { VisualDiagram05 } from '@/features/module-05/panels/VisualDiagram05'
import { SourceCodePanel05 } from '@/features/module-05/panels/SourceCodePanel05'
import { ModuleSummary05 } from '@/features/module-05/panels/ModuleSummary05'
import { LearningTabs } from '@/shared/components/LearningTabs'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight05 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram05 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel05 /> },
]

export function Module05Page() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 05 — Infinite Query</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click "Load More" to fetch the next 20 Pokémon. Watch the Inspector — each click adds a new item to <code className="text-xs bg-white/60 px-1 rounded">pages[]</code>.
          </p>
        </div>
        <PokemonInfiniteGrid />
        <ModuleSummary05 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Smoke test in browser**

```bash
npm run dev
```

Open `/module/05`. Verify:
- Grid loads first 20 Pokémon with skeleton on first load
- "Load More" button visible below the grid
- Click "Load More" → button text changes to "Loading…" and is disabled → 20 more Pokémon appear below the existing ones (cards do not disappear)
- Click "Load More" again → another 20 appear (total: 60)
- Inspector tab → `['pokemon', 'infinite']` entry shows `pages` array growing: `pages[0]`, then `pages[0, 1]`, then `pages[0, 1, 2]`
- Diagram tab → visual shows pages accumulation
- After all 1302 Pokémon are loaded (many clicks): "Load More" disappears, "All N Pokémon loaded" message appears

- [ ] **Step 4: Commit**

```bash
git add src/features/module-05/Module05Page.tsx
git commit -m "feat: complete Module 05 Infinite Query page"
```

---

## Final Verification Checklist

- [ ] `/module/05` accessible from nav and direct URL
- [ ] First load shows skeleton, then 20 Pokémon cards
- [ ] "Load More" button disabled during `isFetchingNextPage`, text shows "Loading…"
- [ ] Each "Load More" appends cards — existing cards never disappear
- [ ] `hasNextPage === false` → button hidden, count message shown
- [ ] Inspector shows `['pokemon', 'infinite']` with growing `pages[]`
- [ ] Diagram tab renders page accumulation visualization
- [ ] No Pokémon selection / bottom sheet (Module 05 focus is pagination only)
- [ ] `npm run build` exits 0
- [ ] `npm run test` passes
