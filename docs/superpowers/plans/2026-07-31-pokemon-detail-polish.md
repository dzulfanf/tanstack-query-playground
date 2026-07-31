# Pokémon Detail Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate bottom sheet scroll by switching to compact size, and replace scrollable desktop detail cards with a 3-tab layout (Info/Stats/Abilities) across Module 01, 02, and 03.

**Architecture:** Create a new `PokemonDetailTabs` component (wrapping shadcn `Tabs`) that organizes detail fields into three focused tabs. The existing `PokemonDetailCard` is untouched — it remains in use in the bottom sheet at `size="compact"`. Each module's calling context provides the glass-panel wrapper as before.

**Tech Stack:** React 19 + TypeScript strict + Tailwind CSS v4 + shadcn/ui `Tabs` (already installed at `src/components/ui/tabs.tsx`)

## Global Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`; use utility classes only
- `glass-panel` provided by calling context — NOT inside `PokemonDetailTabs`
- All breakpoints use `lg:` (1024px) — no new breakpoints
- `TYPE_COLORS` imported from `@/shared/constants/pokemon-types`
- `PokemonDetail` type from `@/shared/types/pokemon`
- Stats bar formula: `Math.min(100, (base_stat / 255) * 100)%`
- Tab labels: exactly `Info`, `Stats`, `Abilities`; default tab: `"info"`
- `size='compact'`: image `h-28 w-28`, name `text-sm font-bold`, padding `p-4`
- `size='full'`: image `h-40 w-40`, name `text-2xl font-bold`, padding `p-6`
- No automated component tests — Vitest runs in node env without DOM
- Run `npm run build` after each task before committing

---

## File Map

| Action | File | Change |
|---|---|---|
| **Create** | `src/features/pokemon/PokemonDetailTabs.tsx` | New 3-tab detail component |
| **Modify** | `src/features/pokemon/PokemonBottomSheet.tsx` | `size="compact"`, remove `max-h-[85vh] overflow-y-auto` |
| **Modify** | `src/features/module-01/Module01Page.tsx` | Swap card → `PokemonDetailTabs`, remove `overflow-y-auto max-h-72` |
| **Modify** | `src/features/module-03/Module03Page.tsx` | Identical to Module 01 |
| **Modify** | `src/features/module-02/PokemonDetailPage.tsx` | Swap card → `PokemonDetailTabs size="full"` |

---

### Task 1: Create PokemonDetailTabs component

**Files:**
- Create: `src/features/pokemon/PokemonDetailTabs.tsx`

**Interfaces:**
- Consumes: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`; `TYPE_COLORS` from `@/shared/constants/pokemon-types`; `PokemonDetail` from `@/shared/types/pokemon`
- Produces:
  ```ts
  interface PokemonDetailTabsProps {
    pokemon: PokemonDetail
    size?: 'compact' | 'full'   // default: 'full'
  }
  export function PokemonDetailTabs(props: PokemonDetailTabsProps): JSX.Element
  ```

- [ ] **Step 1: Create the component**

```tsx
// src/features/pokemon/PokemonDetailTabs.tsx
import type { JSX } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PokemonDetail } from '@/shared/types/pokemon'
import { TYPE_COLORS } from '@/shared/constants/pokemon-types'

interface PokemonDetailTabsProps {
  pokemon: PokemonDetail
  size?: 'compact' | 'full'
}

