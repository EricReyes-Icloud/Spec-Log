# Spec: Domain Setup — Migrate to Custom Sender Domain

## Change ID
`domain-setup`

## Summary
Migrate sender from Resend's default `onboarding@resend.dev` to the verified domain `newsletter@speclog.dpdns.org`. The reply mailto in the welcome email tip section must send to both the newsletter domain and the owner's personal email (`ereyes102504k@gmail.com`).

## Environment Variables

| Variable | Current | New Value |
|----------|---------|-----------|
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | `newsletter@speclog.dpdns.org` |
| `RESEND_REPLY_TO_EMAIL` | *missing* | `newsletter@speclog.dpdns.org` |
| `RESEND_BCC_MAILTO` | *missing* | `ereyes102504k@gmail.com` |

## Spec Behavior

### 1. Sender domain — `from` header
- All emails sent via Resend (`sendWelcomeEmail` and `sendNewsletter`) must use `newsletter@speclog.dpdns.org` as the `from` address
- The `RESEND_FROM_EMAIL` env var drives this value

### 2. Reply-to header (Resend API)
- The `replyTo` parameter in `resend.emails.send()` must be `newsletter@speclog.dpdns.org` (the domain, not the personal email)
- This ensures standard "Reply" in email clients goes to the newsletter

### 3. Mailto link — tip section (welcome email)
- The `senderEmail` passed to `WelcomeEmail` must be `newsletter@speclog.dpdns.org`
- A new `bccMailto` prop must be passed with value `ereyes102504k@gmail.com`
- The `createReplyMailto()` function must support an optional BCC parameter
- The resulting mailto link must compose to `newsletter@speclog.dpdns.org` with BCC to `ereyes102504k@gmail.com`

### 4. No BCC at the API level
- The `resend.emails.send()` calls must NOT include a `bcc` parameter
- The only copy mechanism is the BCC in the mailto link (tip section)

### 5. Newsletter mailto
- The `renderTipBoxes()` call in `sendNewsletter()` must also use the sender domain as the primary email and include the BCC
- This ensures newsletter tip sections also copy the owner

## Files Modified

| File | Change |
|------|--------|
| `.env.local` | Update `RESEND_FROM_EMAIL`, add `RESEND_REPLY_TO_EMAIL`, `RESEND_BCC_MAILTO` |
| `src/utils/mailto.ts` | Add optional `bccEmail` parameter to `createReplyMailto()` |
| `src/lib/services/email.ts` | Update `senderEmail`, pass `bccMailto` prop, update `sendNewsletter` mailto |
| `src/emails/welcome-email.tsx` | Add `bccMailto` prop, update `createReplyMailto()` call |
| `src/components/email/NewsletterPreview.tsx` | If it renders tip boxes, update mailto usage (check if needed) |

## Unchanged
- `src/app/api/subscribe/route.ts` — no changes
- Template content/structure — unchanged, only props flow updated
- Resend API key — unchanged

## Success Criteria
- [ ] Welcome email arrives from `newsletter@speclog.dpdns.org`
- [ ] Newsletters arrive from `newsletter@speclog.dpdns.org`
- [ ] Reply-to header shows `newsletter@speclog.dpdns.org`
- [ ] Clicking the tip section composes to `newsletter@speclog.dpdns.org` with BCC to `ereyes102504k@gmail.com`
- [ ] No BCC leaked in API-level headers
- [ ] No regressions in email delivery or rendering

## Regression Scope
- Verify existing `createReplyMailto()` callers handle the new optional parameter gracefully
- Verify `subscribe/route.ts` still works (no interface change)
- Verify newsletter tip boxes still render correct mailto links
