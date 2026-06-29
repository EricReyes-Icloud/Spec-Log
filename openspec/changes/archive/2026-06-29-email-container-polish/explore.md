# Exploration: email-container-polish

## Current State

The email template at `src/emails/templates/weekly-newsletter.tsx` uses React Email's `<Container>` with the following styles:

```typescript
const container: CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "8px",
  overflow: "hidden"
};
```

The Container renders as a `<table>` element. It applies most styles to the `<table>` itself, splitting padding-related styles to an inner `<td>` for Klaviyo/Outlook compatibility.

**Current visual gaps:**
- No vertical margin — the email card sits flush against the Gmail interface chrome
- No box-shadow — the card lacks depth/separation from the background
- No responsive mobile adjustments — the 600px max-width is fixed

**Gmail CSS support (critical constraint):**
- `box-shadow`: **Stripped entirely** by Gmail Web, Gmail Android, Gmail iOS. Supported by Apple Mail, Outlook 365, Samsung Mail, Thunderbird, HEY, Superhuman.
- `@media` queries: **Partially supported** in Gmail Web (viewport-based). **Ignored entirely** in Gmail Android.
- `<style>` blocks: **Stripped** in Gmail. React Email already converts Tailwind classes to inline styles, so this is handled.
- `margin-top`/`margin-bottom`: **Supported** in all clients.

## Affected Areas

- `src/emails/templates/weekly-newsletter.tsx` — The `container` CSSProperties object and potentially a new `<style>` block in `<Head>` for media queries
- No other files need modification — this is a single-file visual polish

## Approaches

### 1. Inline styles + `<style>` media query (Recommended)

Add `marginTop`/`marginBottom` to the `container` inline style. Add `boxShadow` as a progressive enhancement (inline style). Add a `<style>` block in `<Head>` with `@media` queries for mobile margin reduction.

**Pros:**
- Simple, minimal change (single file)
- `box-shadow` works as progressive enhancement in Apple Mail, Outlook 365, etc.
- `margin` is universally supported — vertical spacing works everywhere
- `@media` queries work in Gmail Web (desktop) and Apple Mail
- Follows existing pattern (template already uses `<style>` block for content classes)

**Cons:**
- Gmail strips `box-shadow` — no depth effect in Gmail (only border fallback helps)
- Gmail Android ignores media queries — mobile margins won't adjust on Android Gmail
- Mobile margin reduction only works in Apple Mail and Gmail Web desktop

**Effort:** Low

### 2. Wrapper table approach with border fallback

Wrap the Container in an outer `<table>` that provides a subtle `border` as fallback, plus `boxShadow` as progressive enhancement. Apply margins to the outer wrapper.

**Pros:**
- Border fallback ensures visual separation in Gmail/Outlook (where box-shadow is stripped)
- Cleaner separation of concerns (wrapper handles spacing, Container handles content)

**Cons:**
- Adds DOM complexity (extra `<table>` wrapper)
- Risk of breaking existing Container behavior (React Email's Container already renders as `<table>`)
- Border fallback looks different from box-shadow (thinner, less elegant)
- More invasive change to the template structure

**Effort:** Medium

### 3. Apply margins to `<Body>` instead of Container

Move vertical margins to the `<Body>` component's `main` style object, keeping Container clean.

**Pros:**
- Container stays focused on content layout
- Body-level margins are well-supported

**Cons:**
- Body styles are partially stripped by Yahoo/AOL (React Email works around this by applying to inner `<td>`)
- Less precise control over the card's spacing
- Doesn't address box-shadow at all — still needs a separate solution

**Effort:** Low

## Recommendation

**Approach 1: Inline styles + `<style>` media query.**

Rationale:
1. **Vertical margins** (`marginTop`/`marginBottom`) are universally supported — this is the safest and most impactful change.
2. **box-shadow** should be added as progressive enhancement. It works in Apple Mail, Outlook 365, Samsung Mail, and other WebKit/Blink clients. Gmail users won't see it, but the email still looks clean without it (white card on gray background).
3. **Border fallback** is optional but recommended: adding a subtle `border: "1px solid #e0e0e0"` ensures Gmail users still get visual separation even without box-shadow.
4. **Media queries** in the `<style>` block will work for Gmail Web (desktop viewport) and Apple Mail. Gmail Android will ignore them, but the default 24px margins are acceptable on mobile too.

The template already uses a `<style>` block in `<Head>` for content-area classes — adding responsive rules there is consistent with the existing pattern.

## Risks

1. **Gmail strips box-shadow** — This is a known limitation. The card will lack depth in Gmail but will still look clean (white on gray). Mitigation: add subtle border as fallback.
2. **Gmail Android ignores media queries** — Mobile margin reduction won't apply on Android Gmail. Mitigation: the default 24px margins are acceptable on mobile; they just won't be reduced to 8-12px.
3. **React Email Container style splitting** — The Container splits padding to inner `<td>` but applies other styles (including margin, boxShadow) to the `<table>`. This is well-documented behavior and should work correctly.
4. **Dark mode auto-inversion** — Gmail may invert the white background and box-shadow. Mitigation: the existing `borderRadius: "8px"` already survives dark mode; box-shadow's rgba values are low-contrast enough to be acceptable.

## Ready for Proposal

**Yes** — The exploration is complete. The recommended approach is clear, risks are identified, and the change is scoped to a single file with low effort.
