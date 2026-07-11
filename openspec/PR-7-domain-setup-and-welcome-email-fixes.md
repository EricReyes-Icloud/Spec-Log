# PR-7: Custom Sender Domain, Welcome Email Fixes & BCC Mailto Support

## Description

Emails were being sent from `onboarding@resend.dev` (Resend's default test domain), which causes deliverability issues and prevents replies from reaching a monitored inbox. Additionally, the welcome email had rendering problems in email clients: social links displayed with excessive gaps on desktop, and the container lacked mobile-responsive width constraints.

This PR migrates all outbound email to the custom domain `speclog.dpdns.org`, separates the `from` address from the reply-to address, and introduces a BCC mailto parameter so replies to the welcome email and newsletter tips are blind-copied to the project owner. It also fixes the welcome email template for better email client compatibility and adds a spam-folder reminder on the post-subscription page.

## Changes Made

### Email Service — Custom Sender Domain
- `src/lib/services/email.ts` — Replaced hardcoded `onboarding@resend.dev` with `process.env.RESEND_FROM_EMAIL!` in `sendWelcomeEmail()`; added `replyTo` parameter to `resend.emails.send()` call sourced from `RESEND_REPLY_TO_EMAIL`
- `src/lib/services/email.ts` — Added `replyTo` parameter to `resend.emails.send()` call in `sendNewsletter()`; updated `renderTipBoxes()` call to pass `RESEND_REPLY_TO_EMAIL` and `RESEND_BCC_MAILTO`
- `src/lib/services/email.ts` — Added optional `bccEmail` parameter to `renderTipBoxes()` signature, forwarded to `createReplyMailto()`
- `src/utils/mailto.ts` — Added optional `bccEmail` parameter to `createReplyMailto()`; appends `&bcc=` to the mailto href when provided

### Welcome Email Template — Email Client Compatibility
- `src/emails/welcome-email.tsx` — Changed `footerPillLink` from `display: inline-flex` to `display: inline-block` for wider email client support
- `src/emails/welcome-email.tsx` — Restructured social links: replaced single `<td>` with inline-block links with individual `<td>` elements per link and auto-sizing, removing the excessive desktop gap
- `src/emails/welcome-email.tsx` — Added `max-width: 92%` media query for mobile (`@media only screen and (max-width: 480px)`) on `.email-container`
- `src/emails/welcome-email.tsx` — Added optional `bccMailto` prop to `WelcomeEmailProps`; passed it to `createReplyMailto()` call
- `src/emails/welcome-email.tsx` — Added `className="comment-line"` to the footer comment `<Text>`; minor spacing adjustment on "before.you.leave" comment

### Post-Subscription Page — UX
- `src/app/subscribe/page.tsx` — Added "No olvides revisar tu bandeja de Spam" hint text on the post-subscription confirmation page

### Configuration
- `.env.local` — Changed `RESEND_FROM_EMAIL` from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org`; added `RESEND_REPLY_TO_EMAIL` and `RESEND_BCC_MAILTO` variables

### Documentation
- `openspec/specs/email-service/spec.md` — Added Custom Sender Domain and Mailto Sender Separation requirement sections with scenarios

## Impact

- **Deliverability**: All emails now send from the verified `speclog.dpdns.org` domain instead of the Resend test domain, reducing spam classification
- **Reply handling**: Replies to welcome emails and newsletter tips route to `RESEND_REPLY_TO_EMAIL` with BCC to the project owner via `RESEND_BCC_MAILTO`
- **Email rendering**: Welcome email no longer shows excessive gaps between social links on desktop and respects mobile viewport width constraints
- **Spam visibility**: Subscribers are reminded to check their spam folder after registration
- **Backward compatibility**: `bccEmail` parameter is optional in both `createReplyMailto()` and `renderTipBoxes()`; existing callers without the parameter continue to work unchanged
- **No API-level BCC**: The `bcc` parameter only affects the mailto href in email templates — no `bcc` field is added to `resend.emails.send()` API calls

## Notes

### Testing
1. Verify `sendWelcomeEmail()` produces a `resend.emails.send()` call with `from: newsletter@speclog.dpdns.org` and `replyTo` set to the personal email
2. Verify `sendNewsletter()` sends with the same `from`/`replyTo` values
3. Inspect the rendered welcome email HTML: social links should be in separate `<td>` elements without excessive gaps; container should have `max-width: 92%` on mobile
4. Check the mailto href in tip boxes and welcome email footer contains `&bcc=` with the encoded BCC address
5. Confirm the subscribe page shows the spam folder reminder after registration

### Environment
The following env vars are now required for email service:
- `RESEND_FROM_EMAIL` — sender address (e.g. `newsletter@speclog.dpdns.org`)
- `RESEND_REPLY_TO_EMAIL` — reply-to address for mailto links and Resend API
- `RESEND_BCC_MAILTO` — BCC address appended to mailto links
