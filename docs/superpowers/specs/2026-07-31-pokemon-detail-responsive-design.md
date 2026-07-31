# Pokémon Detail Responsive Consistency — Design Spec
Date: 2026-07-31

## Overview

Standardize the Pokémon detail information displayed across mobile, tablet, and desktop for Module 01, 02, and 03. Currently each context (bottom sheet, sidebar mini card, dedicated detail page) shows a different subset of fields — this spec makes them consistent via a shared `PokemonDetailCard` component.

## Problem

Three rendering contexts show different fields:

| Context | Current fields |
|---|---|
| `PokemonBottomSheet` (mobile/tablet) | sprite, nama, ID, tipe, tinggi, berat, all stats + bar |
| Sidebar mini card Module 01/03 (desktop) | sprite, nama, ID **only** |
| `PokemonDetailPage` Module 02 (all breakpoints) | sprite, nama, ID, tipe, 4 stats **only** |

Additionally, `TYPE_COLORS` is duplicated between `PokemonBottomSheet.tsx` and `PokemonDetailPage.tsx`.

## Approach

**Approach C — shared content component + thin wrappers per context.**

Extract a `PokemonDetailCard` component that renders the full detail fields. Each context wraps it with its own chrome (bottom sheet overlay, scrollable sidebar, page layout). This gives a single source of truth for *what* is displayed, while each context controls *how* it is presented.

## Detail Fields (Full)

All contexts show the same fields:

```
[Official Artwork sprite]
#025  Pikachu
⚡ electric              ← type badges

Height    Weight
0.4m      6.0kg

Abilities
[static]  [lightning-rod (hidden)]

Base Stats
hp         35  ████░░░░
attack     55  █████░░░
defense    40  ████░░░░
sp-atk     50  ████░░░░
sp-def     50  ████░░░░
speed      90  ██████░░
```

- **Stats progress bar:** `width = Math.min(100, (base_stat / 255) * 100)%` (255 = absolute max in any Pokémon)
- **Abilities:** display all abilities from `pokemon.abilities[]`, replace `-` with space, capitalize. Hidden abilities (`is_hidden: true`) get a `(hidden)` label
- **Type badges:** solid colors (tidak pakai glass), dari shared `TYPE_COLORS` constant

## Component Architecture

### New files

```
src/features/pokemon/PokemonDetailCard.tsx
src/shared/constants/pokemon-types.ts
```

### Modified files

```
src/features/pokemon/PokemonBottomSheet.tsx
src/features/module-01/Module01Page.tsx
src/features/module-03/Module03Page.tsx
src/features/module-02/PokemonDetailPage.tsx
```

### `PokemonDetailCard` props

```ts
interface PokemonDetailCardProps {
  pokemon: PokemonDetail
  size?: 'compact' | 'full'
}
```

- `size='compact'`: image `h-28 w-28`, padding `p-4`, nama `text-sm font-bold` — untuk desktop sidebar Module 01/03
- `size='full'`: image `h-40 w-40`, padding `p-6`, nama `text-2xl font-bold` — untuk bottom sheet dan Module 02 detail page
- Card wrapper menggunakan `glass-panel` (dari design system glassmorphism)

### `pokemon-types.ts`

Ekstrak `TYPE_COLORS` record yang saat ini terduplikasi di `PokemonBottomSheet.tsx` dan `PokemonDetailPage.tsx` ke satu file shared.

## Breakpoint Behavior

### Module 01 & 03 (in-page selection)

**Mobile + Tablet (`< lg`, `< 1024px`):**
- Grid/search results full-width
- Klik kartu → `PokemonBottomSheet` muncul (`lg:hidden`)
  - Menggunakan `PokemonDetailCard size="full"` di dalamnya
  - Slide-up animation, close button, overlay backdrop
- Learning Tabs **tersembunyi** (sudah ada via `hidden lg:block` di aside)

**Desktop (`≥ lg`, `≥ 1024px`):**
- Dua kolom: `flex-1` kiri + `w-80` kanan
- Sidebar kanan:
  - `[selected?]` scrollable container: `hidden lg:block max-h-72 overflow-y-auto rounded-2xl glass-panel mb-4`
    - Menggunakan `PokemonDetailCard size="compact"`
  - `LearningTabs` di bawahnya

### Module 02 (dedicated route `/module/02/pokemon/:name`)

**Mobile + Tablet (`< lg`):**
- `flex-col` layout (sudah default dari `flex flex-col gap-6 lg:flex-row`)
- Konten kiri stacked full-width:
  - `[← Back]` + cache badge
  - `PokemonDetailCard size="full"` (menggantikan inline detail saat ini)
  - Cache Demo tip box
- Aside stacked di bawah (full-width):
  - Tabs: Inspector, Activity, Insight, Diagram, Code

**Desktop (`≥ lg`):**
- Dua kolom: `flex-1` kiri + `w-80` kanan
- Kiri: `[← Back]` + cache badge + `PokemonDetailCard size="full"` + tip box
- Kanan: Tabs sidebar

## What Does NOT Change

- Breakpoint values — semua tetap menggunakan `lg:` (1024px) yang sudah ada
- `PokemonBottomSheet` chrome (overlay, animation, close button, `lg:hidden`)
- `LearningTabs` component
- Glassmorphism design system (`glass-panel`, `glass-header`)
- Type badge colors (solid, bukan glass)
- Cache badge + Cache Demo tip box di Module 02

## Files Summary

| File | Action | Reason |
|---|---|---|
| `src/shared/constants/pokemon-types.ts` | **Create** | Extract `TYPE_COLORS` (saat ini duplikat) |
| `src/features/pokemon/PokemonDetailCard.tsx` | **Create** | Shared full detail component |
| `src/features/pokemon/PokemonBottomSheet.tsx` | **Modify** | Gunakan `PokemonDetailCard`, hapus duplikat `TYPE_COLORS`, tambah abilities |
| `src/features/module-01/Module01Page.tsx` | **Modify** | Ganti mini card → scrollable `PokemonDetailCard size="compact"` |
| `src/features/module-03/Module03Page.tsx` | **Modify** | Sama seperti Module01Page |
| `src/features/module-02/PokemonDetailPage.tsx` | **Modify** | Gunakan `PokemonDetailCard size="full"`, hapus inline detail |

## Success Criteria

- Semua 3 modul menampilkan field yang sama: sprite, nama, ID, tipe, tinggi, berat, abilities, all stats + progress bar
- Bottom sheet (mobile/tablet) dan sidebar card (desktop) menggunakan satu komponen yang sama
- `TYPE_COLORS` tidak duplikat — satu file, diimport di mana perlu
- Desktop sidebar Module 01/03 scrollable dengan `max-h-72` sehingga Learning Tabs tetap terlihat
- Module 02 mobile/tablet: detail full-width, tabs stacked di bawah (scrollable page)
- Tidak ada regresi pada glassmorphism styling, animasi, atau Learning Tabs behavior
