# Pokémon Detail Responsive Consistency — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize Pokémon detail fields (sprite, name, ID, types, height, weight, abilities, all stats + bar) across mobile/tablet/desktop for Module 01, 02, and 03 via a shared `PokemonDetailCard` component.

**Architecture:** Extract a `PokemonDetailCard` that renders the full detail content with no glass chrome of its own — each context (bottom sheet, sidebar, detail page) provides its own glass wrapper and padding. A shared `TYPE_COLORS` constant eliminates the current duplication between `PokemonBottomSheet` and `PokemonDetailPage`.

**Tech Stack:** React 19 + TypeScript strict + Tailwind CSS v4 + glassmorphism utilities (`glass-panel`) + `PokemonDetail` type from `@/shared/types/pokemon`

## Global Constraints

- Tailwind v4 CSS-first: no `tailwind.config.ts`, utility classes via `@utility` in `index.css`
- `glass-panel` utility already defined in `src/index.css` — use it, do not inline equivalent styles
- All breakpoints use `lg:` (1024px) — do not introduce new breakpoints
- `PokemonDetail` type lives in `src/shared/types/pokemon.ts` — do not redefine locally
- `size='compact'`: image `h-28 w-28`, name `text-sm font-bold` — for desktop sidebar Module 01/03
- `size='full'`: image `h-40 w-40`, name `text-2xl font-bold` — for bottom sheet and Module 02 detail page
- Stats progress bar max: 255 (`Math.min(100, (base_stat / 255) * 100)%`)
- No automated component tests — Vitest runs in `node` env without DOM. Verify via `npm run dev`.
- Run `npm run build` after each task to catch TypeScript errors before committing

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `src/shared/constants/pokemon-types.ts` | Single source for `TYPE_COLORS` record |
| **Create** | `src/features/pokemon/PokemonDetailCard.tsx` | Shared full-detail content component (no glass chrome) |
| **Modify** | `src/features/pokemon/PokemonBottomSheet.tsx` | Replace inline content with `PokemonDetailCard size="full"`, remove local `TYPE_COLORS` |
| **Modify** | `src/features/module-01/Module01Page.tsx` | Replace mini card with scrollable `PokemonDetailCard size="compact"` |
| **Modify** | `src/features/module-03/Module03Page.tsx` | Same as Module01Page |
| **Modify** | `src/features/module-02/PokemonDetailPage.tsx` | Replace inline detail section with `PokemonDetailCard size="full"`, remove local `TYPE_COLORS` |

---

### Task 1: Extract TYPE_COLORS to shared constant

**Files:**
- Create: `src/shared/constants/pokemon-types.ts`

**Interfaces:**
- Produces: `TYPE_COLORS: Record<string, string>` — used by Tasks 2, 3, 6

- [ ] **Step 1: Create the file**

```typescript
// src/shared/constants/pokemon-types.ts
export const TYPE_COLORS: Record<string, string> = {
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
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/shared/constants/pokemon-types.ts
git commit -m "feat: extract TYPE_COLORS to shared constant"
```

---

### Task 2: Create PokemonDetailCard component

**Files:**
- Create: `src/features/pokemon/PokemonDetailCard.tsx`

**Interfaces:**
- Consumes: `PokemonDetail` from `@/shared/types/pokemon`, `TYPE_COLORS` from `@/shared/constants/pokemon-types`
- Produces:
  ```ts
  interface PokemonDetailCardProps {
    pokemon: PokemonDetail
    size?: 'compact' | 'full'   // default: 'full'
  }
  export function PokemonDetailCard(props: PokemonDetailCardProps): JSX.Element
  ```

`PokemonDetailCard` renders ONLY the content — no glass background, no border, no shadow. The calling context provides the glass wrapper. The card's root `<div>` only carries internal padding (`p-4` compact, `p-6` full).

- [ ] **Step 1: Create the component**

```tsx
// src/features/pokemon/PokemonDetailCard.tsx
import type { PokemonDetail } from '@/shared/types/pokemon'
import { TYPE_COLORS } from '@/shared/constants/pokemon-types'

interface PokemonDetailCardProps {
  pokemon: PokemonDetail
  size?: 'compact' | 'full'
}

export function PokemonDetailCard({ pokemon, size = 'full' }: PokemonDetailCardProps) {
  const isCompact = size === 'compact'

  return (
    <div className={isCompact ? 'p-4' : 'p-6'}>
      {/* Sprite */}
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

      {/* Name & number */}
      <p className="mt-1 text-center text-xs text-gray-400">
        #{String(pokemon.id).padStart(3, '0')}
      </p>
      <p
        className={`text-center font-bold capitalize text-gray-800 ${
          isCompact ? 'text-sm' : 'text-2xl'
        }`}
      >
        {pokemon.name}
      </p>

      {/* Types */}
      <div className="mt-2 flex justify-center gap-2 flex-wrap">
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

      {/* Height & Weight */}
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

      {/* Abilities */}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Abilities
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2">
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

      {/* Base Stats */}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Base Stats
      </p>
      <div className="mt-1.5 space-y-1.5">
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
git add src/features/pokemon/PokemonDetailCard.tsx
git commit -m "feat: add PokemonDetailCard shared component with full detail fields"
```

