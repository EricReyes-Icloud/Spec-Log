# Tasks: EndLog Terminal Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | CSS + Component rewrite | Single PR | Both files required for the change to work |

## Phase 1: CSS Foundation

- [x] 1.1 Add terminal card classes — `.endlog-terminal` (bg-black, rounded-xl, overflow-hidden, 3D box-shadow), `.endlog-terminal-header` (bg #2B2D30, flex dots gap)
- [x] 1.2 Add dot classes — `.endlog-terminal-dot-red/yellow/green` with colors #FF5457/#FFC653/#56E75D, hover glow via global `dotHoverGlow` keyframe
- [x] 1.3 Add cursor blink `@keyframes blink` (800ms step-end) and `.endlog-cursor` class
- [x] 1.4 Add prompt color classes — `.endlog-prompt-green`, `-white`, `-blue`, `-yellow`, `-orange` matching spec palette
- [x] 1.5 Add text container (`.endlog-body`, `.endlog-line`), CTA button (`.endlog-btn` bg-brand-orange, hover #F98016, fade-in transition)
- [x] 1.6 Add section layout (`.endlog-section` bg-brand-yellow, padding), comment style (`.endlog-comment`), terminal centering (`.endlog-terminal` mx-auto)
- [x] 1.7 Add `@media (prefers-reduced-motion: reduce)` — fully opaque text, button immediately visible, cursor stops blinking

## Phase 2: Component Implementation

- [x] 2.1 Add `"use client"` directive, imports (`useState`, `useRef`, `useEffect`, `useCallback` from React), import `@/styles/end-log.css`
- [x] 2.2 Define paragraph data model — `ParagraphGroup` interface with typed `LineSeg[]` lines, phase mapping, pause metadata
- [x] 2.3 Implement state machine hooks — `phase`, `lines`, `showCursor`, `showButton`, timer refs for cleanup
- [x] 2.4 Implement IntersectionObserver effect — threshold 0.3, disconnect on first fire, check `prefers-reduced-motion` to skip to COMPLETE
- [x] 2.5 Implement typewriter logic — recursive `tick()` with setTimeout chaining at ~40ms/char, line-by-line appending, paragraph boundary detection with pauses (2s→3s→2.5s→2.5s→1.5s)
- [x] 2.6 Implement COMPLETE phase — hide cursor after short delay, show button after 1s
- [x] 2.7 Render: section (bg-yellow) → terminal card (header with 3 dots) → terminal body (colored spans per segment + blinking cursor) → CTA button (`↑ Unirme a Spec Log`)
- [x] 2.8 Add `aria-live="polite"` on terminal output container; timer cleanup in `useEffect` return

## Phase 3: Verification

- [x] 3.1 Run `next build` — zero errors ✓
- [ ] 3.2 Visual: terminal renders dark card, colored header dots, per-character colored prompt matches spec palette
- [ ] 3.3 Scroll: IntersectionObserver fires at 30% viewport, typewriter sequence plays once, no replay on scroll away and back
- [ ] 3.4 Button: fades in after full typing, smooth-scrolls to `#hero` section on click
- [ ] 3.5 Reduced motion: enable OS `prefers-reduced-motion: reduce`, verify full text + button appear immediately with no animation
- [ ] 3.6 Mobile: terminal spans full width with horizontal padding, no overflow
