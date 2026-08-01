# Module 04 — Background Fetching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Module 04 that makes TanStack Query's background refetch behavior visible via a staleTime control, a manual refetch button, and a status strip that appears when `isFetching && !isPending`.

**Architecture:** A single new page (`Module04Page`) wraps a new `PokemonRefetchGrid` component that holds staleTime state and renders controls + status strip above the existing grid pattern. Four panel files provide the learning content for the right sidebar. Route and nav are wired before any component work.

**Tech Stack:** React 18 + TypeScript strict + Vite 6 + TanStack Query v5 + TanStack Router v1 + Tailwind CSS v4 + shadcn/ui + `react-syntax-highlighter`

## Global Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`; use utility classes only
- `glass-panel` utility already in `src/index.css` — use it, do not inline equivalent styles
- All breakpoints use `lg:` (1024px) — do not introduce new breakpoints
- `PokemonDetail` type from `@/shared/types/pokemon`
- `fetchPokemonList`, `fetchPokemon` from `@/shared/services/pokemon-api`
- No automated component tests — Vitest runs in node env without DOM
- Run `npm run build` after each task before committing
- TanStack Router v1: add routes via `createRoute`, register in `routeTree`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Modify** | `src/app/router.tsx` | Add module04Route, add to routeTree |
| **Modify** | `src/app/layout/Header.tsx` | Add Module 04 to MODULES array |
| **Create** | `src/features/module-04/panels/EngineeringInsight04.tsx` | isFetching vs isPending explanation |
| **Create** | `src/features/module-04/panels/VisualDiagram04.tsx` | State machine: pending → success → background fetching |
| **Create** | `src/features/module-04/panels/SourceCodePanel04.tsx` | Annotated PokemonRefetchGrid source |
| **Create** | `src/features/module-04/panels/ModuleSummary04.tsx` | 3 key takeaways |
| **Create** | `src/features/module-04/PokemonRefetchGrid.tsx` | Grid + staleTime controls + status strip |
| **Create** | `src/features/module-04/Module04Page.tsx` | Two-column page layout |

---

### Task 1: Add Module 04 route and nav link

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Header.tsx`

**Interfaces:**
- Consumes: `Module04Page` (imported but not yet created — TypeScript will fail; create a stub in the same commit)
- Produces: `/module/04` route accessible in the app

- [ ] **Step 1: Create a stub Module04Page so the import resolves**

Create `src/features/module-04/Module04Page.tsx`:

```tsx
export function Module04Page() {
  return <div className="p-8 text-gray-500">Module 04 — coming soon</div>
}
```

- [ ] **Step 2: Add the route to router.tsx**

In `src/app/router.tsx`, add the import after the module03 import:

```tsx
import { Module04Page } from '@/features/module-04/Module04Page'
```

Add the route definition after `module03Route`:

```tsx
export const module04Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/module/04',
  component: Module04Page,
})
```

Update `routeTree` to include `module04Route`:

```tsx
const routeTree = rootRoute.addChildren([
  indexRoute,
  module01Route,
  module02Route,
  module02DetailRoute,
  module03Route,
  module04Route,
])
```

- [ ] **Step 3: Add Module 04 to the Header nav**

In `src/app/layout/Header.tsx`, update the `MODULES` array:

```tsx
const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02' },
  { id: '03', label: 'Query Keys', path: '/module/03' },
  { id: '04', label: 'Background Fetching', path: '/module/04' },
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

Open browser → confirm "Background Fetching" appears in nav → click it → `/module/04` loads the stub text.

- [ ] **Step 6: Commit**

```bash
git add src/features/module-04/Module04Page.tsx src/app/router.tsx src/app/layout/Header.tsx
git commit -m "feat: add Module 04 route and nav link"
```

---

### Task 2: Create panel files

**Files:**
- Create: `src/features/module-04/panels/EngineeringInsight04.tsx`
- Create: `src/features/module-04/panels/VisualDiagram04.tsx`
- Create: `src/features/module-04/panels/SourceCodePanel04.tsx`
- Create: `src/features/module-04/panels/ModuleSummary04.tsx`

