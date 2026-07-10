# Proposal: Responsive Mobile Adaptation

## Intent

The landing page breaks on mobile (<640px) — content overflows, grids never stack, hardcoded padding/typography cause horizontal scrolling. Fix all 8 sections for 375px+ without content loss.

## Scope

### In Scope
- Mobile-first layouts for all 8 landing sections (MacHeader, Hero, WhatYouGet, WhySpecLog, AboutSection, TechnicalLog, EndLog, Footer)
- Target < 1024px; progressive enhancement upward at sm:640px / lg:1024px
- WhySpecLog terminal: both panels stack vertically (full content)
- AboutSection: inline CSS → CSS module, flex-col on mobile
- EndLog: `white-space: pre` → `pre-wrap` on mobile

### Out of Scope
- Hamburger menu, content reduction, color/branding changes
- Custom breakpoints or responsive theme variables
- Performance optimization

## Capabilities

### New Capabilities
- `responsive-mobile`: Mobile-first responsive layout for Spec Log landing page across <640px / 640+ / 1024+ breakpoints.

### Modified Capabilities
- None

## Approach

Define mobile layout as CSS baseline (default), enhance at `sm:640px`, restore current desktop at `lg:1024px`. Each section's `src/styles/*.css` file gets `@media` blocks for its breakpoints. AboutSection moves inline `padding: 95px 80px` and `grid` to CSS with media query. WhySpecLog terminal defaults to `flex-col` below lg.

| Section | Default (<640px) | sm:640px | lg:1024px |
|---------|:-:|:-:|:-:|
| MacHeader | Compact dots, reduced timer, compact btn | More space | Current |
| Hero | Stack: image→form→text. h1 ~32px. Form full-width | Tighter 2-col | Current |
| WhatYouGet | Cards full-width, p-8, title ~28px | More gap | Current |
| WhySpecLog | Text top, terminal below. Terminal panes stacked. | More air | lg:flex-row |
| AboutSection | flex-col: 180-200px photo top, text below. Pad ~20px | Photo ~250px | Current grid |
| TechnicalLog | Cards full-width, title ~24px, px-4 | More air | Current |
| EndLog | pre-wrap, CTA full-width | More air | Current |
| Footer | Column centered (already has sm:flex-row) | Current | Current |

## Affected Areas

| Area | Impact |
|------|--------|
| `src/styles/hero.css` | Modified — mobile h1 size, stacking order |
| `src/styles/what-you-get.css` | Modified — full-width cards, padding |
| `src/styles/why-spec-log.css` | Modified — text/terminal stack, terminal panes vertical |
| `src/styles/about-section.css` | Modified — flex-col, photo size, inline→CSS padding |
| `src/styles/tech-log.css` | Modified — full-width cards, title size |
| `src/styles/end-log.css` | Modified — pre-wrap, full-width CTA |
| `src/styles/mac-header.css` | Modified — compact mobile layout |
| `src/styles/footer.css` | Modified — column centered links |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| AboutSection inline padding missed | Low | Check in code review |
| WhySpecLog terminal panes break at 375px | Low | Visual test before merge |
| Content overflow <320px | Low | `min-width: 320px` guard |

## Rollback Plan

`git revert` the merge commit (or single squash commit).

## Dependencies

None.

## Success Criteria

- [ ] No horizontal scrolling on 375px viewport for all 8 sections
- [ ] Touch targets >= 44px (WCAG minimum)
- [ ] All content present — no truncation or omission
- [ ] `next build` passes without errors
