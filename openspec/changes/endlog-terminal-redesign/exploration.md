# Exploration: EndLog Terminal Redesign

## Current State

The EndLog section is a near-empty shell:
- **EndLog.tsx**: Server component (no `"use client"`), renders only a `<section>` with a comment `<!-- end.log -->` and nothing else. No interactivity, no animation, no content.
- **end-log.css**: Contains orphaned class definitions (`endlog-container`, `endlog-heading`, `endlog-text`, `endlog-line`, `endlog-spacer`, `endlog-highlight`, `endlog-btn`) from a previous iteration that were deleted from the component but never cleaned from CSS. The only active classes are `.endlog-section` (background #FFE1A5, padding) and `.endlog-comment`.
- **page.tsx**: EndLog is a server component imported alongside other landing sections. Since it will now need client-side hooks (`useState`, `useEffect`, `useRef` for IntersectionObserver), it MUST become a client component.

## Affected Areas

| File | Why |
|------|-----|
| `src/components/landing/EndLog.tsx` | Complete rewrite — becomes `"use client"`, adds terminal UI + typewriter state machine + IntersectionObserver |
| `src/styles/end-log.css` | Replace orphaned classes with terminal card styles, typewriter animation keyframes, cursor blink |
| `src/components/landing/WhatYouGet.tsx` | Reference only — dark terminal pattern to reuse (dot colors, header structure, card shadow) |
| `src/styles/what-you-get.css` | Reference only — `dotHoverGlow` keyframe, `.wyg-card-dark`, `.wyg-terminal-header-dark` patterns to mirror |
| `src/styles/hero.css` | Reference only — `.hero-btn` pattern for the CTA button |
| `src/styles/globals.css` | Reference only — theme colors (brand-orange: #F95616, brand-carbon: #1F1F1F, brand-yellow: #FFE1A5) |
| `Identidad_visual.md` | Source of truth — animation flow (6 steps), terminal colors, prompt coloring, button spec |

## Existing Patterns Identified

### Dark Terminal (WhatYouGet)
- Card: `rounded-xl overflow-hidden`, `bg-black`, 3D box-shadow (`6px 8px 0px rgba(0,0,0,0.12), 12px 16px 0px rgba(0,0,0,0.06)`), hover scale(1.03)
- Header: `background: #2B2D30`, dots use `bg-[#FF5457]`, `bg-[#FFC653]`, `bg-[#56E75D]`
- Dot hover: `dotHoverGlow` keyframe with scale + box-shadow in `currentColor`
- Body: `bg-black text-white/80 font-mono p-10`

### Hero Button
- `bg-brand-orange text-brand-carbon font-bold rounded-md font-mono text-base`
- `hover:bg-[#F98016] hover:cursor-pointer transition-colors`
- Width: full-width in hero (`w-full`), but EndLog should be auto-width centered

### Component Pattern
- All landing components import their CSS file at the top: `import "@/styles/end-log.css"`
- Components are default exports
- Server components by default; only Hero uses `"use client"` (for form state)

## Approaches

### Approach 1: Monolithic State Machine (Recommended)
Single `EndLog.tsx` with all logic: IntersectionObserver, typewriter state machine (6 steps), and rendering. CSS handles terminal styles, cursor blink, and glow.

- **Pros**: Self-contained, all animation logic in one file, no prop drilling, matches the single-component pattern of other landing sections
- **Cons**: Component file will be ~200-250 lines (acceptable for a landing page section)
- **Effort**: Medium

### Approach 2: Extracted Typewriter Hook + Terminal Components
Extract `useTypewriter` hook into `lib/hooks/useTypewriter.ts`, extract `TerminalCard` as a shared component, keep EndLog as orchestrator.

- **Pros**: Reusable typewriter hook, cleaner separation, the TerminalCard could serve other sections
- **Cons**: Over-engineered for a one-shot landing page animation, adds files that may never be reused, breaks the flat component structure pattern
- **Effort**: Medium-High

### Approach 3: CSS-only Animation
Use CSS `@keyframes` with `steps()` for the typewriter effect, no JS state machine.

- **Pros**: No JS complexity, GPU-accelerated
- **Cons**: Cannot use IntersectionObserver trigger (needs JS), hard to sequence 6 distinct stages, cannot show button after completion, text content is static (not declarative), difficult to color individual characters (prompt coloring)
- **Effort**: Low (but wrong fit)

## Recommendation

**Approach 1: Monolithic State Machine** — A single `EndLog.tsx` (client component) that:

1. Uses `useRef` + `useEffect` to set up an `IntersectionObserver` on the section (threshold ~0.3)
2. When intersecting, starts the typewriter state machine with `useState<phase>` tracking which of the 6 animation phases is active
3. Uses `useEffect` chains with `setTimeout` to advance through phases
4. Each phase types text character-by-character using a `useState<string>` buffer and an interval
5. CSS handles: cursor blink keyframe, dot hover glow (reused from what-you-get.css), terminal card 3D shadow, and all styling

The text content is defined as a typed structure (array of lines/segments with color metadata) so each character knows its color. The prompt line has multi-colored segments (green/white/blue/yellow), the `>` lines have orange prefix, and the body text is white.

**Why this approach**: The project has zero IntersectionObserver or typewriter patterns — this is the first animated section. Keeping it self-contained avoids premature abstraction. The component will be ~200 lines which is reasonable for a complex animation section.

## Technical Decisions

### Typewriter State Machine

```
Phase 0: IDLE         → Terminal visible, cursor blinking, waiting
Phase 1: TYPING_PROMPT → Types "Gracias por llegar hasta aqui." after prompt
Phase 2: TYPING_BODY_1 → Types first paragraph ("> Si llegaste...")
Phase 3: TYPING_BODY_2 → Types second paragraph ("> Quizás te interesa...")
Phase 4: TYPING_BODY_3 → Types third paragraph ("> Eso es exactamente...")
Phase 5: TYPING_CLOSING → Types final line ("> Solo se trata...")
Phase 6: COMPLETE       → Show button, cursor removed from last line
```

Each typing phase:
- Has a target string
- Uses an interval (30-50ms per character) to append characters
- When done, advances to next phase after a brief pause

### Cursor Behavior
- Blinking `█` after the prompt in phases 0-5
- Moves to end of currently-typing line
- Disappears after the final closing line in phase 6
- CSS: `@keyframes blink` with `opacity: 0/1` at 50% steps

### Prompt Coloring
The `spec-log:~$` prompt uses colored `<span>` elements:
- `spec-log` → green (#56E75D)
- `:` → white
- `~` → light blue-gray (#A3A3A3 or similar)
- `$` → light yellow (#FFC653 or similar)

### IntersectionObserver
- `threshold: 0.3` (trigger when 30% visible)
- `rootMargin: "0px"` (no margin adjustment)
- Once triggered, disconnect observer (animation plays once)
- Fallback: if user scrolls fast past, still triggers when intersection ratio >= 0.3

### Button Reveal
- Only appears in Phase 6 (COMPLETE)
- Fade-in animation: `opacity: 0 → 1` over 0.5s
- Same style as Hero button but `↑` instead of `↓`, auto-width centered

## Risks

1. **Performance**: Typewriter interval runs in main thread — acceptable for a single section, but should cleanup on unmount
2. **Reduced motion**: No `prefers-reduced-motion` handling currently in the project — should add `@media (prefers-reduced-motion: reduce)` to skip animation and show final state immediately
3. **No test runner**: Cannot write tests for the animation logic — verify manually
4. **SSR**: Component must be `"use client"` — IntersectionObserver and useState won't work in server components

## Ready for Proposal

**Yes** — All requirements are clear:
- Visual spec is fully defined in Identidad_visual.md
- Existing patterns (dark terminal, button, colors) are identified
- Animation flow (6 steps) is concrete with exact text
- No ambiguities in the design
- Single file scope is manageable

The orchestrator should proceed to `sdd-propose` for the `endlog-terminal-redesign` change.
