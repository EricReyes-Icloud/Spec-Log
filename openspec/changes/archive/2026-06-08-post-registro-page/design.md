# Design: Post-Registro Page

## Technical Approach

Create `/subscribe` as a client-side page with an animation state machine that simulates terminal-style verification checks. Reuse existing `MacHeader` (with timer hidden) and `Footer`. Gate the full animation behind `localStorage` and `prefers-reduced-motion`; when either says skip, jump directly to the SUCCESS state.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Animation inline vs extracted component** | Extracted = testable/reusable but more files; inline = simpler for single-use page | **Inline in page.tsx** — no reuse case, keeps the change scope minimal |
| **localStorage gating** | Cookie/Session/No storage = more complex or re-plays on every tab close | **`animationShown` boolean** — simple, survives refresh, reset on clearing site data |
| **Timer-based vs requestAnimationFrame** | rAF = smoother but wasteful for 1.5s intervals; setTimeout = simpler, well-understood | **setTimeout chain** — matches EndLog pattern, sufficient for coarse 1.5s steps |
| **CSS dots vs JS dots** | JS = full control but more code; CSS keyframes = declarative, zero re-renders | **CSS `@keyframes`** — pure animation for `...` loading dots, same pattern as `mac-header.css` |
| **prefers-reduced-motion handling** | CSS-only = JS still runs timers; JS `matchMedia` + early return = skip everything | **JS `matchMedia` + early exit** — prevents timer setup entirely, like EndLog already does |

## Data Flow

```
Browser: GET /subscribe
  │
  ▼
page.tsx mounts
  │
  ├── check localStorage["animationShown"]?
  │   └── YES ──► render SUCCESS immediately
  │
  ├── check matchMedia("(prefers-reduced-motion: reduce)")?
  │   └── YES ──► render SUCCESS, set localStorage, done
  │
  └── NO ──► start animation sequence:
                LOADING_DOTS (0s)
                    │ (1.5s)
                    ▼
                CHECK_1: "✓ Email verificado"
                    │ (1.5s)
                    ▼
                CHECK_2: "✓ Suscripción creada"
                    │ (1.5s)
                    ▼
                CHECK_3: "✓ Próxima edición programada"
                    │
                    ▼
                SUCCESS → set localStorage["animationShown"]=true
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/subscribe/page.tsx` | Create | Client component: animation state machine, localStorage gate, MacHeader/Footer composition |
| `src/styles/post-registro.css` | Create | Component styles: @reference globals.css, @layer components, terminal card, dots, checkmarks |

## Interfaces / Contracts

**Animation state type** — inline union, no export needed:

```typescript
type AnimState = "LOADING_DOTS" | "CHECK_1" | "CHECK_2" | "CHECK_3" | "SUCCESS";
```

**MacHeader contract** (existing, reused):
```tsx
<MacHeader showTimer={false} buttonHref="/" buttonText="landing" />
```

**Props**: `showTimer=false` hides the countdown; button navigates to `/` with label `landing`.

## Component Structure (page.tsx)

```
"use client";

┌─────────────────────────────────────┐
│ <MacHeader showTimer={false}         │
│   buttonHref="/" buttonText="landing"/> │
├─────────────────────────────────────┤
│ <main>                              │
│   <span>spec-log://onboarding</span> │  ← orange comment, self-start
│   <h1>Acabas de entrar...</h1>      │  ← outside card
│   <p>...explicación...</p>          │  ← outside card
│   ┌─────────────────────────────┐   │
│   │  Terminal Card (bg:#000)    │   │  ← NO header bar
│   │  STATUS: In progress...     │   │
│   │  [✓] Email verificado       │   │
│   │  [✓] Suscripción creada     │   │
│   │  [✓] Próxima edición...     │   │
│   └─────────────────────────────┘   │
│ </main>                             │
├─────────────────────────────────────┤
│ <Footer />                          │
└─────────────────────────────────────┘
```

## Testing Strategy

No test runner is configured (`openspec/config.yaml`: `test_runner: none`). Verify manually per spec scenarios:

| Scenario | How to Verify |
|----------|---------------|
| Full animation plays | Open `/subscribe` fresh → observe 3 checkmarks at ~1.5s intervals, SUCCESS at end |
| Refresh skips animation | Reload → SUCCESS immediately, all checks visible |
| Reduced motion | Enable OS-level `prefers-reduced-motion: reduce` → SUCCESS immediately |
| Colors match spec | Inspect card text: "Status:" #FFF, "In progress..." #FFD700, SUCCESS/checks #50C878, bg #000, comment #F95616 |
| Header button | Click `{ } landing` → navigates to `/` |
| Second visit | Navigate away and back → SUCCESS immediately (flag persisted) |

## Migration / Rollout

No migration required. Purely client-side page with no backend dependencies. Deploy with the rest of the app.

## Open Questions

- None — all decisions are covered by the spec and existing patterns.
