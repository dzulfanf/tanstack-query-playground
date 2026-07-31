# Glassmorphism UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's white/gray UI surfaces with full glassmorphism — blurry transparent panels floating over a fixed sky-to-grass gradient background.

**Architecture:** Two `@utility` CSS classes (`glass-header`, `glass-panel`) defined in `src/index.css` using Tailwind v4 `@utility` syntax. Body-level fixed gradient provides the backdrop. Components swap `bg-white`/`bg-gray-50`/`border-gray-100`/`shadow-sm` for the utility classes plus `bg-white/30` for secondary inner surfaces. `glass-panel` intentionally does NOT set `border-radius` — each component keeps its own `rounded-*` class.

**Tech Stack:** React, Tailwind CSS v4, shadcn/ui, TypeScript, Vite

## Global Constraints

- Do not modify shadcn/ui component internals (Tabs, Button, Badge, etc.)
- Do not change Tailwind CSS variables in `:root` or `.dark`
- Do not change text colors (`text-gray-*`) — keep for contrast on glass
- Do not change Pokémon type badge colors — they remain solid for readability
- `glass-panel` does NOT include `border-radius` — each component uses its own `rounded-*`
- Dev server: `npm run dev` in project root → `http://localhost:5173`
- This is pure styling work — no unit tests. Verification = visual inspection in browser.

---

### Task 1: CSS Foundation

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: `.glass-header` and `.glass-panel` utility classes available globally; `body` has fixed gradient background

- [ ] **Step 1: Update `body` in `@layer base`**

In `src/index.css`, find the `@layer base` block and replace the `body` rule:

```css
/* OLD */
body {
  @apply bg-background text-foreground;
}

/* NEW */
body {
  @apply text-foreground;
  background: linear-gradient(
    to bottom,
    #87CEEB 0%,
    #B8E0D4 45%,
    #4CAF50 100%
  );
  background-attachment: fixed;
  min-height: 100vh;
}
```

- [ ] **Step 2: Add `@utility` classes**

After the closing `}` of the `@theme inline { ... }` block (around line 92), add:

```css
@utility glass-header {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

@utility glass-panel {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173`. The page background should show a sky-blue → teal → grass-green gradient. The page content may look broken until later tasks — that's expected.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: add glass-header/glass-panel utilities and sky-to-grass gradient"
```

---

### Task 2: Layout Layer

**Files:**
- Modify: `src/app/layout/RootLayout.tsx`
- Modify: `src/app/layout/Header.tsx`

**Interfaces:**
- Consumes: `glass-header` from Task 1
- Produces: transparent sticky header; body background visible through layout

- [ ] **Step 1: Update `RootLayout.tsx`**

In `src/app/layout/RootLayout.tsx`, change the outer `div`:

```tsx
/* OLD */
<div className="min-h-screen bg-gray-50">

/* NEW */
<div className="min-h-screen">
```

- [ ] **Step 2: Update `Header.tsx` — outer `<header>` element**

In `src/app/layout/Header.tsx` (line 17), change:

```tsx
/* OLD */
<header className="relative sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">

/* NEW */
<header className="relative sticky top-0 z-50 glass-header">
```

- [ ] **Step 3: Update `Header.tsx` — desktop nav link active + hover states**

In `Header.tsx`, find the desktop nav `<Link>` className:

```tsx
/* OLD */
className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 [&.active]:bg-blue-500 [&.active]:text-white"

/* NEW */
className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-white/30 hover:text-blue-700 [&.active]:bg-white/40 [&.active]:text-blue-700 [&.active]:font-semibold"
```

- [ ] **Step 4: Update `Header.tsx` — mobile hamburger button**

```tsx
/* OLD */
className="sm:hidden rounded-full p-1.5 text-gray-600 hover:bg-gray-100 transition"

/* NEW */
className="sm:hidden rounded-full p-1.5 text-gray-700 hover:bg-white/30 transition"
```

- [ ] **Step 5: Update `Header.tsx` — mobile dropdown**

```tsx
/* OLD */
<div className="sm:hidden absolute top-full left-0 right-0 border-t border-gray-100 bg-white shadow-md px-4 py-2">

