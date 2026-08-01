# Module 05 — Infinite Query: Design Spec

**Date:** 2026-07-31
**Status:** Approved

## Problem

`useInfiniteQuery` enables paginated data loading where results accumulate across pages — but the mechanics (page params, `getNextPageParam`, `pages.flatMap()`) are non-obvious. Module 05 makes the page accumulation visible and teaches the three key APIs: `fetchNextPage`, `hasNextPage`, and `isFetchingNextPage`.

## Core Learning Goals

1. Understand how `useInfiniteQuery` differs from `useQuery` — data is a `pages` array, not a flat list
2. Understand `getNextPageParam` — how TanStack Query knows whether more data exists and what to request
3. Know how to surface `isFetchingNextPage` for a "Load More" UX without blocking the already-loaded cards

## Architecture

### File Map

```
src/features/module-05/
  Module05Page.tsx              ← page layout (two-column, same as other modules)
  PokemonInfiniteGrid.tsx       ← infinite grid + Load More button
  panels/
    EngineeringInsight05.tsx
    VisualDiagram05.tsx
    SourceCodePanel05.tsx
    ModuleSummary05.tsx
```

Add route `/module/05` in `src/app/router.tsx`. Add nav link in `src/app/layout/Header.tsx`.

### No new shared components — all logic is local to module-05.

## Component Design: PokemonInfiniteGrid

### Query

```ts
const query = useInfiniteQuery({
  queryKey: ['pokemon', 'infinite'],
  queryFn: async ({ pageParam }) => {
    const list = await fetchPokemonList(20, pageParam)
    const details = await Promise.all(
      list.results.map((p) => fetchPokemon(p.name))
    )
    return { details, hasMore: !!list.next }
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) =>
    lastPage.hasMore ? allPages.length * 20 : undefined,
})
```

Uses a distinct query key `['pokemon', 'infinite']` — separate from `['pokemon', 'list']` used in Modules 01–04. This keeps Module 05's cache entry isolated in the Inspector so users can observe the `pages` array growing without confusion from other modules' entries.

### Data Flattening

```ts
const pokemon = query.data?.pages.flatMap((p) => p.details) ?? []
```

All loaded Pokémon from all pages are rendered in a single grid — cards accumulate below existing ones when more pages load.

### Load More Button

Rendered below the grid:

```ts
{query.hasNextPage && (
  <button
    onClick={() => void query.fetchNextPage()}
    disabled={query.isFetchingNextPage}
  >
    {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
  </button>
)}
{!query.hasNextPage && pokemon.length > 0 && (
  <p>All Pokémon loaded ({pokemon.length} total)</p>
)}
```

- `disabled` when `isFetchingNextPage` — prevents double-fetch
- Text changes to `"Loading…"` during fetch — visible feedback without hiding existing cards
- Button disappears when `hasNextPage === false`, replaced by count message

### First Load

`isPending === true` → show `LoadingSkeleton` (same as other modules). No change to the first-load UX.

### Error State

`isError` → show `ErrorState` with `onRetry={() => void query.refetch()}`.

### No Pokémon selection / bottom sheet

Module 05 focuses purely on pagination behavior. No `onSelect`, no `PokemonBottomSheet`, no desktop sidebar detail card. Clicking a card does nothing.

## Panel Designs

### Inspector

Reuse `QueryInspector` — shows `['pokemon', 'infinite']` cache entry. After each Load More, users can observe `pages` array growing from `[page0]` to `[page0, page1]`, etc.

### Activity

Reuse `QueryActivity` — event log shows each `fetch` and `success` event per page load.

### Insight (EngineeringInsight05)

Content covers:
- Why `useInfiniteQuery` returns `{ pages, pageParams }` instead of flat data
- What `getNextPageParam` does: returning `undefined` signals no more pages; returning a value becomes the next `pageParam`
- Why `isFetchingNextPage` is separate from `isFetching`: it lets you keep existing cards visible while loading the next batch
- The `initialPageParam` requirement in TanStack Query v5 (breaking change from v4)

### Diagram (VisualDiagram05)

Visual showing the pages array accumulating:

```
pages[0]: [Bulbasaur … Raticate]       ← initial load
pages[1]: [Fearow … Arcanine]          ← after first Load More
pages[2]: [Poliwrath … Haunter]        ← after second Load More
          ↓ flatMap
[Bulbasaur … Haunter]                  ← what the grid renders
```

### Source Code (SourceCodePanel05)

Full source of `PokemonInfiniteGrid`. Highlights:
1. `useInfiniteQuery` import and call
2. `initialPageParam` and `getNextPageParam`
3. `pages.flatMap()` to flatten into the grid
4. `isFetchingNextPage` on the Load More button

### Summary (ModuleSummary05)

Three key takeaways:
1. `useInfiniteQuery` stores data as `pages[]` — use `flatMap` to render as a flat list.
2. `getNextPageParam` returning `undefined` means "no more pages." Any other value becomes the next `pageParam`.
3. `isFetchingNextPage` lets you show a loading indicator on the button without hiding already-loaded cards.

## Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`
- `glass-panel` utility from `src/index.css`
- All breakpoints use `lg:` (1024px)
- No automated component tests (Vitest runs in node env)
- Run `npm run build` after each task
- TanStack Query v5: `initialPageParam` is required (not optional like in v4)
