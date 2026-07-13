# Archive Report: domain-setup

- **Date**: 2026-07-11
- **Change**: Migrate sender from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org`
- **Mode**: openspec
- **Status**: PASS (0 CRITICAL, 0 WARNING, 3 SUGGESTION)

---

## Summary

Migrated the newsletter email sender domain from Resend's default `onboarding@resend.dev` to the verified custom domain `newsletter@speclog.dpdns.org`. Added `replyTo` header in Resend API calls, BCC in mailto links (tip/reply sections) to `ereyes102504k@gmail.com`, and decoupled the mailto `senderEmail` from the `from` header. No API-level BCC — the personal email is only exposed through mailto links in the email templates.

**Estimated scope**: ~28 lines across 5 files. Single PR.

---

## Artifacts Generated

| Artifact | Path | Status |
|----------|------|--------|
| Proposal | `openspec/changes/domain-setup/proposal.md` | ✅ Present |
| Spec (delta) | `openspec/changes/domain-setup/specs/email-service/spec.md` | ✅ Present — merged into main spec |
| Design | `openspec/changes/domain-setup/design.md` | ✅ Present |
| Tasks | `openspec/changes/domain-setup/tasks.md` | ✅ Present — 7/7 tasks complete (1 reconciled*) |
| Verify Report | `openspec/changes/domain-setup/verify-report.md` | ✅ Present — PASS |

*\* Task 4.3 (manual smoke test) was reconciled as stale checkbox — deferred to post-deploy per orchestrator instruction. Verify report confirms PASS with 0 CRITICAL issues and no code-level gaps.*

---

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| explore | N/A | Not run for this change |
| propose | ✅ Complete | Proposal with rollback plan, scope, and risks |
| spec | ✅ Complete | Delta spec for email-service domain |
| design | ✅ Complete | Architecture decisions, data flow, file changes documented |
| tasks | ✅ Complete | 4 phases, 7 tasks, single-PR delivery |
| apply | ✅ Complete | All implementation tasks done, build passes |
| verify | ✅ PASS | Code review only (no test runner). 7/7 spec requirements compliant |
| archive | ✅ Complete | Delta specs synced, folder archived |

---

## Files Modified (Implementation)

| File | Change |
|------|--------|
| `.env.local` | `RESEND_FROM_EMAIL` updated; `RESEND_REPLY_TO_EMAIL` and `RESEND_BCC_MAILTO` added |
| `src/utils/mailto.ts` | Optional `bccEmail` param added to `createReplyMailto()` |
| `src/lib/services/email.ts` | `senderEmail` sourced from env var; `replyTo` added to Resend calls; `renderTipBoxes()` updated with BCC |
| `src/emails/welcome-email.tsx` | `bccMailto` prop added, passed to `createReplyMailto()` |
| `src/components/email/NewsletterPreview.tsx` | Verified — no changes needed |

---

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| email-service | Updated | 2 requirements added: "Custom Sender Domain" (replyTo in API, BCC in mailto, no API-level bcc) and "Mailto Sender Separated from From Header" (senderEmail prop, optional bccEmail param) |

The delta spec's original first requirement stated BCC at the Resend API level. This was corrected during merge to match the actual implementation: BCC is only in the mailto link (tip/reply sections), NOT in `resend.emails.send()`. The verify-report explicitly confirms this.

---

## Risks / Residual Items

| Item | Severity | Status | Notes |
|------|----------|--------|-------|
| Manual smoke test (task 4.3) | Low | Deferred post-deploy | Subscribe test email, verify from header, reply-to, tip mailto BCC, no API-level BCC. Cannot validate until deployed. |
| `senderEmail` naming (S2) | Low | Acknowledged | `senderEmail` is assigned from `RESEND_REPLY_TO_EMAIL` — semantically "reply-to" not "from". Minor readability concern; consider renaming to `replyEmail` in a future cleanup. |
| `replyTo` type format (S1) | Low | No action | Currently `string`; Resend accepts `string | string[]`. Works correctly as-is. |

---

## Reconciliation Log

| Task | Action | Reason |
|------|--------|--------|
| 4.3 | Reconciled `[ ]` → `[x]` | Manual smoke test requires deployed environment. Orchestrator explicitly deferred to post-deploy. Verify-report confirms 0 CRITICAL issues; all code-level validation passed. |

---

## Post-Archive Recommendations

1. **Deploy and run smoke test (task 4.3)** — Subscribe a test email after deploy. Verify:
   - `from` header shows `newsletter@speclog.dpdns.org`
   - `replyTo` header is set to personal email
   - Tip section mailto includes BCC to `ereyes102504k@gmail.com`
   - No `bcc` field in Resend API payload
2. **Consider renaming `senderEmail` → `replyEmail`** — Minor readability improvement flagged in verify S2. Low priority, can be done in a future refactor.
3. **Monitor Resend delivery** — First few sends after domain migration may have slightly different deliverability. Watch for bounces or spam folder placement in the first week.