/* NEW */
<div className="sm:hidden absolute top-full left-0 right-0 glass-panel rounded-none border-t border-white/25 px-4 py-2">
```

Note: `rounded-none` overrides the component's own rounding since the dropdown spans full-width flush to the header.

- [ ] **Step 6: Run dev server and verify**

Open `http://localhost:5173`. The header should be visibly translucent with the gradient bleeding through. Hover a nav link — you should see a soft white pill. The active link shows a white/40 glass pill with blue text. Scroll — header stays sticky and blurry over content.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout/RootLayout.tsx src/app/layout/Header.tsx
git commit -m "style: apply glassmorphism to RootLayout and Header"
```

---

### Task 3: Shared Pokémon Components

**Files:**
- Modify: `src/features/pokemon/PokemonCard.tsx`
- Modify: `src/features/pokemon/LoadingSkeleton.tsx`
- Modify: `src/features/pokemon/PokemonBottomSheet.tsx`

**Interfaces:**
- Consumes: `glass-panel` from Task 1

- [ ] **Step 1: Update `PokemonCard.tsx` — card wrapper (line 37)**

```tsx
/* OLD */
className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"

/* NEW */
className="group cursor-pointer rounded-2xl glass-panel p-3 transition hover:bg-white/60 hover:shadow-lg"
```

- [ ] **Step 2: Update `PokemonCard.tsx` — sprite container (line 39)**

```tsx
/* OLD */
className="flex h-20 items-center justify-center rounded-xl bg-gray-50"

/* NEW */
className="flex h-20 items-center justify-center rounded-xl bg-white/30"
```

- [ ] **Step 3: Update `LoadingSkeleton.tsx` — card wrapper**

```tsx
/* OLD */
className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"

/* NEW */
className="rounded-2xl glass-panel p-4"
```

- [ ] **Step 4: Update `PokemonBottomSheet.tsx` — main sheet container (line 34)**

```tsx
/* OLD */
<div className="relative w-full rounded-t-2xl bg-white shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">

/* NEW */
<div className="relative w-full rounded-t-2xl bg-white/50 backdrop-blur-[16px] border border-white/55 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">
```

Note: Using inline values instead of `glass-panel` here because the bottom sheet needs `rounded-t-2xl` only (top corners), not all corners.

- [ ] **Step 5: Update `PokemonBottomSheet.tsx` — sticky header (line 37)**

```tsx
/* OLD */
<div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-white px-5 py-3 border-b border-gray-100">

/* NEW */
<div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-white/50 backdrop-blur-[16px] px-5 py-3 border-b border-white/25">
```

- [ ] **Step 6: Update `PokemonBottomSheet.tsx` — height/weight boxes (lines 81 and 87)**

Both occurrences:

```tsx
/* OLD */
<div className="rounded-xl bg-gray-50 p-2 text-center">

/* NEW */
<div className="rounded-xl bg-white/30 p-2 text-center">
```

- [ ] **Step 7: Update `PokemonBottomSheet.tsx` — stat bar background (line 108)**

```tsx
/* OLD */
<div className="flex-1 rounded-full bg-gray-100 h-1.5">

/* NEW */
<div className="flex-1 rounded-full bg-white/40 h-1.5">
```

- [ ] **Step 8: Run dev server and verify**

Navigate to `/module/01`. Pokémon cards should appear as frosted glass panels. On a mobile viewport (DevTools), tap a card — the bottom sheet should be translucent glass with gradient visible through it.

- [ ] **Step 9: Commit**

```bash
git add src/features/pokemon/PokemonCard.tsx src/features/pokemon/LoadingSkeleton.tsx src/features/pokemon/PokemonBottomSheet.tsx
git commit -m "style: apply glass treatment to PokemonCard, LoadingSkeleton, PokemonBottomSheet"
```

---

### Task 4: Inspector & Activity Panels

**Files:**
- Modify: `src/features/inspector/QueryInspector.tsx`
- Modify: `src/features/activity/QueryActivity.tsx`

**Interfaces:**
- Consumes: `glass-panel` from Task 1

- [ ] **Step 1: Update `QueryInspector.tsx` — `Field` component divider (line 28)**

```tsx
/* OLD */
<div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">

/* NEW */
<div className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
```

- [ ] **Step 2: Update `QueryInspector.tsx` — empty state (line 59)**

```tsx
/* OLD */
<div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-400">

