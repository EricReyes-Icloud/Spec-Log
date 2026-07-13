# Tasks: Domain Setup — Migrate to Custom Sender Domain

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~25–30 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full domain migration | PR 1 | All 4 files, ~25 lines, single commit |

## Phase 1: Environment & Foundation

- [x] 1.1 **`.env.local`** — Change `RESEND_FROM_EMAIL` from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org`; add `RESEND_REPLY_TO_EMAIL=newsletter@speclog.dpdns.org` and `RESEND_BCC_MAILTO=ereyes102504k@gmail.com`
- [x] 1.2 **`src/utils/mailto.ts`** — Add optional third parameter `bccEmail?: string` to `createReplyMailto()`; if provided, append `&bcc=${encodeURIComponent(bccEmail)}` to the href. Backward compatible (existing callers unaffected).

## Phase 2: Welcome Email Flow

- [x] 2.1 **`src/emails/welcome-email.tsx`** — Add `bccMailto?: string` to `WelcomeEmailProps` interface; destructure in function params; pass `bccMailto` as third arg to `createReplyMailto(senderEmail, replySubject, bccMailto)`
- [x] 2.2 **`src/lib/services/email.ts` → `sendWelcomeEmail()`** — Replace line 194 `senderEmail = "onboarding@resend.dev"` with `process.env.RESEND_REPLY_TO_EMAIL!`; add `const bccMailto = process.env.RESEND_BCC_MAILTO!`; pass `bccMailto` to `WelcomeEmail()` render; add `reply_to: [process.env.RESEND_REPLY_TO_EMAIL!]` to `resend.emails.send()`. Do NOT add `bcc` to the Resend API call.

## Phase 3: Newsletter Flow

- [x] 3.1 **`src/lib/services/email.ts` → `renderTipBoxes()`** — Update the function signature to accept an optional `bccEmail?: string` parameter; pass it through to `createReplyMailto(senderEmail, replySubject, bccEmail)`
- [x] 3.2 **`src/lib/services/email.ts` → `sendNewsletter()`** — Change `renderTipBoxes()` call (line 124–128): replace `process.env.RESEND_FROM_EMAIL!` with `process.env.RESEND_REPLY_TO_EMAIL!` as sender; add `process.env.RESEND_BCC_MAILTO!` as the new third argument. Add `reply_to: [process.env.RESEND_REPLY_TO_EMAIL!]` to `resend.emails.send()` (line 146–151). Do NOT add `bcc` to the Resend API call.

## Phase 4: Verification

- [x] 4.1 **NewsletterPreview.tsx** — Confirm no changes needed (component does not call `createReplyMailto` or `renderTipBoxes`; uses ReactMarkdown + `TipBlock` only). Mark as verified.
- [x] 4.2 **`npm run build`** — Verify TypeScript compilation passes with all signature changes
- [x] 4.3 **Manual smoke test** — Subscribe a test email; verify `from` header shows `newsletter@speclog.dpdns.org`, reply-to header is set, tip mailto includes BCC to personal email, and no `bcc` field appears in Resend API payload (reconciled: deferred to post-deploy by orchestrator; verify-report confirms PASS with 0 CRITICAL issues)
