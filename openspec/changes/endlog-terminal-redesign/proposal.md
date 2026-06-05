# Proposal: EndLog Terminal Redesign

## Intent

`EndLog` is currently an empty shell. The closing section must become the page's signature moment: a dark Mac terminal that types itself out when scrolled into view, ending with a CTA that loops back to the Hero subscription form. This turns a dead section into the page's emotional peak and primary call-to-action trigger.

## Scope

### In Scope
- Rewrite `EndLog.tsx` as a client component with IntersectionObserver-driven 6-phase typewriter state machine
- Replace orphaned CSS in `end-log.css` with terminal card, prompt coloring, cursor blink, button fade-in
- Typed segment (`{ text, color }`) for multi-color prompt spans, button reveal with smooth-scroll to `#hero`
- Honor `prefers-reduced-motion` — render fully-typed terminal, no animation

### Out of Scope
- No new shared hooks/components, no test runner, no changes to other sections or global tokens

## Capabilities

### New Capabilities
- `endlog-terminal`: Defines the dark terminal CTA's visual identity, typewriter behavior, accessibility rules, and scroll-back-to-hero interaction

### Modified Capabilities
- None — existing landing specs do not cover EndLog

## Approach

**Single client component, 6-phase state machine** in `EndLog.tsx`. A `useRef` attaches an `IntersectionObserver` (threshold 0.3) that disconnects after first intersection. Phase transitions use chained `setTimeout`; typing uses `setInterval` (~40ms/char). Timers cleared in effect cleanup.

**Visual reuse**: Mirror the dark terminal from `WhatYouGet` (dots `#FF5457`/`#FFC653`/`#56E75D`, header `#2B2D30`, `dotHoverGlow` keyframe). Button mirrors `hero-btn` with `↑` glyph, `w-fit mx-auto`. **Mobile**: full-width with `mx-6` padding (not edge-to-edge).

## Affected Areas

- `src/components/landing/EndLog.tsx` — **Rewrite**: server → client, ~200 lines
- `src/styles/end-log.css` — **Rewrite**: drop 7 orphaned classes; add terminal/prompt/cursor/button-fade
- `src/app/page.tsx` — **None**: import stays identical

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Layout shift when observer triggers | Low | Terminal reserves final height from phase 0 |
| Reduced-motion flicker on first paint | Med | `matchMedia` detected synchronously, gates animation start |
| `tsc` strict typing for segment union | Low | Discriminated union + `as const` literals |

## Rollback Plan

`git checkout HEAD -- src/components/landing/EndLog.tsx src/styles/end-log.css` restores the empty shell. No new files, no dependency changes.

## Dependencies

None. React 19 hooks and native `IntersectionObserver` are already in the project.

## Success Criteria

- Dark Mac terminal with 3 colored dots and typing prompt when scrolled into view
- All 6 typewriter phases complete in order with pauses (2s, 3s, 2.5s, 2.5s, 1.5s → button); prompt with per-character colors, `>` lines orange, final line no cursor
- Button fades in after typing; click smooth-scrolls to `#hero`
- Animation plays exactly once; `prefers-reduced-motion` skips it
- Mobile renders full-width with side padding
- `next build` and `next lint` pass clean; no new dependencies
