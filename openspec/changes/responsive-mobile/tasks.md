# Tasks: Responsive Mobile Adaptation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 160–320 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Add `html { min-width: 320px; overflow-x: hidden; }` global guard in `src/styles/globals.css` or equivalent

## Phase 2: Layout Sections

- [x] 2.1 `src/styles/hero.css` — Reduce `.hero-title` to ~32px default, change `md:flex-row`/`md:w-70 md:h-45` to `lg:` variants
- [x] 2.2 `src/styles/what-you-get.css` — Remove `max-width: 730px` from `.wyg-card`, change `md:flex-row` → `lg:flex-row`
- [x] 2.3 `src/styles/why-spec-log.css` — Stack text above terminal; `.why-terminal-body` flex-col default, row at lg; divider horizontal on mobile; arrow box margin fixed; `.why-text` margin removed on mobile
- [x] 2.4 `src/styles/about-section.css` — Convert raw padding/grid/photo-size to `@media` blocks: flex-col mobile, restore grid at lg

## Phase 3: Polish Sections

- [x] 3.1 `src/styles/mac-header.css` — Compact dots (`w-3 h-3`), reduced gap/padding mobile, restore via `@apply sm:`
- [x] 3.2 `src/styles/tech-log.css` — Title 24px default, `px-4` default, `@apply lg:` restores current
- [x] 3.3 `src/styles/end-log.css` — `white-space: pre-wrap` default, CTA `w-full` default, `@media` restores pre/auto
- [x] 3.4 `src/styles/footer.css` — Keep `flex-row flex-wrap` with compact pills, remove `flex-col sm:flex-row`

## Phase 4: Verification

- [x] 4.1 Visual check at 375px — no horizontal scroll, all content present, touch targets >= 44px *(manual — verified by user)*
- [x] 4.2 Visual check at 640px — intermediate spacing correct *(manual — verified by user)*
- [x] 4.3 Visual check at 1024px — desktop layout restored, no regressions *(manual — verified by user)*
- [x] 4.4 Run `next build` — no errors
