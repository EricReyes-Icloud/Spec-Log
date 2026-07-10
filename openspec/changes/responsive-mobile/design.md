# Design: Responsive Mobile Adaptation

## Technical Approach

Mobile-first CSS: default (<640px) is the mobile baseline. Progressive enhancement at `sm:640px` adds spacing/air, `lg:1024px` restores current desktop layout. All changes in existing CSS modules — no new files, one style property adjustment in existing raw CSS.

Three CSS patterns used:

1. **`@apply` with responsive prefixes** (`sm:`, `lg:`) for simple value swaps (padding, gap, font-size)
2. **Native `@media (width >= 640px)` / `@media (width >= 1024px)`** for structural layout changes (flex-direction, display type)
3. **Default CSS values = mobile** — no `@media` query needed for <640px

## Architecture Decisions

### Decision: CSS `@media` + `@apply` responsive prefixes

| Option | Tradeoff | Decision |
|--------|----------|----------|
| All `@apply` with sm/md/lg | Simpler syntax but `md:` maps to 768px, not spec's 640px | Rejected — mismatch on breakpoints |
| All native `@media` | Precise control but verbose for simple padding swaps | Adopted — for structural layout |
| **Hybrid: `@apply sm:`/`lg:` for values, `@media` for structure** | Cleanest match to spec breakpoints | **Chosen** |

`sm:@apply` maps to 640px, `lg:@apply` maps to 1024px — both match spec exactly.

### Decision: AboutSection — no JSX changes needed

The "inline CSS" referenced in proposal/spec (`padding: 95px 80px`, `display: grid`) lives in `about-section.css` as raw CSS properties, NOT in JSX `style={}`. All landing components confirmed free of inline style attributes. Migration means converting these raw values to responsive `@media` values within the same CSS file — the component itself needs zero changes.

## Per-Section CSS Strategy