---

### Task 3: Update PokemonBottomSheet to use PokemonDetailCard

**Files:**
- Modify: `src/features/pokemon/PokemonBottomSheet.tsx`

**Interfaces:**
- Consumes: `PokemonDetailCard` from `@/features/pokemon/PokemonDetailCard`
- Props unchanged: `{ pokemon: PokemonDetail; onClose: () => void }`

The bottom sheet chrome (overlay, slide-up, close button, `lg:hidden`, `max-h-[85vh] overflow-y-auto`) stays. The content div is replaced by `<PokemonDetailCard pokemon={pokemon} size="full" />`. Remove the `TYPE_COLORS` local definition and all inline content markup.

- [ ] **Step 1: Rewrite PokemonBottomSheet**

Replace the entire file content with:

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
      <div className="relative w-full rounded-t-2xl bg-white/60 backdrop-blur-[20px] border border-white/60 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-white/40 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <PokemonDetailCard pokemon={pokemon} size="full" />
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

- [ ] **Step 3: Dev server check — mobile/tablet**

```bash
npm run dev
```

Open Module 01 or 03 in browser. Resize window to mobile (<1024px). Click any Pokémon card.

Expected bottom sheet shows:
- Official artwork sprite (h-40)
- ID number (#025), name (2xl bold)
- Type badges with correct colors
- Height + Weight grid
- Abilities with (hidden) label where applicable
- All base stats (6 rows) with progress bars
- ✕ close button

- [ ] **Step 4: Commit**

```bash
git add src/features/pokemon/PokemonBottomSheet.tsx
git commit -m "feat: use PokemonDetailCard in PokemonBottomSheet, add abilities"
```

---

### Task 4: Update Module 01 desktop sidebar

**Files:**
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `PokemonDetailCard` from `@/features/pokemon/PokemonDetailCard`

Replace the `hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center` mini card div (which shows only sprite, name, ID) with a scrollable glass wrapper containing `PokemonDetailCard size="compact"`.

The `PokemonBottomSheet` is still present for mobile/tablet — it is unchanged.

- [ ] **Step 1: Update the import and sidebar card in Module01Page**

In `src/features/module-01/Module01Page.tsx`:

Add import:
```tsx
import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'
```

Replace the aside content from:
```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center">
    <img
      src={
        selected.sprites.other['official-artwork'].front_default ??
        selected.sprites.front_default ??
        ''
      }
      alt={selected.name}
      loading="eager"
      className="mx-auto h-28 w-28"
    />
    <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
    <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
  </div>
)}
```

To:
```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel overflow-y-auto max-h-72">
    <PokemonDetailCard pokemon={selected} size="compact" />
  </div>
)}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — desktop sidebar Module 01**

```bash
npm run dev
```

Open Module 01 at ≥1024px viewport. Click any Pokémon.

Expected sidebar shows:
- Compact sprite (h-28), small name (text-sm bold), ID
- Types, height, weight, abilities, all stats with bars
- Content scrollable if taller than 288px (`max-h-72`)
- LearningTabs remain visible below the card

- [ ] **Step 4: Commit**

```bash
git add src/features/module-01/Module01Page.tsx
git commit -m "feat: upgrade Module 01 desktop sidebar to full PokemonDetailCard"
```

---

### Task 5: Update Module 03 desktop sidebar

**Files:**
- Modify: `src/features/module-03/Module03Page.tsx`

**Interfaces:**
- Consumes: `PokemonDetailCard` from `@/features/pokemon/PokemonDetailCard`

Identical change to Task 4 — replace the `hidden lg:block` mini card div with scrollable `PokemonDetailCard size="compact"`.

- [ ] **Step 1: Update the import and sidebar card in Module03Page**

In `src/features/module-03/Module03Page.tsx`:

Add import:
```tsx
import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'
```

Replace the aside content from:
```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center">
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
```

To:
```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel overflow-y-auto max-h-72">
    <PokemonDetailCard pokemon={selected} size="compact" />
  </div>
)}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — desktop sidebar Module 03**

```bash
npm run dev
```

Open Module 03 at ≥1024px. Type a search term (e.g. "char"). Click any result.

