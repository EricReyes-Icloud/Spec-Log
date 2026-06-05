# Design: EndLog Terminal Redesign

## Technical Approach

Single `"use client"` component (`EndLog.tsx`) with a 6-phase state machine driven by IntersectionObserver (threshold 0.3, disconnect-once). Typewriter animation via `setInterval` loops at ~40ms/char, phase transitions via chained `setTimeout`. Terminal visuals mirror WhatYouGet's dark card pattern (`bg-black`, `bg-[#2B2D30]` header, 3 colored dots with `dotHoverGlow`). CSS lives in `end-log.css` — replaces orphaned shell classes with terminal/prompt/cursor/button-fade classes.

## Architecture Decisions

| Option | Tradeoffs | Decision |
|--------|-----------|----------|
| **Monolithic** vs extracted hooks | Monolithic: simpler for this single-use animation. Extracted: reusable but premature — first animated section in the project. | **Monolithic** — keep all animation logic in `EndLog.tsx`. |
| **`setInterval`** vs `requestAnimationFrame` vs `async/await` | `setInterval`: predictable 40ms ticks, easy to clear. `rAF`: more precise but overkill for 40ms. `async/await`: clean syntax but harder to interrupt mid-phase. | **`setInterval`** per typing phase — stored in a `useRef`, cleared in cleanup. |
| **Phase enum** vs boolean flags | Enum: single source of truth, switch-case clarity. Booleans: combinatorial explosion (isTyping, isPausing, isComplete…). | **Phase enum** (`IDLE → TYPING\_PROMPT → TYPING\_BODY1 → TYPING\_BODY2 → TYPING\_BODY3 → TYPING\_CLOSING → COMPLETE`). |
| **Local `@keyframes`** vs shared `dotHoverGlow` | Cursor blink is local concern. `dotHoverGlow` is already global in `what-you-get.css`. | **Cursor blink** local to `end-log.css`. **`dotHoverGlow`** referenced from global scope (already outside `@layer`). |
| **`#hero` scroll** vs callback prop | `#hero` is already an `id` on the Hero `<section>`. A callback prop would couple EndLog to Hero. | **`document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })`** — loose coupling via DOM id. |

## State Machine Flow

```
IDLE ──(observer fire)──→ TYPING_PROMPT ──(line done, 2s pause)──→ TYPING_BODY1
  │                              │                                        │
  └── reduced-motion ────────────┘                                        │
       → COMPLETE (full text)                                              │
                                                                           ▼
                                                                   TYPING_BODY2 ◀── 3s pause
                                                                           │
                                                                           ▼
                                                                   TYPING_BODY3 ◀── 2.5s pause
                                                                           │
                                                                           ▼
                                                                TYPING_CLOSING ◀── 2.5s pause
                                                                           │
                                                                  1.5s + 1s delay
                                                                           ▼
                                                                      COMPLETE ──→ button fade-in
```

Each `TYPING_*` phase: (1) set current segments, (2) start `setInterval` appending chars, (3) on full line, clear interval, schedule next phase with pause. `IDLE → TYPING_PROMPT` has an initial 0.5s delay for hover glow to play.

## Data Flow

```
User scrolls
    │
    ▼
IntersectionObserver (ref, threshold 0.3) ──fire──→ disconnect()
    │
    ▼
Phase state machine (sequential setTimeouts + setIntervals)
    │
    ├──► typedSegments[] state (array of { text, color } spans)
    ├──► cursorVisible state (boolean, off after TYPING_CLOSING)
    └──► showButton state (boolean, true on COMPLETE)
    │
    ▼
Render: prompt line + segment spans + cursor + blank lines + paragraphs
    │
    ▼
Button (opacity transition, scrollTo(#hero) on click)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/landing/EndLog.tsx` | **Rewrite** | Server component → client component (`"use client"`), 6-phase state machine, IntersectionObserver, typed segments, button. ~200 lines. |
| `src/styles/end-log.css` | **Rewrite** | Drop 7 orphaned classes. Add: terminal card, header dots (reuse `dotHoverGlow`), per-color prompt classes, cursor blink `@keyframes`, button fade-in, reduced-motion override. |

`page.tsx` import stays identical — no changes needed.

## Interfaces / Contracts

```typescript
// Typed segment for prompt color spans
interface TypedSegment {
  text: string;
  color: string; // Tailwind class, e.g. "text-green-400"
}

// Phase enum
type Phase =
  | "IDLE"
  | "TYPING_PROMPT"
  | "TYPING_BODY1"
  | "TYPING_BODY2"
  | "TYPING_BODY3"
  | "TYPING_CLOSING"
  | "COMPLETE";
```

### Paragraph data structure

```typescript
const PARAGRAPHS: { segments: TypedSegment[]; pauseMs: number }[] = [
  // Phase 1: prompt line only (cursor to type full line)
  // Phase 2: "> Si llegaste..." → pause 2000ms
  // Phase 3: "> Quizás te interesa..." → pause 3000ms
  // Phase 4: blank + "> Eso es exactamente..." → pause 2500ms
  // Phase 5: blank + "> Solo se trata..." → pause 2500ms
  // Phase 6: no cursor → pause 1500ms + 1000ms → button
];
```

Timer refs stored in `useRef<number>` for cleanup.

## CSS Strategy

- **Cursor blink**: Local `@keyframes blink` in `end-log.css` (opacity toggle, 500ms steps).
- **Dot hover glow**: Reuse global `dotHoverGlow` keyframe from `what-you-get.css` — applied via `.endlog-terminal-dot:hover`.
- **Button fade-in**: CSS transition `opacity 0.6s ease-in` triggered by `.endlog-btn-visible` class.
- **Reduced motion**: `.endlog-terminal-text` inside `@media (prefers-reduced-motion: reduce)` renders fully opaque, button visible.

## Accessibility

- `aria-live="polite"` on the terminal output container — screen readers announce text as it appears.
- `prefers-reduced-motion` matchMedia check at mount — if true, jump to `COMPLETE` phase immediately.
- Button is a `<button>` element (not a link) — semantic, keyboard-focusable.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Phase transitions, timer cleanup, reduced-motion branch | Manual render check in dev, no test runner established yet |
| Visual | Terminal card matches dark variant, colors match spec, button appears after animation | Visual inspection against Identidad_visual.md reference |
| Integration | Observer fires at 30% threshold, scrollTo behavior | Manual scroll test in browser |

*No test runner is currently configured in the project — unit tests deferred.*

## Migration / Rollout

No migration required. Import path stays `@/components/landing/EndLog`. Changing from server to client component is transparent to `page.tsx`.

## Open Questions

None. All decisions resolved above.
