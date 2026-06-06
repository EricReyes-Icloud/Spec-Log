# Tasks: Spec Log Info Page (`/spec-log-info`)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~140 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: CSS Foundation

- [x] 1.1 **Create `src/styles/spec-log-info.css`** — layout and heading styles (`.spec-log-info-main`, `.spec-log-info-heading`, `.spec-log-info-heading-brand`) using `@reference "./globals.css"` and `@layer components`
- [x] 1.2 **Create `src/styles/spec-log-accordion.css`** — accordion container, items, chevron rotation (0° → 90°), answer reveal animation (`max-height: 0` → `500px`), brand colors

## Phase 2: Component Implementation

- [x] 2.1 **Extend `src/components/landing/MacHeader.tsx`** — add `MacHeaderProps` interface with `showTimer` (default `true`), `buttonHref` (default GitHub URL), `buttonText` (default `"spec-log"`). Render `<div className="flex-1" />` when `showTimer=false`. Landing call site unchanged.
- [x] 2.2 **Create `src/components/landing/SpecLogAccordion.tsx`** — `"use client"` component with `openIndex: number | null` state, nine questions from spec array, one-open-at-a-time toggle, chevron `▸`/`▾`, answer area with conditional `open` class
- [x] 2.3 **Create `src/app/spec-log-info/page.tsx`** — server component composing `MacHeader` (`showTimer=false`, `buttonHref="/"`, `buttonText="landing"`), centered heading ("Descubre todo sobre Spec Log" with orange highlight), `SpecLogAccordion`, `Footer`

## Phase 3: Verification

- [x] 3.1 **Build** — run `next build`, confirm zero new warnings
- [ ] 3.2 **Manual review** — visit `/spec-log-info` and verify MacHeader (no timer, `{ } landing` → `/`), heading, nine-item accordion (open/switch/close), Footer. Verify landing `/` is visually unchanged.
