# Proposal: Container Width Apple Mail Fix

## Intent

Apple Mail (iOS) renders `weekly-newsletter.tsx` and `welcome-email.tsx` with the Container overflowing right on first open. On app-switch repaint, Apple Mail corrects itself. Root cause: React Email's `<Container>` renders `<table width="100%" style="max-width:600px">`. The `width="100%"` is an HTML attribute, not CSS. When nested inside `padding: 24px 4%`, WebKit's initial layout pass ignores the parent padding and renders at full viewport width. The CSS `width` property takes precedence over the HTML attribute and forces correct calculation on first paint.

## Scope

### In Scope
- Add `width: "100%"` as explicit CSS property to the `container` style object in `weekly-newsletter.tsx`
- Add `width: "100%"` as explicit CSS property to the `container` style object in `welcome-email.tsx`

### Out of Scope
- No other email templates — only these two use `<Container>` with the problematic wrapper pattern
- No spec changes — pure CSS bugfix, no behavior change

## Capabilities

### New Capabilities
None — CSS-only implementation fix.

### Modified Capabilities
None — no spec-level behavior changes.

## Approach

Add `width: "100%"` to the existing `container: CSSProperties` object in both files (lines 25-35 in `weekly-newsletter.tsx`, lines 31-41 in `welcome-email.tsx`). The `container` object already has `maxWidth: "600px"`, so `width: "100%"` keeps it at 100% of the parent until the max-width cap is reached — matching the current intent but fixing the WebKit rendering bug.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Add `width: "100%"` to container style |
| `src/emails/welcome-email.tsx` | Modified | Add `width: "100%"` to container style |

## Risks

None — CSS-only additive change. No behavior, layout, or content impact.

## Rollback Plan

Revert the two-line change in both files. No migration needed.

## Dependencies

None.

## Success Criteria

- [ ] Both email templates render correctly in Apple Mail (iOS) on first open — no right-side overflow
- [ ] Existing rendering in Gmail, Outlook, and Thunderbird is unchanged
- [ ] `npm run build` succeeds
