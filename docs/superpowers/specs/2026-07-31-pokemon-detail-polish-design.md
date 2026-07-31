# Pokémon Detail Polish — Bottom Sheet & Desktop Tabs Design Spec
Date: 2026-07-31

## Overview

Two polish improvements to the Pokémon detail UI:
1. **Bottom sheet auto-fit** — eliminate scroll by switching to `size="compact"` and removing the height cap
2. **Desktop detail tabs** — replace long scrollable/card detail with 3-tab layout (Info / Stats / Abilities) for Module 01, 02, and 03 desktop views

## Change 1: Bottom Sheet Auto-Fit

**File:** `src/features/pokemon/PokemonBottomSheet.tsx`

Two changes to the sheet container div:
- Remove `max-h-[85vh]` and `overflow-y-auto` — the sheet grows naturally to fit its content
- Change `<PokemonDetailCard pokemon={pokemon} size="full" />` → `size="compact"`

**Result:** With `size="compact"` (image h-28, compact padding), the sheet renders at approximately 420–450px tall — well within the viewport of any modern phone without requiring scroll. The `fixed inset-0` overlay and slide-up animation are unchanged.

```tsx
// After change
<div className="relative w-full rounded-t-2xl bg-white/60 backdrop-blur-[20px]
                border border-white/60 shadow-xl animate-slide-up">
  <PokemonDetailCard pokemon={pokemon} size="compact" />
```

## Change 2: Desktop Detail Tabs

### New component

**File:** `src/features/pokemon/PokemonDetailTabs.tsx`

A shared tabbed detail component using shadcn `Tabs` (already installed at `src/components/ui/tabs.tsx`). No new dependencies.

**Props:**
```ts
interface PokemonDetailTabsProps {
  pokemon: PokemonDetail
  size?: 'compact' | 'full'   // default: 'full'
}
```

**Three tabs:**

| Tab | Contents |
|---|---|
| **Info** | Sprite (h-28 compact / h-40 full), name, ID, type badges, height, weight |
| **Stats** | All 6 base stats with progress bars (`Math.min(100, (base_stat/255)*100)%`) |
| **Abilities** | Ability badge pills; hidden abilities labeled `(hidden)` |

- Default tab: `"info"`
- Tab labels: `Info` | `Stats` | `Abilities`
- Inner padding: `p-4` (compact) or `p-6` (full) — same as `PokemonDetailCard`
- No `max-h` or `overflow-y-auto` inside the component — natural height, no scroll

**Glass wrapper:** provided by each calling context (same pattern as `PokemonDetailCard`)

### Usage per context

**Module 01 sidebar desktop** (`src/features/module-01/Module01Page.tsx`):
```tsx
{selected && (
  <div className="hidden lg:block mb-4 rounded-2xl glass-panel">
    <PokemonDetailTabs pokemon={selected} size="compact" />
  </div>
)}
```
Remove `overflow-y-auto max-h-72` from wrapper (tabs eliminate the need for scroll).

**Module 03 sidebar desktop** (`src/features/module-03/Module03Page.tsx`):
Identical change as Module 01.

**Module 02 detail page left column** (`src/features/module-02/PokemonDetailPage.tsx`):
```tsx
{data && (
  <div className="rounded-2xl glass-panel">
    <PokemonDetailTabs pokemon={data} size="full" />
  </div>
)}
```
Replace `<PokemonDetailCard pokemon={data} size="full" />` with `<PokemonDetailTabs>`.

## What Does NOT Change

- `PokemonDetailCard` — unchanged, still used in bottom sheet (`size="compact"`)
- `PokemonBottomSheet` chrome — overlay, slide-up animation, close button, `lg:hidden`
- All breakpoints — still `lg:` (1024px)
- `LearningTabs` and educational panels — untouched
- `TYPE_COLORS` in `src/shared/constants/pokemon-types.ts` — imported by `PokemonDetailTabs`
- Stats bar formula: `Math.min(100, (base_stat / 255) * 100)%`

## Files Summary

| File | Action | Change |
|---|---|---|
| `src/features/pokemon/PokemonDetailTabs.tsx` | **Create** | New 3-tab detail component |
| `src/features/pokemon/PokemonBottomSheet.tsx` | **Modify** | `size="compact"`, remove `max-h-[85vh] overflow-y-auto` |
| `src/features/module-01/Module01Page.tsx` | **Modify** | Swap `PokemonDetailCard` → `PokemonDetailTabs`, remove `overflow-y-auto max-h-72` |
| `src/features/module-03/Module03Page.tsx` | **Modify** | Identical to Module 01 |
| `src/features/module-02/PokemonDetailPage.tsx` | **Modify** | Swap `PokemonDetailCard` → `PokemonDetailTabs size="full"` |

## Success Criteria

- Bottom sheet on mobile/tablet: no scroll required, all fields visible in compact view
- Module 01/03 desktop sidebar: 3 tabs (Info/Stats/Abilities), no scroll, glass-panel wrapper
- Module 02 desktop detail page: 3 tabs in left column, no scroll within the card
- `PokemonDetailCard` still works correctly in bottom sheet with `size="compact"`
- `npm run build` exits 0
