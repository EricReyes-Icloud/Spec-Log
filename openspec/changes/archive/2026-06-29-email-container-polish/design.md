# Design: email-container-polish

## Technical Approach

Single-file change to `src/emails/templates/weekly-newsletter.tsx`. Three additions to the `container` inline CSSProperties object, a `className` on the `<Container>` element, and one responsive rule appended to the existing `<style>` block in `<Head>`.

| Addition | Target | Mechanism | Client Support |
|----------|--------|-----------|----------------|
| Vertical margins (24px) | `container` inline style | `marginTop` + `marginBottom` | Universal — all email clients |
| Box shadow | `container` inline style | `boxShadow` | Progressive — Apple Mail, Outlook 365, Samsung Mail |
| Border fallback | `container` inline style | `border` | All clients (catches Gmail which strips box-shadow) |
| Responsive margin reduction | `<Head>` style block | `@media` + `className` on `<Container>` | Gmail Web, Apple Mail; Gmail Android ignores gracefully |

The responsive rule uses `!important` in the media query to override the inline `24px` margins. This is standard email CSS — `<style>` block `!important` overrides inline styles in all clients that support media queries.

## Architecture Decisions

### Decision: Direct `className` on Container vs wrapper `<div>`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **`className` on `<Container>`** (chosen) | Uses React Email's prop forwarding to add `.email-container` class directly on the rendered `<table>`; no extra DOM | ✅ Industry standard; zero structural change |
| Wrapper `<div>` | Semantic separation but adds unnecessary DOM node | ❌ Unnecessary for this case — React Email supports className |

### Decision: Inline border + box-shadow vs one or the other

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Both** (chosen) | 2-line addition; border shows in Gmail, box-shadow adds depth in Apple Mail/Outlook 365 | ✅ Covers both client groups |
| box-shadow only | Cleaner but Gmail users see no separation | ❌ Fails visual baseline for the largest email client |
| border only | Consistent but no depth effect | ❌ Leaves progressive enhancement unused |

### Decision: `!important` in media query to override inline margin

The inline `marginTop: 24px` on the Container's `style` attribute would normally take precedence over a `<style>` block rule. `!important` is the standard email technique to make media query overrides work — it's recognized by Gmail Web, Apple Mail, and Outlook 365. No alternative approach achieves responsive margin reduction without structural DOM changes.

## File Changes

### `src/emails/templates/weekly-newsletter.tsx` — Modified

**A) `container` CSSProperties** — add 4 properties:

```typescript
const container: CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  margin: "0 auto",
  marginTop: "24px",          // NEW
  marginBottom: "24px",       // NEW
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",  // NEW
  border: "1px solid #e0e0e0",               // NEW
};
```

**B) `<Container>` element** — add `className`:

```tsx
<Container style={container} className="email-container">
```

**C) `<style>` block** — append before closing backtick:

```css
@media (max-width: 600px) {
  .email-container { margin: 12px auto !important; }
}
```

## Open Questions

None. All decisions are resolved by the proposal, exploration findings, and user confirmations.

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gmail strips box-shadow | Certain | Border fallback provides visual separation |
| Gmail Android ignores media queries | Certain | Default 24px margin remains — still looks clean |
| Container style splitting (React Email) | Low | margin/boxShadow/border all apply to `<table>`, not padding — no split behavior involved |
| `!important` ignored in some clients | Low | Gmail Web and Apple Mail support it; clients that don't fall back to 24px |
