# Proposal: Mobile Email Responsive

## Intent

Both welcome-email.tsx and weekly-newsletter.tsx render at 100% viewport width on mobile—no visual gap on small screens. A CSS media query in `<Head>` targeting `.email-container` was attempted but fails: Gmail strips `<style>` tags, inline `max-width: 600px` overrides class-based rules, and Outlook ignores media queries. We need a media-query-free approach that works across Gmail, Apple Mail, Yahoo, and Outlook.

## Scope

### In Scope
- Add fluid wrapper `<table>` (100% width, `padding: 24px 4%` on `<td>`) to welcome-email.tsx
- Add fluid wrapper `<table>` (same pattern) to weekly-newsletter.tsx
- Remove the now-unnecessary `.email-container` CSS class and media query from both files
- `npm run build` passes

### Out of Scope
- Outlook-specific compat fixes (deferred)
- Responsive rendering tests (existing structural tests suffice)
- Landing page responsiveness (already handled in separate spec)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `email-template`: Add responsive fluid-wrapper requirement — weekly newsletter template MUST include a fluid wrapper table for mobile responsive rendering at ~92% viewport width
- `welcome-email`: Add responsive fluid-wrapper requirement — welcome email component MUST include a fluid wrapper table for mobile responsive rendering at ~92% viewport width

## Approach

**Fluid Wrapper Table** — Wrap the existing `Container` component in an outer `<table>` at 100% width with `padding: 24px 4%` on the inner `<td>`:
- Desktop: inner `Container` still caps at 600px via its existing `maxWidth` prop
- Mobile: 4% side padding shrinks effective content width to ~92% of viewport, creating the visual gap
- Vertical 24px padding ensures consistent spacing on mobile (matches desktop margins)
- Works without media queries → compatible with Gmail, Apple Mail, Yahoo
- No structural changes to the inner `Container` or its children

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/welcome-email.tsx` | Modified | Wrap `<Container>` in fluid wrapper `<table>`, remove `.email-container` media query |
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Wrap `<Container>` in fluid wrapper `<table>`, remove `.email-container` media query |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Desktop appearance shifts | Low | `maxWidth=600` on Container unchanged; outer table is purely structural |
| Some email client breaks wrapper table | Low | Table-based layout is the most widely supported HTML pattern in email clients |

## Rollback Plan

Revert both files: `git checkout HEAD -- src/emails/welcome-email.tsx src/emails/templates/weekly-newsletter.tsx`.

## Dependencies

None.

## Success Criteria

- [ ] Welcome email renders with ~92% max width on <600px viewports
- [ ] Weekly newsletter renders with ~92% max width on <600px viewports
- [ ] Desktop appearance unchanged (still capped at 600px)
- [ ] `npm run build` compiles without errors
- [ ] Existing tests still pass