**Interfaces:**
- Consumes: `react-syntax-highlighter` (already installed — used in Module 01)
- Produces: four named exports used by `Module04Page` in Task 4

- [ ] **Step 1: Create EngineeringInsight04**

Create `src/features/module-04/panels/EngineeringInsight04.tsx`:

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
    content: 'Background data refreshes are invisible — users see stale data without knowing a refresh is happening in the background.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'TanStack Query refetches data when the window regains focus or when staleTime expires. But nothing in the UI shows this is happening unless you render it.',
  },
  {
    emoji: '⚠️',
    label: 'The Distinction',
    content: 'isPending is true only when there is no cached data yet. isFetching is true whenever any network request is active — including silent background refreshes.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'Check isFetching && !isPending to detect a background refresh. Show a subtle indicator — never replace existing data with a loading skeleton.',
  },
]

export function EngineeringInsight04() {
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

- [ ] **Step 2: Create VisualDiagram04**

Create `src/features/module-04/panels/VisualDiagram04.tsx`:

```tsx
interface FlowStep {
  icon: string
  label: string
  highlight?: boolean
}

const FLOW_STEPS: FlowStep[] = [
  { icon: '⏳', label: 'No data → isPending: true, isFetching: true' },
  { icon: '✅', label: 'First load done → isPending: false, isFetching: false' },
  { icon: '👁️', label: 'Window focus / staleTime expired' },
  { icon: '🔄', label: 'Background refetch → isFetching: true', highlight: true },
  { icon: '📋', label: 'Status strip appears — grid stays visible', highlight: true },
  { icon: '✅', label: 'Refetch done → isFetching: false' },
  { icon: '💾', label: 'Cache updated silently' },
]

export function VisualDiagram04() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium w-full justify-center ${
                  step.highlight
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200/60'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
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

- [ ] **Step 3: Create SourceCodePanel04**

Create `src/features/module-04/panels/SourceCodePanel04.tsx`:

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

function PokemonRefetchGrid() {
  const [staleTimeMs, setStaleTimeMs] = useState(0)

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
    staleTime: staleTimeMs,   // 0 = always stale, Infinity = never stale
  })

  // isFetching && !isPending = background refresh (data already exists)
  const isBackgroundFetching = isFetching && !isPending

  if (isPending) return <LoadingSkeleton />  // first load only
  if (isError)   return <ErrorState />

  return (
    <div>
      {/* staleTime toggle buttons */}
      <button onClick={() => setStaleTimeMs(0)}>Always Stale</button>
      <button onClick={() => setStaleTimeMs(30_000)}>30s Fresh</button>
      <button onClick={() => setStaleTimeMs(Infinity)}>Forever Fresh</button>

      {/* Manual trigger */}
      <button onClick={() => refetch()}>Refetch Now</button>

      {/* Subtle background indicator — never a skeleton */}
      {isBackgroundFetching && <div>🔄 Background fetching…</div>}

      <PokemonGrid pokemon={data} />
    </div>
  )
}`

export function SourceCodePanel04() {
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

- [ ] **Step 4: Create ModuleSummary04**

Create `src/features/module-04/panels/ModuleSummary04.tsx`:

```tsx
const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'isPending = no data at all. isFetching = any active request. They can both be true (first load) or only isFetching (background refresh).',
  },
  {
    emoji: '📋',
    text: 'Show a subtle indicator when isFetching && !isPending. Never replace existing data with a loading skeleton during a background refresh.',
  },
  {
    emoji: '⏱️',
    text: 'staleTime controls when data becomes stale. 0 = always stale (refetch on every focus). Infinity = never refetch automatically.',
  },
]

export function ModuleSummary04() {
  return (
    <div className="mt-8 rounded-2xl border border-yellow-200/40 bg-yellow-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-yellow-900">✅ Module 04 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Background refetches are invisible. Users see stale data without knowing a refresh is happening.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">Use <code className="text-xs bg-white/60 px-1 rounded">isFetching && !isPending</code> to detect background refreshes and show a subtle indicator.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-yellow-900">{t.text}</p>
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

Expected: exits 0, no TypeScript errors. (Panel files not yet used — that's fine.)

- [ ] **Step 6: Commit**

```bash
git add src/features/module-04/panels/
git commit -m "feat: add Module 04 panel files (Insight, Diagram, Code, Summary)"
```

---

### Task 3: Create PokemonRefetchGrid

**Files:**
- Create: `src/features/module-04/PokemonRefetchGrid.tsx`

**Interfaces:**
- Consumes:
  - `useQuery` from `@tanstack/react-query`
  - `fetchPokemonList(limit: number, offset: number): Promise<PokemonListResponse>` from `@/shared/services/pokemon-api`
  - `fetchPokemon(idOrName: string | number): Promise<PokemonDetail>` from `@/shared/services/pokemon-api`
  - `PokemonCard` from `@/features/pokemon/PokemonCard` — `Props: { pokemon: PokemonDetail; onClick: (p: PokemonDetail) => void }`
  - `LoadingSkeleton` from `@/features/pokemon/LoadingSkeleton`
  - `ErrorState` from `@/features/pokemon/ErrorState` — `Props: { error: Error; onRetry: () => void }`
  - `PokemonDetail` from `@/shared/types/pokemon`
- Produces:
  ```ts
  interface Props {
    onSelect: (pokemon: PokemonDetail) => void
  }
  export function PokemonRefetchGrid(props: Props): JSX.Element
  ```

- [ ] **Step 1: Create PokemonRefetchGrid**

Create `src/features/module-04/PokemonRefetchGrid.tsx`:

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import type { PokemonDetail } from '@/shared/types/pokemon'

const STALE_OPTIONS = [
  { label: 'Always Stale (0s)', value: 0 },
  { label: '30s Fresh', value: 30_000 },
  { label: 'Forever Fresh', value: Infinity },
] as const

interface Props {
  onSelect: (pokemon: PokemonDetail) => void
}

export function PokemonRefetchGrid({ onSelect }: Props) {
  const [staleTimeMs, setStaleTimeMs] = useState<number>(0)

  const listQuery = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
    staleTime: staleTimeMs,
  })

  const detailQueries = useQuery({
    queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
    queryFn: async () => {
      const details = await Promise.all(
        listQuery.data!.results.map((p) => fetchPokemon(p.name)),
      )
      return details
    },
    enabled: !!listQuery.data,
    staleTime: staleTimeMs,
  })

  const isBackgroundFetching = listQuery.isFetching && !listQuery.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600">staleTime:</span>
        {STALE_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setStaleTimeMs(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              staleTimeMs === opt.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => void listQuery.refetch()}
          className="ml-auto rounded-full bg-white/40 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white/60 transition"
        >
          Refetch Now
        </button>
      </div>

      {isBackgroundFetching && (
        <div className="rounded-xl bg-yellow-50/80 border border-yellow-200/60 px-4 py-2 text-sm text-yellow-800">
          🔄 Background fetching…
        </div>
      )}

      {listQuery.isPending || detailQueries.isPending ? (
        <LoadingSkeleton />
      ) : listQuery.isError ? (
        <ErrorState
          error={listQuery.error as Error}
          onRetry={() => void listQuery.refetch()}
        />
      ) : detailQueries.isError ? (
        <ErrorState
          error={detailQueries.error as Error}
          onRetry={() => void detailQueries.refetch()}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(detailQueries.data ?? []).map((p) => (
            <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
          ))}
        </div>
      )}
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
git add src/features/module-04/PokemonRefetchGrid.tsx
git commit -m "feat: add PokemonRefetchGrid with staleTime controls and background fetch status strip"
```

---

### Task 4: Create Module04Page and wire everything together

**Files:**
- Modify: `src/features/module-04/Module04Page.tsx` (replace the stub)

**Interfaces:**
- Consumes:
  - `PokemonRefetchGrid` from `@/features/module-04/PokemonRefetchGrid` — `Props: { onSelect: (p: PokemonDetail) => void }`
  - `PokemonBottomSheet` from `@/features/pokemon/PokemonBottomSheet` — `Props: { pokemon: PokemonDetail; onClose: () => void }`
  - `QueryInspector` from `@/features/inspector/QueryInspector`
  - `QueryActivity` from `@/features/activity/QueryActivity`
  - `EngineeringInsight04` from `@/features/module-04/panels/EngineeringInsight04`
  - `VisualDiagram04` from `@/features/module-04/panels/VisualDiagram04`
  - `SourceCodePanel04` from `@/features/module-04/panels/SourceCodePanel04`
  - `ModuleSummary04` from `@/features/module-04/panels/ModuleSummary04`
  - `LearningTabs` from `@/shared/components/LearningTabs`
  - `PokemonDetail` from `@/shared/types/pokemon`
- Produces: `export function Module04Page(): JSX.Element`

- [ ] **Step 1: Replace the Module04Page stub with the full implementation**

Replace the entire contents of `src/features/module-04/Module04Page.tsx`:

```tsx
import { useState } from 'react'
import { PokemonRefetchGrid } from '@/features/module-04/PokemonRefetchGrid'
import { PokemonBottomSheet } from '@/features/pokemon/PokemonBottomSheet'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight04 } from '@/features/module-04/panels/EngineeringInsight04'
import { VisualDiagram04 } from '@/features/module-04/panels/VisualDiagram04'
import { SourceCodePanel04 } from '@/features/module-04/panels/SourceCodePanel04'
import { ModuleSummary04 } from '@/features/module-04/panels/ModuleSummary04'
import { LearningTabs } from '@/shared/components/LearningTabs'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight04 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram04 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel04 /> },
]

export function Module04Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 04 — Background Fetching</h1>
          <p className="mt-1 text-sm text-gray-500">
            Change staleTime or click "Refetch Now" — watch the yellow banner appear while the grid stays visible.
          </p>
        </div>
        <PokemonRefetchGrid onSelect={setSelected} />
        <ModuleSummary04 />
      </div>

      {selected && <PokemonBottomSheet pokemon={selected} onClose={() => setSelected(null)} />}

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

Open `/module/04`. Verify:
- Grid loads 20 Pokémon with skeleton first
- "Always Stale (0s)" button is highlighted (default)
- Click "Refetch Now" → yellow banner `"🔄 Background fetching…"` appears briefly, then disappears — grid never shows skeleton
- Switch to "Forever Fresh" → click "Refetch Now" → banner still appears (manual refetch always fires)
- Inspector tab → observe `['pokemon', 'list']` entry with `fetchStatus: 'fetching'` during banner, `fetchStatus: 'idle'` when done
- Mobile (<1024px): click a card → bottom sheet slides up

- [ ] **Step 4: Commit**

```bash
git add src/features/module-04/Module04Page.tsx
git commit -m "feat: complete Module 04 Background Fetching page"
```

---

## Final Verification Checklist

- [ ] `/module/04` accessible from nav and direct URL
- [ ] Grid loads with skeleton on first visit, no skeleton on subsequent refetches
- [ ] "Always Stale (0s)" triggers background refetch on window focus (switch tab → return → banner flashes)
- [ ] "Refetch Now" always triggers background refetch when data is loaded
- [ ] "Forever Fresh" prevents automatic background refetches but manual refetch still works
- [ ] Yellow status strip only visible during `isFetching && !isPending`
- [ ] Inspector shows correct `fetchStatus` values
- [ ] Mobile bottom sheet works for Pokémon selection
- [ ] `npm run build` exits 0
- [ ] `npm run test` passes