/* NEW */
<div className="rounded-xl bg-white/30 p-4 text-center text-xs text-gray-500">
```

- [ ] **Step 3: Update `QueryInspector.tsx` — outer wrapper (line 79)**

```tsx
/* OLD */
<div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

/* NEW */
<div className="rounded-2xl glass-panel p-4">
```

- [ ] **Step 4: Update `QueryInspector.tsx` — query key box (line 82)**

```tsx
/* OLD */
<div className="mb-3 rounded-lg bg-gray-50 px-2 py-1">

/* NEW */
<div className="mb-3 rounded-lg bg-white/30 px-2 py-1">
```

- [ ] **Step 5: Update `QueryActivity.tsx` — outer wrapper (line 51)**

```tsx
/* OLD */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

/* NEW */
<div className="rounded-2xl glass-panel">
```

- [ ] **Step 6: Update `QueryActivity.tsx` — header divider (line 52)**

```tsx
/* OLD */
<div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

/* NEW */
<div className="flex items-center justify-between border-b border-white/25 px-4 py-3">
```

- [ ] **Step 7: Run dev server and verify**

Navigate to `/module/01`. The Inspector and Activity panels in the right sidebar should be frosted glass. Click a Pokémon — the Inspector should update and remain clearly readable through the glass.

- [ ] **Step 8: Commit**

```bash
git add src/features/inspector/QueryInspector.tsx src/features/activity/QueryActivity.tsx
git commit -m "style: apply glass treatment to QueryInspector and QueryActivity"
```

---

### Task 5: Module 01 Panels

**Files:**
- Modify: `src/features/module-01/panels/EngineeringInsight.tsx`
- Modify: `src/features/module-01/panels/VisualDiagram.tsx`
- Modify: `src/features/module-01/panels/SourceCodePanel.tsx`
- Modify: `src/features/module-01/panels/ModuleSummary.tsx`
- Modify: `src/features/module-01/Module01Page.tsx`

**Interfaces:**
- Consumes: `glass-panel` from Task 1

- [ ] **Step 1: Update `EngineeringInsight.tsx` — wrapper + dividers**

```tsx
/* OLD (line 32) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 33) */
  <div className="border-b border-gray-100 px-4 py-3">
/* OLD (line 36) */
<div className="divide-y divide-gray-50 px-4">

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
<div className="divide-y divide-white/20 px-4">
```

- [ ] **Step 2: Update `VisualDiagram.tsx` — wrapper + divider**

```tsx
/* OLD (line 12) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 13) */
  <div className="border-b border-gray-100 px-4 py-3">

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
```

- [ ] **Step 3: Update `SourceCodePanel.tsx` — wrapper, divider, and code background**

```tsx
/* OLD (line 27) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
/* OLD (line 28) */
  <div className="border-b border-gray-100 px-4 py-3">
/* OLD (SyntaxHighlighter customStyle) */
customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: '#fafafa' }}

/* NEW */
<div className="rounded-2xl glass-panel overflow-hidden">
  <div className="border-b border-white/25 px-4 py-3">
customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: 'rgba(255,255,255,0.3)' }}
```

- [ ] **Step 4: Update `ModuleSummary.tsx` — outer wrapper (line 10)**

```tsx
/* OLD */
<div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

/* NEW */
<div className="mt-8 rounded-2xl border border-blue-200/40 bg-blue-100/30 backdrop-blur-[12px] p-6">
```

- [ ] **Step 5: Update `ModuleSummary.tsx` — inner white cards (lines 15 and 19)**

Both occurrences:

```tsx
/* OLD */
<div className="rounded-xl bg-white p-4 shadow-sm">

/* NEW */
<div className="rounded-xl bg-white/40 p-4">
```

- [ ] **Step 6: Update `Module01Page.tsx` — selected Pokémon preview panel (line 35)**

```tsx
/* OLD */
<div className="hidden lg:block mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">