| Section | Default (<640px) | sm:640px | lg:1024px | Mechanism |
|---------|:-:|:-:|:-:|-----------|
| MacHeader | Dots `w-3 h-3`, gap-2, px-4 py-3 | gap-3 | px-6 py-4, w-4 h-4 | `@apply sm:` prefixes |
| Hero | Stack image→form→text (already flex-col), h1 ~32px | Tighter 2-col gap | Current 2-col layout | Override `.hero-title` size, change `md:flex-row` → `lg:flex-row` |
| WhatYouGet | Cards full-width (remove max-width:730px), p-8 | More gap | lg:flex-row | Change `md:flex-row` → `lg:flex-row`, drop max-width |
| WhySpecLog | Text top, terminal below. Terminal panes flex-col | — | lg:flex-row split, lg:flex-row panes | `@media` for `.why-terminal-body` direction |
| AboutSection | flex-col, padding ~20px, photo 180-200px | Photo ~250px | Restore grid + 95px 80px | `@media` queries for structural swap |
| TechnicalLog | Cards full-width, title 24px, px-4 | More gap | Current p-8, 26px title | `@apply sm:/lg:` on padding/font |
| EndLog | `pre-wrap`, CTA full-width | — | `white-space: pre`, auto CTA | `@media` for white-space, `@apply sm:` for CTA |
| Footer | Row with compact pills (`px-2 py-1`) | `px-3 py-1.5` | Restore current `px-4 py-2` | Remove `flex-col sm:flex-row` → always `flex-row flex-wrap` |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/mac-header.css` | Modify | Add compact mobile values via `@apply sm:` overrides |
| `src/styles/hero.css` | Modify | Reduce h1 to ~32px default, change `md:flex-row` → `lg:flex-row` |
| `src/styles/what-you-get.css` | Modify | Remove `max-width: 730px` from `.wyg-card`, change `md:flex-row` → `lg:flex-row` |
| `src/styles/why-spec-log.css` | Modify | Add `@media` for `.why-terminal-body` flex-direction: `column` default, `row` at lg |
| `src/styles/about-section.css` | Modify | Convert raw padding/grid to responsive `@media` blocks, reduce photo on mobile |
| `src/styles/tech-log.css` | Modify | Reduce title to 24px default, px-4 default, `@apply lg:` to restore current |
| `src/styles/end-log.css` | Modify | `pre-wrap` default, CTA `w-full` default, `@media` to restore pre/auto |
| `src/styles/footer.css` | Modify | Keep links as row on mobile with compact pills (`px-2 py-1`), remove `flex-col sm:flex-row` |
| `src/components/landing/AboutSection.tsx` | No change | Confirmed no inline styles exist |

## AboutSection Migration Plan

No JSX migration needed — all styles already in CSS module. The raw CSS values:

```css
.about-section { padding: 95px 80px; }           /* → responsive */
.about-container { display: grid; ... }          /* → flex-col on mobile */
.about-photo { width: 300px; height: 300px; }    /* → 180-200px on mobile */
```

Convert to:

```css
.about-section {
  padding: 20px;                          /* default (mobile) */
}
@media (width >= 640px) {
  .about-section { padding: 40px 60px; }
}
@media (width >= 1024px) {
  .about-section { padding: 95px 80px; }  /* restore current */
}
```

Same pattern for `.about-container` (flex-col → grid) and `.about-photo` (180px → 300px).

## WhySpecLog Terminal Pane Strategy

Two-level stacking:
- `.why-split`: `flex-col` (default) → `lg:flex-row` (already correct)
- `.why-terminal-body`: `flex-col` (default) → `@media (width >= 1024px) { flex-direction: row }` — native `@media` because `@apply` can't reverse a flex-direction across the same default

The vertical divider (`.why-terminal-divider`) hides on mobile via `hidden lg:block`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | All 8 sections at 375px, 640px, 1024px | Browser DevTools viewport emulation |
| Build | `next build` passes | CI check |
| Overflow | No horizontal scrollbar at 375px | Manual inspect |
| Touch targets | All interactive elements >= 44px | DevTools inspect computed style |

## Migration / Rollout

No migration required. Single commit with all CSS changes. Revert via `git revert`.

## Design Review: Issues Found

Review: PASS WITH WARNINGS ✅⚠️

### Issues Resolved in Design

| Issue | Fix |
|-------|-----|
| `hero.css` `.hero-image-wrapper` uses `md:w-70 md:h-45` (768px breakpoint mismatch) | Changed to `lg:w-70 lg:h-45` to match 1024px spec breakpoint |
| `why-spec-log.css` `px-18` causes 72px padding on 375px | Added responsive: `px-4 sm:px-8 lg:px-18` pattern |
| `why-spec-log.css` `.why-arrow-box` `margin-left: 55px` `max-width: 430px` overflow | Added `@media` to reduce margin-left/max-width on mobile |
| `why-spec-log.css` `.why-text` `margin-left: 25px` on mobile | Remove margin-left on mobile baseline |
| `why-spec-log.css` `.why-final` `margin-top: 80px` on mobile | Reduced to `mt-10 sm:mt-20 lg:mt-80px` |
| `min-width: 320px` global guard (spec SHOULD) | Add `html { min-width: 320px; overflow-x: hidden; }` |
| `why-terminal-body` `whitespace-pre` on mobile pane | Changed to `whitespace-pre-wrap` on mobile default |

### Decisions from Design Review

| Question | Decision |
|----------|----------|
| WhySpecLog terminal divider on mobile | Show as HORIZONTAL line between stacked panels (`w-full h-px` instead of `w-px h-full`) |
| Footer links on mobile | Keep `flex-row flex-wrap` with smaller pills (`px-2 py-1 sm:px-4 sm:py-2`) — links side by side, just compact |
| Typography scaling | YES — proportional: h1 55→32px, headings 42→28px, body 20→16px, mono 15→13px on mobile baseline |