export function PokemonDetailTabs({ pokemon, size = 'full' }: PokemonDetailTabsProps): JSX.Element {
  const isCompact = size === 'compact'
  const pad = isCompact ? 'p-4' : 'p-6'

  return (
    <Tabs defaultValue="info" className={pad}>
      <TabsList className="w-full grid grid-cols-3 mb-3">
        <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
        <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
        <TabsTrigger value="abilities" className="text-xs">Abilities</TabsTrigger>
      </TabsList>

      {/* Info tab: sprite, name, ID, types, height, weight */}
      <TabsContent value="info" className="mt-3">
        <div className="flex justify-center">
          <img
            src={
              pokemon.sprites.other['official-artwork'].front_default ??
              pokemon.sprites.front_default ??
              ''
            }
            alt={pokemon.name}
            className={`object-contain ${isCompact ? 'h-28 w-28' : 'h-40 w-40'}`}
          />
        </div>
        <p className="mt-1 text-center text-xs text-gray-400">
          #{String(pokemon.id).padStart(3, '0')}
        </p>
        <p className={`text-center font-bold capitalize text-gray-800 ${isCompact ? 'text-sm' : 'text-2xl'}`}>
          {pokemon.name}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`rounded-full px-3 py-0.5 text-sm font-medium capitalize ${
                TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/30 p-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Height</p>
            <p className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
              {(pokemon.height / 10).toFixed(1)}m
            </p>
          </div>
          <div className="rounded-xl bg-white/30 p-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Weight</p>
            <p className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
              {(pokemon.weight / 10).toFixed(1)}kg
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Stats tab: all base stats with progress bars */}
      <TabsContent value="stats" className="mt-3">
        <div className="space-y-1.5">
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium capitalize text-gray-500">
                {s.stat.name.replace(/-/g, ' ')}
              </span>
              <span className="w-7 shrink-0 text-right text-xs font-bold text-gray-800">
                {s.base_stat}
              </span>
              <div className="flex-1 rounded-full bg-white/40 h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-400 transition-all"
                  style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Abilities tab: ability badge pills */}
      <TabsContent value="abilities" className="mt-3">
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.ability.name}
              className="rounded-full bg-white/30 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700"
            >
              {a.ability.name.replace(/-/g, ' ')}
              {a.is_hidden && (
                <span className="ml-1 text-gray-400">(hidden)</span>
              )}
            </span>
          ))}
        </div>
      </TabsContent>
    </Tabs>
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
git add src/features/pokemon/PokemonDetailTabs.tsx
git commit -m "feat: add PokemonDetailTabs component with Info/Stats/Abilities tabs"
```

---

### Task 2: Update PokemonBottomSheet — compact size, no scroll

**Files:**
- Modify: `src/features/pokemon/PokemonBottomSheet.tsx`

**Interfaces:**
- Consumes: `PokemonDetailCard` from `@/features/pokemon/PokemonDetailCard` (already imported)
- Props unchanged: `{ pokemon: PokemonDetail; onClose: () => void }`

Two changes to the container div:
1. Remove `max-h-[85vh] overflow-y-auto`
2. Change `size="full"` → `size="compact"` on `PokemonDetailCard`

- [ ] **Step 1: Update the container div and size prop**

Replace the entire file with:

```tsx
// src/features/pokemon/PokemonBottomSheet.tsx
import { X } from 'lucide-react'
import type { PokemonDetail } from '@/shared/types/pokemon'
import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'

interface Props {
  pokemon: PokemonDetail
  onClose: () => void
}

export function PokemonBottomSheet({ pokemon, onClose }: Props) {
  return (
    <div className="lg:hidden fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full rounded-t-2xl bg-white/60 backdrop-blur-[20px] border border-white/60 shadow-xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-white/40 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <PokemonDetailCard pokemon={pokemon} size="compact" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — bottom sheet mobile**

```bash
npm run dev
```

Open Module 01 in browser. Resize to mobile (<1024px). Click any Pokémon.

Expected: bottom sheet slides up, shows compact detail (sprite h-28, small name), all fields visible without scrolling. Close button works. Overlay dismisses on tap.

- [ ] **Step 4: Commit**

```bash
git add src/features/pokemon/PokemonBottomSheet.tsx
git commit -m "feat: bottom sheet uses compact size, remove max-h scroll cap"
```

---

### Task 3: Update Module 01 desktop sidebar — swap to PokemonDetailTabs

**Files:**
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `PokemonDetailTabs` from `@/features/pokemon/PokemonDetailTabs` (add import)
- Remove import: `PokemonDetailCard` (no longer used in this file after change)

Replace the `PokemonDetailCard` in the sidebar wrapper with `PokemonDetailTabs`, and remove `overflow-y-auto max-h-72` from the wrapper div.

- [ ] **Step 1: Update import and sidebar in Module01Page**

In `src/features/module-01/Module01Page.tsx`:

1. Remove: `import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'`
2. Add: `import { PokemonDetailTabs } from '@/features/pokemon/PokemonDetailTabs'`
3. Replace the aside's selected block from:

```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel overflow-y-auto max-h-72">
    <PokemonDetailCard pokemon={selected} size="compact" />
  </div>
)}
```

To:

```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel">
    <PokemonDetailTabs pokemon={selected} size="compact" />
  </div>
)}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0. No unused import warnings.

- [ ] **Step 3: Dev server check — Module 01 desktop sidebar**

Open Module 01 at ≥1024px. Click any Pokémon.

Expected sidebar:
- Glass card appears above LearningTabs
- Three tabs: Info | Stats | Abilities
- Info tab (default): sprite h-28, name text-sm, types, height, weight
- Stats tab: 6 rows with progress bars, no scroll
- Abilities tab: badge pills
- No overflow/scroll on the card

- [ ] **Step 4: Commit**

```bash
git add src/features/module-01/Module01Page.tsx
git commit -m "feat: Module 01 desktop sidebar uses PokemonDetailTabs instead of scrollable card"
```

---

### Task 4: Update Module 03 desktop sidebar — swap to PokemonDetailTabs

**Files:**
- Modify: `src/features/module-03/Module03Page.tsx`

**Interfaces:**
- Consumes: `PokemonDetailTabs` from `@/features/pokemon/PokemonDetailTabs` (add import)
- Remove import: `PokemonDetailCard` (no longer used in this file after change)

Identical change as Task 3.

- [ ] **Step 1: Update import and sidebar in Module03Page**

In `src/features/module-03/Module03Page.tsx`:

1. Remove: `import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'`
2. Add: `import { PokemonDetailTabs } from '@/features/pokemon/PokemonDetailTabs'`
3. Replace the aside's selected block from:

```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel overflow-y-auto max-h-72">
    <PokemonDetailCard pokemon={selected} size="compact" />
  </div>
)}
```

To:

```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel">
    <PokemonDetailTabs pokemon={selected} size="compact" />
  </div>
)}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — Module 03 desktop sidebar**

Open Module 03 at ≥1024px. Type a search term (e.g. `"char"`). Click any result.

Expected: same as Module 01 sidebar — 3 tabs, no scroll, LearningTabs visible below.

- [ ] **Step 4: Commit**

```bash
git add src/features/module-03/Module03Page.tsx
git commit -m "feat: Module 03 desktop sidebar uses PokemonDetailTabs instead of scrollable card"
```

---

### Task 5: Update Module 02 PokemonDetailPage — swap to PokemonDetailTabs

**Files:**
- Modify: `src/features/module-02/PokemonDetailPage.tsx`

**Interfaces:**
- Consumes: `PokemonDetailTabs` from `@/features/pokemon/PokemonDetailTabs` (add import)
- Remove import: `PokemonDetailCard` (no longer used after change — verify it appears only in the data block)

Replace `PokemonDetailCard pokemon={data} size="full"` with `PokemonDetailTabs pokemon={data} size="full"`. The glass-panel wrapper div stays. All other elements (Back link, cache badge, loading skeleton, error state, amber tip box, Learning Tabs aside) stay unchanged.

- [ ] **Step 1: Update import and data block in PokemonDetailPage**

In `src/features/module-02/PokemonDetailPage.tsx`:

1. Remove: `import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'`
2. Add: `import { PokemonDetailTabs } from '@/features/pokemon/PokemonDetailTabs'`
3. Replace the data block from:

```tsx
{data && (
  <div className="rounded-2xl glass-panel">
    <PokemonDetailCard pokemon={data} size="full" />
  </div>
)}
```

To:

```tsx
{data && (
  <div className="rounded-2xl glass-panel">
    <PokemonDetailTabs pokemon={data} size="full" />
  </div>
)}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — Module 02 detail page desktop**

Open Module 02 at ≥1024px. Click any Pokémon.

Expected left column:
- Back link + cache badge
- Glass card with 3 tabs (Info/Stats/Abilities) — `size="full"` so image is h-40, name is 2xl
- Amber tip box below
Right column: Learning Tabs (Inspector, Activity, Insight, Diagram, Code) unchanged.

- [ ] **Step 4: Dev server check — Module 02 detail page mobile**

Resize to <1024px. Open a Pokémon detail.

Expected: full-width layout, glass card with 3 tabs stacked above Learning Tabs — same tabs, just full-width. No scroll within the card.

- [ ] **Step 5: Verify cache demo still works**

Go to Module 02 list → click Bulbasaur → badge shows "🌐 Cache MISS". Go back → click Bulbasaur again → badge shows "✅ Cache HIT". Detail tabs render correctly on both visits.

- [ ] **Step 6: Run tests**

```bash
npm run test
```

Expected: 11/11 pass.

- [ ] **Step 7: Commit**

```bash
git add src/features/module-02/PokemonDetailPage.tsx
git commit -m "feat: Module 02 detail page uses PokemonDetailTabs for Info/Stats/Abilities"
```

---

## Final Verification Checklist

After all 5 tasks:

- [ ] Bottom sheet (mobile/tablet, Module 01 & 03): no scroll, compact sprite h-28, all fields visible
- [ ] Module 01 desktop sidebar: 3 tabs, no scroll wrapper, LearningTabs below
- [ ] Module 02 desktop detail page: 3 tabs in left column (`size="full"`), cache badge + tip box unchanged
- [ ] Module 03 desktop sidebar: 3 tabs, identical to Module 01
- [ ] `PokemonDetailCard` still used correctly in bottom sheet (`size="compact"`)
- [ ] `PokemonDetailTabs` imported from `@/features/pokemon/PokemonDetailTabs` in all 3 module files
- [ ] `npm run build` exits 0
- [ ] `npm run test` passes 11/11