/* NEW */
<div className="hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center">
```

- [ ] **Step 7: Run dev server and verify**

Navigate to `/module/01`. All right-sidebar panels (Engineering Insight, Visual Diagram, Source Code) should be frosted glass. The Module Summary at the bottom should have a blue-tinted glass look. The syntax highlighter code background should be semi-transparent.

- [ ] **Step 8: Commit**

```bash
git add src/features/module-01/panels/EngineeringInsight.tsx src/features/module-01/panels/VisualDiagram.tsx src/features/module-01/panels/SourceCodePanel.tsx src/features/module-01/panels/ModuleSummary.tsx src/features/module-01/Module01Page.tsx
git commit -m "style: apply glass treatment to Module 01 panels and page"
```

---

### Task 6: Module 02 Components

**Files:**
- Modify: `src/features/module-02/panels/EngineeringInsight02.tsx`
- Modify: `src/features/module-02/panels/VisualDiagram02.tsx`
- Modify: `src/features/module-02/panels/SourceCodePanel02.tsx`
- Modify: `src/features/module-02/panels/ModuleSummary02.tsx`
- Modify: `src/features/module-02/PokemonCacheGrid.tsx`
- Modify: `src/features/module-02/PokemonDetailPage.tsx`

**Interfaces:**
- Consumes: `glass-panel` from Task 1

- [ ] **Step 1: Update `EngineeringInsight02.tsx` — wrapper + divider**

```tsx
/* OLD (line 30) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 31) */
  <div className="border-b border-gray-100 px-4 py-3">

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
```

- [ ] **Step 2: Update `VisualDiagram02.tsx` — wrapper + divider**

```tsx
/* OLD (line 34) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 35) */
  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="flex items-center justify-between border-b border-white/25 px-4 py-3">
```

- [ ] **Step 3: Update `SourceCodePanel02.tsx` — wrapper, divider, and code background**

```tsx
/* OLD (line 28) */
<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
/* NEW */
<div className="overflow-hidden rounded-2xl glass-panel">
```

```tsx
/* OLD (line 29) */
  <div className="border-b border-gray-100 px-4 py-3">
/* NEW */
  <div className="border-b border-white/25 px-4 py-3">
```

```tsx
/* OLD (line 35 — SyntaxHighlighter customStyle) */
customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: '#fafafa' }}
/* NEW */
customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: 'rgba(255,255,255,0.3)' }}
```

- [ ] **Step 4: Update `ModuleSummary02.tsx` — outer wrapper (line 20)**

```tsx
/* OLD */
<div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">

/* NEW */
<div className="mt-8 rounded-2xl border border-green-200/40 bg-green-100/30 backdrop-blur-[12px] p-6">
```

- [ ] **Step 5: Update `ModuleSummary02.tsx` — inner white cards (lines 23 and 29)**

Both occurrences:

```tsx
/* OLD */
<div className="rounded-xl bg-white p-4 shadow-sm">

/* NEW */
<div className="rounded-xl bg-white/40 p-4">
```

- [ ] **Step 6: Update `PokemonCacheGrid.tsx` — card wrapper (around line 63)**

```tsx
/* OLD */
className="group block rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"

/* NEW */
className="group block rounded-2xl glass-panel p-3 transition hover:bg-white/60 hover:shadow-lg"
```

- [ ] **Step 7: Update `PokemonCacheGrid.tsx` — sprite container (around line 65)**

```tsx
/* OLD */
<div className="flex h-20 items-center justify-center rounded-xl bg-gray-50">

/* NEW */
<div className="flex h-20 items-center justify-center rounded-xl bg-white/30">
```

- [ ] **Step 8: Update `PokemonDetailPage.tsx` — back button (line 58)**

```tsx
/* OLD */
className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"

/* NEW */
className="rounded-full bg-white/30 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white/50"
```

- [ ] **Step 9: Update `PokemonDetailPage.tsx` — main content panel (line 84)**

```tsx
/* OLD */
<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

/* NEW */
<div className="rounded-2xl glass-panel p-6 sm:p-8">
```

- [ ] **Step 10: Update `PokemonDetailPage.tsx` — amber tip box (line 125)**

```tsx
/* OLD */
<div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">

