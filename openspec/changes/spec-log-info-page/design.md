# Design: Spec Log Info Page (`/spec-log-info`)

## Technical Approach

Add a server-rendered info route (`/spec-log-info`) that composes existing layout primitives (`MacHeader`, `Footer`) plus a new client accordion component. `MacHeader` gets three optional props with defaults — landing page is untouched. No API, no data fetching: all content is static.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Accordion client/server split | Server page, client accordion | Pure server with JS-less accordion | Accordion needs `useState` for open/close; keeping the page server avoids unnecessary client boundaries |
| Accordion state shape | `number \| null` single index | Array of open indices | Spec requires classic one-at-a-time — a single index is simpler and enforces the constraint by type |
| CSS strategy | Co-located per component via `@reference globals.css` | Module CSS, inline styles, Tailwind in JSX | Follows existing project pattern (`mac-header.css`, `footer.css`) — `@layer components` with `@apply` |
| Brand colors | Tailwind v4 `@theme` utilities | Raw `var(--color-brand-*)` | `text-brand-comment` already works in `footer.css` — Tailwind v4 auto-generates `text-*` / `bg-*` from `@theme` tokens |
| Props extension | Optional with destructured defaults | Prop forwarding wrapper | Minimal diff; call sites unchanged; TypeScript provides safety |

## Component Tree

```
<SpecLogInfoPage>              ← SERVER component
  <MacHeader />                ← CLIENT component (existing, extended)
    showTimer: false
    buttonHref: "/"
    buttonText: "landing"
  <main>
    <h1>                       ← Static heading in server markup
    <SpecLogAccordion />       ← CLIENT component (new)
      <State: openIndex>
      <AccordionItem /> × 9   ← Derived from QUESTIONS array
  <Footer />                   ← SERVER component (existing, unchanged)
```

Server/client boundary: the page and Footer remain server components. `MacHeader` is already `"use client"` (timer effect). `SpecLogAccordion` is `"use client"` for `useState`.

## MacHeader Props Contract

```tsx
// Added to existing MacHeader (no existing props to break)
interface MacHeaderProps {
  showTimer?: boolean;   // default true — when false renders flex-1 spacer
  buttonHref?: string;   // default "https://github.com/ericreyes/spec-log"
  buttonText?: string;   // default "spec-log"
}

// Conditional render in header center section:
{showTimer ? (
  <span className="mac-header-timer">...</span>
) : (
  <div className="flex-1" />
)}
```

Landing call site `<MacHeader />` passes nothing → all defaults apply → visually identical.

## SpecLogAccordion Component

| Aspect | Detail |
|---|---|
| State | `openIndex: number \| null` |
| Toggle | Same index → `null` (close). Different index → that index (open and close previous) |
| Data | Static `QUESTIONS` array — 9 objects with `question` + `answer` (answer is `""`) |
| Click target | Entire `.accordion-item` div |
| Chevron CSS | `.accordion-chevron` with `transition: transform 0.2s ease;` |
| Chevron state | `transform: rotate(0deg)` → collapsed (▸); `rotate(90deg)` → expanded (▾) |
| Answer reveal | `.accordion-answer` with `max-height: 0` → `max-height: 500px` + `transition: max-height 0.3s ease;` overflow hidden |

```tsx
const toggle = (index: number) => {
  setOpenIndex(openIndex === index ? null : index);
};
```

## CSS Architecture

| File | Action | Responsibility |
|---|---|---|
| `src/styles/globals.css` | Unchanged | `@theme` tokens — `--color-brand-orange`, `--color-brand-carbon` |
| `src/styles/spec-log-info.css` | Create | Page layout — main wrapper, heading, brand highlight |
| `src/styles/spec-log-accordion.css` | Create | Accordion — items, chevron rotation, answer reveal animation |

### spec-log-info.css key selectors

| Selector | Role |
|---|---|
| `.spec-log-info-main` | `min-h-screen`, `max-w-4xl`, centered column |
| `.spec-log-info-heading` | `text-[55px]`, `text-brand-carbon`, centered |
| `.spec-log-info-heading-brand` | `text-brand-orange` — wraps "Spec Log" text |

### spec-log-accordion.css key selectors

| Selector | Role |
|---|---|
| `.accordion` | Container — full width |
| `.accordion-item` | Full-width row, bottom border separator, cursor pointer |
| `.accordion-header` | Flex row — chevron + question text |
| `.accordion-chevron` | Inline-block, `transition: transform 0.2s ease` |
| `.accordion-chevron.open` | `transform: rotate(90deg)` |
| `.accordion-answer` | `max-height: 0`, `overflow: hidden`, `transition: max-height 0.3s ease` |
| `.accordion-answer.open` | `max-height: 500px` |

### Responsive

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Heading scales down proportionally (`text-3xl` or `text-[clamp(1.75rem, 7vw, 55px)]`) |
| All | Accordion is full-width (`w-full`), items scale naturally |
| All | `Footer` is already responsive via existing `sm:flex-row` breakpoint |

## Data Flow

```
QUESTIONS (static const) ──→ SpecLogAccordion ──→ renders items
                                    │
                              openIndex (useState)
                                    │
                            onClick → toggle(index)
                                    │
                    conditional className → open/closed CSS
```

Zero external data. Zero API calls. Zero props drilling beyond `MacHeader`'s three optional props.

## Key Animation Details

1. **Chevron rotation**: `▸` (U+25B8) rotated 0° when collapsed, 90° when expanded. CSS `transition: transform 0.2s ease` on `.accordion-chevron`. Toggling `.accordion-chevron.open` applies `transform: rotate(90deg)` — the character appears as `▾`.

2. **Answer reveal**: `.accordion-answer` starts at `max-height: 0; overflow: hidden`. `.accordion-answer.open` transitions to `max-height: 500px`. 500px accommodates the longest possible answer without clipping. If answers exceed this, increase to `800px` — the visual penalty is negligible.

3. **Timer line height**: When `showTimer=false`, the `flex-1` spacer matches the timer `line-height` so the header layout stays vertically balanced.

## File Changes

| File | Action |
|---|---|
| `src/app/spec-log-info/page.tsx` | Create |
| `src/components/landing/SpecLogAccordion.tsx` | Create |
| `src/components/landing/MacHeader.tsx` | Modify — add 3 props |
| `src/styles/spec-log-info.css` | Create |
| `src/styles/spec-log-accordion.css` | Create |

## Testing Strategy

| Layer | What | How |
|---|---|---|
| Build | Route compiles, no new warnings | `next build` |
| Visual | `/spec-log-info` renders MacHeader + heading + accordion + Footer | Manual review |
| Visual | Landing `/` is unchanged | Compare before/after visually |
| Logic | Classic accordion behavior: open, switch, close | Manual click test on 9 items |

No migration required. All changes are additive.
