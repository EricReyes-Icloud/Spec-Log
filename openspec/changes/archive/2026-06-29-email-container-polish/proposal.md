# Proposal: email-container-polish

## Intent
Polish the email template container to improve visual separation in email clients by adding vertical margins, box-shadow, and responsive mobile adjustments. This addresses the current flush appearance against Gmail's interface and adds depth as a progressive enhancement.

## Scope

### In Scope
- Add 24px vertical margin (top/bottom) to the email container, reducing to 8-12px on mobile via media query
- Add box-shadow (0 4px 12px rgba(0,0,0,0.15)) as progressive enhancement
- Add subtle border fallback (1px solid #e0e0e0) for clients that strip box-shadow (like Gmail)
- Modify only `src/emails/templates/weekly-newsletter.tsx`

### Out of Scope
- Changes to email content or structure
- Modifications to other email templates
- Behavioral changes to email sending or processing

## Capabilities

### New Capabilities
None

### Modified Capabilities
None

## Approach
Update the container's inline styles and extend the existing `<Head>` style block:
1. Add `marginTop: "24px"`, `marginBottom: "24px"` to container styles
2. Add `boxShadow: "0 4px 12px rgba(0,0,0,0.15)"` for depth
3. Add `border: "1px solid #e0e0e0"` as fallback for clients stripping box-shadow
4. Extend existing `<style>` block with `@media (max-width: 600px)` to reduce margins to 8-12px
This follows the existing pattern of using inline styles for layout and `<Head>` for content-area styles.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Update container CSSProperties and add media query to `<Head>` style block |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gmail strips box-shadow entirely | High | Added border fallback ensures visual separation |
| Gmail Android ignores media queries | Medium | Default 24px margins acceptable on mobile |
| React Email Container style splitting | Low | Margin/boxShadow apply to `<table>` per React Email docs |
| Dark mode auto-inversion | Low | RGBA values low-contrast; borderRadius survives |

## Rollback Plan
Revert changes to `src/emails/templates/weekly-newsletter.tsx` to previous version. Change is purely presentational with no functional impact.

## Dependencies
None

## Success Criteria
- [ ] Email container shows 24px vertical margin in desktop email clients
- [ ] Email container shows 8-12px vertical margin on mobile (clients supporting media queries)
- [ ] Email container displays box-shadow in supporting clients (Apple Mail, Outlook 365, etc.)
- [ ] Email container shows border fallback in clients stripping box-shadow (Gmail)
- [ ] Existing email template tests pass (if any) and visual preview remains correct