# Proposal: Mobile font size 18px on email templates

## Intent

Email body text at 17px feels slightly small on mobile viewports (<600px). Bumping to 18px via embedded CSS media queries improves readability without altering the desktop experience or any component logic.

## Scope

### In Scope
- Append `@media (max-width: 600px)` rule to the existing `<style>` block in `weekly-newsletter.tsx` targeting `.content-area`
- Add a `<style>` block with the same media query in `welcome-email.tsx` (currently has empty `<Head />`), targeting a new `email-content-cell` class on the content `<td>`
- Add `className="email-content-cell"` to the content `<td>` in `welcome-email.tsx`

### Out of Scope
- No font size changes on desktop (>600px) — 17px stays as-is
- No changes to other email templates (only these two)
- No spec-level changes — pure CSS visual tweak

## Capabilities

### New Capabilities
None — CSS-only visual change.

### Modified Capabilities
None — no spec-level behavior changes.

## Approach

Two targeted CSS additions, one per template:

1. **`src/emails/templates/weekly-newsletter.tsx`** — add `@media (max-width: 600px) { .content-area { font-size: 18px !important; } }` at the end of the existing `<style>` block (line 139).
2. **`src/emails/welcome-email.tsx`** — replace `<Head />` with `<Head><style>{ ... }</style></Head>` containing the same media query, and add `className="email-content-cell"` to the content `<td>` (line 257). The media query targets `.email-content-cell`.

The `<Text>` components in `welcome-email` inherit font-size from the parent `<td>` (`contentCell` style, `fontSize: "17px"`). The class + `!important` media query override will only apply on mobile.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Append media query to existing `<style>` |
| `src/emails/welcome-email.tsx` | Modified | Add `<Head>` with `<style>` and className on `<td>` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Email client strips `<style>` blocks | Medium | Falls back to 17px inline — acceptable degradation |
| `!important` overrides desktop font on non-mobile | Low | Media query wraps at 600px max-width, desktop unaffected |

## Rollback Plan

Revert the two file changes via `git revert` on the commit. No data migration, no config rollback needed.

## Dependencies

None.

## Success Criteria

- [x] On viewport <=600px, `weekly-newsletter.tsx` content area renders at 18px
- [x] On viewport <=600px, `welcome-email.tsx` body text renders at 18px
- [x] On viewport >600px, both templates remain at 17px (unchanged)
- [x] No new lint or build errors
