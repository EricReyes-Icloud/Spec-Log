# Tasks: Social Links Responsive Weekly

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~10–15 |
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
| 1 | Port responsive social links pattern to weekly-newsletter | PR 1 | Single file, ~10-15 lines changed |

## Phase 1: Footer Table Centering

- [x] 1.1 In `src/emails/templates/weekly-newsletter.tsx` line 244, change the outer social links `<table>` style from `width: "100%", borderCollapse: "collapse"` to `margin: "0 auto"` — removes `width` and `borderCollapse`, adds centering.

## Phase 2: Social Links Per-`<td>` Restructure

- [x] 2.1 Replace the single `<td align="center">` wrapper (lines 247–257) with per-`<td>` mapping: each `<Link>` gets its own `<td key={link.label} align="center" style={{ paddingRight: idx === 0 ? "12px" : "0" }}>`. Remove the outer `<td>` that wrapped all links.

## Phase 3: Mobile Media Query

- [x] 3.1 Append `@media (max-width: 600px) { table { max-width: 92% !important; } }` inside the existing `<Head>` `<style>` block (after line 138, before the closing backtick-template).

## Phase 4: Verification

- [x] 4.1 Run `npm run build` (or equivalent build check) to confirm the template compiles without errors.
- [x] 4.2 Inspect rendered HTML output: each social link must appear in its own `<td>`, media query present in `<style>`, outer table uses `margin: 0 auto`.