/* NEW */
<div className="mt-4 rounded-2xl border border-amber-200/40 bg-amber-100/30 backdrop-blur-[12px] p-4">
```

- [ ] **Step 11: Run dev server and verify**

Navigate to `/module/02`. Click a Pokémon card — detail page should be fully glass. Check:
- Cache HIT/MISS badge still readable (green/red solid — unchanged)
- Amber tip box has amber-tinted glass
- Back button is subtle glass pill
- Navigate back, click same Pokémon — badge shows ✅ Cache HIT

- [ ] **Step 12: Commit**

```bash
git add src/features/module-02/panels/EngineeringInsight02.tsx src/features/module-02/panels/VisualDiagram02.tsx src/features/module-02/panels/SourceCodePanel02.tsx src/features/module-02/panels/ModuleSummary02.tsx src/features/module-02/PokemonCacheGrid.tsx src/features/module-02/PokemonDetailPage.tsx
git commit -m "style: apply glass treatment to Module 02 components"
```

---

### Task 7: Module 03 Components

**Files:**
- Modify: `src/features/module-03/panels/EngineeringInsight03.tsx`
- Modify: `src/features/module-03/panels/VisualDiagram03.tsx`
- Modify: `src/features/module-03/panels/SourceCodePanel03.tsx`
- Modify: `src/features/module-03/panels/ModuleSummary03.tsx`
- Modify: `src/features/module-03/Module03Page.tsx`

**Interfaces:**
- Consumes: `glass-panel` from Task 1

- [ ] **Step 1: Update `EngineeringInsight03.tsx` — wrapper + divider**

```tsx
/* OLD (line 30) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 31) */
  <div className="border-b border-gray-100 px-4 py-3">

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
```

- [ ] **Step 2: Update `VisualDiagram03.tsx` — wrapper + divider + cache entry rows**

```tsx
/* OLD (line 28) */
<div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 29) */
  <div className="border-b border-gray-100 px-4 py-3">
/* OLD (line 54 — cache entry row) */
className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"

/* NEW */
<div className="rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
/* NEW (line 54) */
className="flex items-center justify-between rounded-lg border border-white/30 bg-white/30 px-3 py-2"
```

- [ ] **Step 3: Update `SourceCodePanel03.tsx` — wrapper, divider, and code background**

```tsx
/* OLD (line 23) */
<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
/* OLD (line 24) */
  <div className="border-b border-gray-100 px-4 py-3">
/* OLD (SyntaxHighlighter customStyle) */
background: '#fafafa'

/* NEW */
<div className="overflow-hidden rounded-2xl glass-panel">
  <div className="border-b border-white/25 px-4 py-3">
background: 'rgba(255,255,255,0.3)'
```

- [ ] **Step 4: Update `ModuleSummary03.tsx` — outer wrapper (line 22)**

```tsx
/* OLD */
<div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6">

/* NEW */
<div className="mt-8 rounded-2xl border border-purple-200/40 bg-purple-100/30 backdrop-blur-[12px] p-6">
```

- [ ] **Step 5: Update `ModuleSummary03.tsx` — inner white cards (lines 26 and 32)**

Both occurrences:

```tsx
/* OLD */
<div className="rounded-xl bg-white p-4 shadow-sm">

/* NEW */
<div className="rounded-xl bg-white/40 p-4">
```

- [ ] **Step 6: Update `Module03Page.tsx` — search input (line 31)**

```tsx
/* OLD */
className="mb-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base sm:text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

/* NEW */
className="mb-4 w-full rounded-2xl glass-panel px-4 py-3 text-base sm:text-sm outline-none focus:border-blue-300/60 focus:ring-2 focus:ring-blue-100/40"
```

- [ ] **Step 7: Update `Module03Page.tsx` — selected Pokémon preview (line 41)**

```tsx
/* OLD */
<div className="hidden lg:block mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">

/* NEW */
<div className="hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center">
```

- [ ] **Step 8: Run dev server and verify**

Navigate to `/module/03`. Type "char" in the search box — results appear as glass cards. Open the Diagram tab and watch cache entries appear as glass rows. Type "char" again — instant result. Module Summary has purple-tinted glass background.

- [ ] **Step 9: Commit**

```bash
git add src/features/module-03/panels/EngineeringInsight03.tsx src/features/module-03/panels/VisualDiagram03.tsx src/features/module-03/panels/SourceCodePanel03.tsx src/features/module-03/panels/ModuleSummary03.tsx src/features/module-03/Module03Page.tsx
git commit -m "style: apply glass treatment to Module 03 components"
```
