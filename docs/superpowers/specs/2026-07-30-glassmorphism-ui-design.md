# Glassmorphism UI Revamp — Design Spec
Date: 2026-07-30

## Overview

Revamp the TanStack Query Playground's UI from a clean white/gray design to a full glassmorphism aesthetic. The background becomes a fixed sky-to-grass gradient (Pokémon GO daytime feel), and all UI surfaces — header, cards, panels — become glass (translucent + blurred).

## Approach

**Pendekatan C — `@utility` CSS classes** (chosen by user).

Define two reusable utility classes in `src/index.css` via Tailwind v4's `@utility`:
- `.glass-header` — for the sticky navigation bar (more transparent)
- `.glass-panel` — for cards, panels, and content surfaces (more opaque for readability)

These classes replace individual `bg-white`, `border-gray-100`, `shadow-sm` patterns throughout the codebase.

## Background Gradient

Applied at `body` level in `index.css` using `background-attachment: fixed` so the gradient stays stationary as the user scrolls — content floats over it.

```css
body {
  background: linear-gradient(
    to bottom,
    #87CEEB 0%,   /* langit biru cerah */
    #B8E0D4 45%,  /* transisi teal lembut */
    #4CAF50 100%  /* rumput hijau */
  );
  background-attachment: fixed;
}
```

`RootLayout` removes `bg-gray-50` so the gradient shows through.

## Glass Utilities

### `.glass-header`
More transparent — the gradient bleeds through strongly, creating depth behind navigation.

```css
@utility glass-header {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}
```

### `.glass-panel`
More opaque than header — educational content (code, diagrams, inspector) remains readable.

```css
@utility glass-panel {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: var(--radius);
}
```

## Components to Update

### `src/app/layout/RootLayout.tsx`
- Remove `bg-gray-50` from outer div (background now comes from `body`)

### `src/app/layout/Header.tsx`
- Replace `border-b border-gray-100 bg-white shadow-sm` → `glass-header`
- Nav active link: replace `[&.active]:bg-blue-500 [&.active]:text-white` → `[&.active]:bg-white/40 [&.active]:text-blue-700`
- Mobile dropdown: replace `bg-white shadow-md border-gray-100` → `glass-panel`

### `src/features/pokemon/PokemonCard.tsx`
- Replace `border border-gray-100 bg-white shadow-sm` → `glass-panel`
- Inner sprite container: replace `bg-gray-50` → `bg-white/30`
- Type badges: keep solid colors (readability), no glass treatment

### Module pages (Module01Page, Module02Page, Module03Page)
- Selected Pokémon preview panel: replace `border border-gray-100 bg-white shadow-sm` → `glass-panel`

### Educational panels (QueryInspector, QueryActivity, EngineeringInsight, VisualDiagram, SourceCodePanel + their module-02/03 variants)
- Any wrapper div with `bg-white border-gray-100 shadow-sm` → `glass-panel`

## What Does NOT Change

- Pokémon type badge colors (fire, water, grass, etc.) — remain solid for readability
- Text colors (`text-gray-800`, `text-gray-600`, `text-gray-400`) — remain as-is for contrast
- shadcn/ui component internals (Tabs, Button, etc.) — not modified
- Tailwind CSS variables in `:root` — not modified

## Files to Modify

1. `src/index.css` — add `@utility glass-header`, `@utility glass-panel`, update `body` background
2. `src/app/layout/RootLayout.tsx`
3. `src/app/layout/Header.tsx`
4. `src/features/pokemon/PokemonCard.tsx`
5. `src/features/module-01/Module01Page.tsx`
6. `src/features/module-02/Module02Page.tsx`
7. `src/features/module-03/Module03Page.tsx`
8. Educational panel wrappers (inspect each for `bg-white` usage)

## Success Criteria

- Body has a visible sky-blue → teal → grass-green gradient (fixed, not scrolling)
- Header is visibly translucent; background gradient shows through it
- Cards and panels have frosted glass appearance with readable content
- No white "box" artifacts (all `bg-white` replaced with glass equivalents)
- Pokémon type badges remain readable with their original colors
- Mobile responsive layout unchanged; mobile dropdown is also glass
