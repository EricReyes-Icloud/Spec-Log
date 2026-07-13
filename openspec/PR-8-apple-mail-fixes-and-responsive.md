# PR-8: Apple Mail iOS Compatibility Fixes & Mobile Responsive Adjustments

## Description

Email templates rendered incorrectly in Apple Mail on iOS. The `<Container>` component from React Email renders as a `<table>` element, and Apple Mail WebKit does not support `max-width` on `<table>`, causing the main container to overflow the viewport. Even after addressing the container-level overflow, internal content (text, tables, links) continued to break out of bounds due to `box-shadow`, `white-space: nowrap`, and missing `table-layout` constraints.

This PR replaces the `<Container>` wrapper with a native `<div>` plus inner `<table>` in both email templates, eliminates properties that conflict with Apple Mail's layout engine, and applies table-level constraints (`table-layout: fixed`, `max-width: 100%`) to prevent content overflow. It also reduces footer link and comment text sizes on mobile via a media query, and fixes the sender display name to show "Spec Log" instead of a raw email address.

Additionally, the `RESEND_FROM_EMAIL` value is updated to use RFC 2822 format with a display name, so Gmail and Apple Mail both show "Spec Log" as the sender instead of the raw address.

## Changes Made

### Email Templates — Apple Mail WebKit Overflow Fix
- `src/emails/welcome-email.tsx` — Replaced `<Container>` with a `<div>` wrapper containing an inner `<table>` to work around Apple Mail WebKit not supporting `max-width` on `<table>` elements
- `src/emails/templates/weekly-newsletter.tsx` — Same `<Container>` to `<div>` + `<table>` replacement

### Email Templates — Internal Content Overflow Fix
- `src/emails/welcome-email.tsx` — Removed `boxShadow: "0 4px 12px"` from the wrapper (Apple Mail treats box-shadow as part of layout)
- `src/emails/welcome-email.tsx` — Replaced `whiteSpace: "nowrap"` with `wordBreak: "break-word"` on `footerPillLink`
- `src/emails/welcome-email.tsx` — Added `tableLayout: "fixed"` to internal content tables
- `src/emails/templates/weekly-newsletter.tsx` — Added `tableLayout: "fixed"` to internal content tables
- `src/emails/templates/weekly-newsletter.tsx` — Added `maxWidth: "100%"`, `overflowWrap: "break-word"`, `wordBreak: "break-word"` to the `dangerouslySetInnerHTML` wrapper

### Mobile Responsive — Footer Links and Comment Line
- `src/emails/welcome-email.tsx` — Added `@media (max-width: 600px)` query reducing `footerPillLink` to `0.5625rem` (9px) with `padding: 0.25rem 0.5rem`
- `src/emails/welcome-email.tsx` — Added `@media (max-width: 600px)` query reducing `commentLine` to `0.5625rem` (9px)
- `src/emails/templates/weekly-newsletter.tsx` — Same media query adjustments for `footerPillLink` and `commentLine`

### Sender Display Name
- `.env.local` — Changed `RESEND_FROM_EMAIL` from `newsletter@speclog.dpdns.org` to `"Spec Log <newsletter@speclog.dpdns.org>"` (RFC 2822 format)
- `src/lib/services/__tests__/email.test.ts` — Updated mock to match the new `RESEND_FROM_EMAIL` value

## Impact

- **Apple Mail iOS**: Email templates no longer overflow the viewport on iOS. Both container-level and content-level overflow issues are resolved.
- **Gmail / Apple Mail sender name**: Sender now displays as "Spec Log" instead of "newsletter" (Gmail) or "newsletter@speclog.dpdns.org" (Apple Mail).
- **Mobile readability**: Footer social links and the closing comment line are appropriately sized on small screens (9px vs default).
- **Cross-client safety**: `table-layout: fixed` and `word-break: break-word` prevent content from breaking out of table cells in any email client.
- **Backward compatibility**: All changes are visual/template-level. No API signatures or business logic changed.
- **Test coverage**: Email service test updated to reflect the new sender format.

## Notes

### Testing
1. Send a test welcome email and verify it renders correctly in Apple Mail on iOS (no overflow, proper text wrapping)
2. Send a test welcome email and verify it renders correctly in Gmail, Outlook, and Thunderbird
3. Check the sender display name shows "Spec Log" in Gmail web and Apple Mail iOS
4. Verify footer social links and comment line are appropriately sized on mobile viewports (under 600px)
5. Run `npm test` to confirm the email service tests pass with the updated mock

### Environment
The following env var requires manual update in production/Vercel:
- `RESEND_FROM_EMAIL` — must use RFC 2822 format: `"Spec Log <newsletter@speclog.dpdns.org>"`

### Follow-ups
- Consider testing additional email clients (Yahoo Mail, Samsung Mail) for edge cases
- The `.env.local` change is not tracked by git — ensure the Vercel environment variable is updated separately
