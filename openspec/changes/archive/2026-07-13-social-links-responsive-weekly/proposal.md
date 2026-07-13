# Proposal: Social Links Responsive Weekly

## Intent

The weekly newsletter social links break on mobile email clients (Gmail, Outlook) because they render inside a single `<td>` — without the per-`<td>` structure needed for proper spacing — and lack a mobile media query to constrain width. Port the proven fix from `welcome-email.tsx` to `weekly-newsletter.tsx`.

## Scope

### In Scope
- Restructure social links from single `<td>` → per-`<td>` wrapping with `paddingRight: 12px`
- Add `max-width: 92%` mobile media query in `<Head>` styles
- Center social links table using `margin: 0 auto`

### Out of Scope
- Spec-level behavior changes — this is an implementation-only fix
- COMMENT_LINE_TEXT or commentLine — already present in weekly
- Any other template changes (header, content area, unsubscribe)

## Capabilities

> This is a pure implementation fix for email client compatibility. No spec-level behavior changes.

### New Capabilities
**None** — introduces no new features or spec-level behavior.

### Modified Capabilities
**None** — no existing requirements change. The cross-client HTML structure requirement (already in `openspec/specs/email-template/spec.md`) is fulfilled more reliably; no spec delta needed.

## Approach

1. Swap the single-`<td>` social links wrapper for per-`<td>` mapping (identical to welcome-email lines 355–365)
2. Add a `@media (max-width: 600px)` query inside the existing `<Head>` `<style>` block setting `table { max-width: 92% !important; }`
3. Change the social links outer `<table>` style from `width: "100%"` to `margin: "0 auto"`
4. No markup changes outside the footer section

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Footer social links structure + `<Head>` media query |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Pipeline parity tests fail | Low | Template output structure preserved; only footer markup changes |
| Visual regression on desktop | Low | Per-`<td>` renders identically at >600px; same `footerPillLink` style |
| Existing spec tests need update | None | No spec-level behavior change — implementation only |

## Rollback Plan

Revert `weekly-newsletter.tsx` with `git checkout HEAD -- src/emails/templates/weekly-newsletter.tsx`.

## Dependencies

None. All changes are self-contained in one file.

## Success Criteria

- [ ] Social links render in per-`<td>` elements with `12px` spacing between them
- [ ] Footer table centers via `margin: 0 auto` matching welcome-email
- [ ] Mobile email clients display footer at ≤92% of viewport width
- [ ] All existing tests pass
- [ ] Visual diff shows no desktop layout change
