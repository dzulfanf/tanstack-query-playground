# Module 04 — Background Fetching: Design Spec

**Date:** 2026-07-31
**Status:** Approved

## Problem

TanStack Query silently refetches stale data in the background — but this is invisible to the user unless explicitly rendered. Module 04 makes this invisible behavior visible and teaches the critical distinction between `isPending` (no data yet) and `isFetching` (any active request, including background refreshes).

## Core Learning Goals

1. Understand `isFetching` vs `isPending` — why they are different and when each is true
2. Understand when background refetches are triggered (window focus, staleTime expiry, manual)
3. Know how to surface background fetching state in UI without disrupting the user experience

## Architecture

### File Map

```
src/features/module-04/
  Module04Page.tsx              ← page layout (two-column, same as Module 01)
  PokemonRefetchGrid.tsx        ← grid + staleTime controls + status strip
  panels/
    EngineeringInsight04.tsx
    VisualDiagram04.tsx
    SourceCodePanel04.tsx
    ModuleSummary04.tsx
```

Add route `/module/04` in `src/app/router.tsx`. Add nav link in `src/app/layout/Header.tsx`.

### No new shared components — all logic is local to module-04.

## Component Design: PokemonRefetchGrid

### State

```ts
const [staleTimeMs, setStaleTimeMs] = useState(0)
```

### Query

```ts
const listQuery = useQuery({
  queryKey: ['pokemon', 'list'],
  queryFn: () => fetchPokemonList(20, 0),
  staleTime: staleTimeMs,
})

const detailQueries = useQuery({
  queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
  queryFn: async () => {
    const details = await Promise.all(
      listQuery.data!.results.map((p) => fetchPokemon(p.name))
    )
    return details
  },
  enabled: !!listQuery.data,
  staleTime: staleTimeMs,
})
```

Reuses `['pokemon', 'list']` query key — this means the cache state is shared with Modules 01 and 02, which is intentional: the Inspector will show the same cache entry being manipulated differently.

### staleTime Controls

Three toggle buttons rendered above the grid:

| Label | staleTimeMs | Teaching point |
|-------|-------------|----------------|
| Always Stale (0s) | `0` | Every window focus triggers a background refetch |
| 30s Fresh | `30_000` | Refetch only if data is older than 30 seconds |
| Forever Fresh | `Infinity` | Never background refetch automatically |

On staleTime change: update state. No manual invalidation needed — the new staleTime takes effect on the next staleness check.

### Manual Refetch Button

```ts
<button onClick={() => void listQuery.refetch()}>Refetch Now</button>
```

When data is already loaded (`!isPending`), calling `refetch()` triggers a background refetch: grid stays visible, status strip appears.

### Status Strip

Renders between the controls and the grid:

- `isPending`: strip is hidden (skeleton handles first-load UX)
- `isFetching && !isPending`: yellow banner `"🔄 Background fetching…"` appears
- `!isFetching`: strip is hidden (no UI clutter when idle)

### Error and Loading States

Same as Module 01: `LoadingSkeleton` during `isPending`, `ErrorState` on error.

## Panel Designs

### Inspector

Reuse `QueryInspector` — shows live `['pokemon', 'list']` cache entry. User can observe `fetchStatus: 'fetching'` while banner is visible, and `fetchStatus: 'idle'` when done.

### Activity

Reuse `QueryActivity` — event log shows `fetch` and `success` events firing during background refetches.

### Insight (EngineeringInsight04)

Content covers:
- Why `isFetching` ≠ `isPending`: `isPending` is true only when there is no cached data; `isFetching` is true whenever any network request is in flight
- The UX contract: never show a loading skeleton during a background refetch — show a subtle indicator instead
- When TanStack Query triggers background refetches: `refetchOnWindowFocus`, `staleTime` expiry, `refetchInterval`, manual `refetch()`

### Diagram (VisualDiagram04)

State machine diagram:

```
[no data] --fetch--> [pending + fetching]
                          |
                     [success: data shown]
                          |
         (window focus / staleTime expired / manual refetch)
                          |
                 [success + background fetching]  ← status strip shows here
                          |
                     [success: data updated]
```

### Source Code (SourceCodePanel04)

Full source of `PokemonRefetchGrid`. Highlights:
1. `staleTime: staleTimeMs` on the query
2. `isFetching && !isPending` condition for the status strip
3. `listQuery.refetch()` on the manual refetch button

### Summary (ModuleSummary04)

Three key takeaways:
1. `isPending` = no data at all. `isFetching` = any active network request.
2. Show background fetching with a subtle indicator — never replace data with a skeleton.
3. Control when refetches happen via `staleTime`, `refetchOnWindowFocus`, and `refetchInterval`.

## Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`
- `glass-panel` utility from `src/index.css`
- All breakpoints use `lg:` (1024px)
- No automated component tests (Vitest runs in node env)
- Run `npm run build` after each task