Expected sidebar: same as Module 01 (compact sprite, all fields, scrollable, LearningTabs below).

- [ ] **Step 4: Commit**

```bash
git add src/features/module-03/Module03Page.tsx
git commit -m "feat: upgrade Module 03 desktop sidebar to full PokemonDetailCard"
```

---

### Task 6: Update Module 02 PokemonDetailPage

**Files:**
- Modify: `src/features/module-02/PokemonDetailPage.tsx`

**Interfaces:**
- Consumes: `PokemonDetailCard` from `@/features/pokemon/PokemonDetailCard`

Replace the inline `data && (...)` detail block (which shows sprite, name, types, 4 stats only) with `<PokemonDetailCard pokemon={data} size="full" />` inside the existing `glass-panel` wrapper. Remove the local `TYPE_COLORS` definition (no longer needed — used by `PokemonDetailCard` internally).

The cache badge, Back link, and tip box remain unchanged. The aside (Learning Tabs) is already `w-full lg:w-80` — it stacks below on mobile/tablet and sits in a sidebar on desktop.

- [ ] **Step 1: Rewrite the detail block in PokemonDetailPage**

In `src/features/module-02/PokemonDetailPage.tsx`:

1. Remove the `TYPE_COLORS` constant (lines 16–34).
2. Add import:
   ```tsx
   import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'
   ```
3. Replace the entire `{data && (...)}` block from:
   ```tsx
   {data && (
     <div className="rounded-2xl glass-panel p-6 sm:p-8">
       <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
         <img ... />
         <div className="text-center sm:text-left">
           <p className="text-3xl font-bold capitalize text-gray-900">{data.name}</p>
           <p className="text-gray-400">#{String(data.id).padStart(3, '0')}</p>
           <div className="mt-3 flex justify-center gap-2 sm:justify-start">
             {data.types.map((t) => (
               <span key={t.type.name} className={...}>{t.type.name}</span>
             ))}
           </div>
           <div className="mt-4 grid grid-cols-2 gap-3">
             {data.stats.slice(0, 4).map((s) => (
               <div key={s.stat.name}>
                 <p className="text-xs ...">{s.stat.name.replace('-', ' ')}</p>
                 <p className="text-lg font-bold text-gray-800">{s.base_stat}</p>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
   )}
   ```

   To:
   ```tsx
   {data && (
     <div className="rounded-2xl glass-panel">
       <PokemonDetailCard pokemon={data} size="full" />
     </div>
   )}
   ```

The loading and error states above this block (`isPending && cacheStatus === 'miss'`, `isError`) remain unchanged.

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Dev server check — Module 02 detail page (desktop)**

```bash
npm run dev
```

Open Module 02 at ≥1024px. Click any Pokémon.

Expected:
- Left column: Back link + cache badge, then glass card with full detail (sprite h-40, name 2xl, types, height, weight, abilities, ALL 6 stats + bars), then tip box
- Right column: Learning Tabs (Inspector, Activity, Insight, Diagram, Code)

- [ ] **Step 4: Dev server check — Module 02 detail page (mobile/tablet)**

Resize to <1024px.

Expected:
- Full-width: Back link + cache badge, glass card with full detail, tip box
- Learning Tabs stacked below (full-width, scrollable)
- No bottom sheet (Module 02 uses navigation, not in-page selection)

- [ ] **Step 5: Verify cache demo still works**

Go to Module 02 list. Click Bulbasaur → badge shows "🌐 Cache MISS". Go back → click Bulbasaur again → badge shows "✅ Cache HIT". Confirm the detail content still renders correctly both times.

- [ ] **Step 6: Run tests to confirm no regressions**

```bash
npm run test
```

Expected: all tests pass (tests cover the API service layer, not affected by UI changes).

- [ ] **Step 7: Commit**

```bash
git add src/features/module-02/PokemonDetailPage.tsx
git commit -m "feat: use PokemonDetailCard in Module 02 detail page, show all stats + abilities"
```

---

## Final Verification Checklist

After all 6 tasks:

- [ ] Module 01 mobile/tablet: bottom sheet shows sprite, types, height, weight, abilities, all stats
- [ ] Module 01 desktop: sidebar card shows same fields (compact), LearningTabs visible below
- [ ] Module 02 mobile/tablet: detail full-width, LearningTabs stacked below
- [ ] Module 02 desktop: detail left column, LearningTabs right column
- [ ] Module 03 mobile/tablet: bottom sheet shows same fields as Module 01
- [ ] Module 03 desktop: sidebar card same as Module 01
- [ ] `TYPE_COLORS` defined in exactly one place (`src/shared/constants/pokemon-types.ts`)
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run test` passes
