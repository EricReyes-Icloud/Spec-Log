# Verify Report: domain-setup

- **Change**: Migrate sender from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org` with BCC in mailto tip section
- **Mode**: Code review (no test runner configured)
- **Date**: 2026-07-11

---

## Completeness

| Artifact | Status | Notes |
|----------|--------|-------|
| Proposal | ✅ Present | `openspec/changes/domain-setup/proposal.md` |
| Spec | ✅ Present | `openspec/changes/domain-setup/spec.md` |
| Design | ✅ Present | `openspec/changes/domain-setup/design.md` |
| Tasks | ✅ Present | `openspec/changes/domain-setup/tasks.md` (4/4 core tasks done, 1 manual smoke pending) |
| Tests | N/A | No test runner configured; verify is code review only |

---

## Build / Compilation Evidence

```
$ npm run build
✓ Compiled successfully in 13.8s
✓ TypeScript type-check passed
✓ 11/11 static pages generated
```

**Verdict**: Build passes with zero errors.

---

## Spec Compliance Matrix

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | `from` header uses `newsletter@speclog.dpdns.org` | ✅ PASS | `.env.local:15` → `RESEND_FROM_EMAIL=newsletter@speclog.dpdns.org`; `email.ts:148,210` uses `process.env.RESEND_FROM_EMAIL!` |
| 2 | `replyTo` header uses `newsletter@speclog.dpdns.org` | ✅ PASS | `.env.local:16` → `RESEND_REPLY_TO_EMAIL=newsletter@speclog.dpdns.org`; `email.ts:149,211` passes `replyTo: process.env.RESEND_REPLY_TO_EMAIL!` |
| 3 | `senderEmail` passed to template is `newsletter@speclog.dpdns.org` | ✅ PASS | `email.ts:196` → `senderEmail = process.env.RESEND_REPLY_TO_EMAIL!`; passed to `WelcomeEmail()` at line 203 |
| 4 | `bccMailto` passed to template with `ereyes102504k@gmail.com` | ✅ PASS | `.env.local:17` → `RESEND_BCC_MAILTO=ereyes102504k@gmail.com`; `email.ts:197` → `bccMailto = process.env.RESEND_BCC_MAILTO!`; passed to `WelcomeEmail()` at line 205 |
| 5 | `createReplyMailto()` generates mailto with TO to domain + BCC to personal | ✅ PASS | `mailto.ts:8-9` appends `&bcc=${encodeURIComponent(bccEmail)}` when provided; `welcome-email.tsx:166-170` passes `bccMailto` as third arg |
| 6 | NO `bcc` in `resend.emails.send()` calls | ✅ PASS | `email.ts:147-153` (sendNewsletter) — no `bcc` field; `email.ts:209-215` (sendWelcomeEmail) — no `bcc` field |
| 7 | `createReplyMailto()` backward compatible (bccEmail optional) | ✅ PASS | `mailto.ts:4` — `bccEmail?: string` is optional; existing callers without third arg unaffected |

---

## Correctness Table

| Check | Severity | Finding |
|-------|----------|---------|
| No residual `onboarding@resend.dev` references in `src/` | ✅ PASS | Grep across `src/` returned zero matches |
| All env vars defined in `.env.local` | ✅ PASS | `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL`, `RESEND_BCC_MAILTO` all present |
| `NewsletterPreview.tsx` unchanged and correct | ✅ PASS | Component does not call `createReplyMailto` or `renderTipBoxes`; uses `TipBlock` only (task 4.1 verified) |
| `subscribe/route.ts` unchanged | ✅ PASS | No interface changes; no modifications needed |
| `renderTipBoxes()` signature updated with optional `bccEmail` | ✅ PASS | `email.ts:29` — `bccEmail?: string` parameter; `email.ts:62` passes it to `createReplyMailto()` |
| `sendNewsletter()` passes correct args to `renderTipBoxes()` | ✅ PASS | `email.ts:124-129` — uses `RESEND_REPLY_TO_EMAIL` as sender, `RESEND_BCC_MAILTO` as BCC |
| `replyTo` format compatible with Resend API | ✅ PASS | Resend accepts both `string` and `string[]` for `replyTo`; current code passes string which is valid |

---

## Design Coherence

| Design Decision | Implementation | Match |
|-----------------|----------------|-------|
| Separate env vars for from, replyTo, bccMailto | `.env.local` defines all three separately | ✅ |
| Optional `bccEmail` param in `createReplyMailto()` | `mailto.ts:4` — `bccEmail?: string` | ✅ |
| `senderEmail` comes from `RESEND_REPLY_TO_EMAIL` (not `RESEND_FROM_EMAIL`) | `email.ts:196` and design line 21 match | ✅ |
| No API-level BCC | Neither `sendNewsletter` nor `sendWelcomeEmail` include `bcc` | ✅ |
| Mailto BCC only (tip section) | `renderTipBoxes()` and `WelcomeEmail` both pass `bccMailto` | ✅ |

---

## Issues

### SUGGESTION

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| S1 | `email.ts:149,211` | `replyTo` is passed as `string` — Resend docs show `replyTo` as `string \| string[]`. Current usage is valid but could be made explicit. | No action needed; current code works correctly. |
| S2 | `email.ts:196` | `senderEmail` is assigned from `RESEND_REPLY_TO_EMAIL` (same value as `RESEND_FROM_EMAIL`). This creates semantic confusion — `senderEmail` for the mailto link is semantically "reply-to", not "from". | Consider renaming to `replyEmail` for clarity, or add a comment explaining why `RESEND_REPLY_TO_EMAIL` is used here. Minor readability improvement. |
| S3 | Tasks 4.3 | Manual smoke test remains unchecked. | Complete after deploy: subscribe test email, verify from header, reply-to, tip mailto BCC, and no API-level BCC. |

No CRITICAL or WARNING findings.

---

## Residual References Check

| Pattern | Scope | Matches |
|---------|-------|---------|
| `onboarding@resend.dev` | `src/` | 0 |
| `onboarding@resend.dev` | `.env.local` | 0 |

Clean.

---

## Final Verdict

**PASS**

All 7 spec requirements verified and compliant. Build compiles cleanly. No residual references to the old domain. All tasks complete (core implementation done; only manual smoke test remains post-deploy). Three minor suggestions for code clarity — none blocking.
