# Proposal: Domain Setup — Migrate to Custom Sender Domain

## Intent

Migrate from Resend's default `onboarding@resend.dev` to the verified domain `speclog.dpdns.org` so sent emails appear from `newsletter@speclog.dpdns.org`. Add BCC to the owner on every send and set reply-to to the owner's personal email for the welcome email.

## Scope

### In Scope
- Change `RESEND_FROM_EMAIL` env var from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org`
- Replace hardcoded `senderEmail` in `sendWelcomeEmail()` with the env var
- Add `replyTo: "ereyes102504k@gmail.com"` to both `sendWelcomeEmail()` and `sendNewsletter()` Resend calls
- Add `bcc: "ereyes102504k@gmail.com"` to both `sendWelcomeEmail()` and `sendNewsletter()` Resend calls
- Update `.env.local` with new values

### Out of Scope
- Template changes — props flow stays intact
- API route changes
- DNS/domain verification (already done in Resend)
- Unsubscribe handling
- Multi-tenant sender config

## Capabilities

### New Capabilities
None — no new spec-level capabilities introduced.

### Modified Capabilities
None — existing specs (`email-service`, `newsletter-send`) don't specify `from`, `replyTo`, or `bcc` values; behavior is unchanged at the spec level.

## Approach

1. Update `.env.local`: change `RESEND_FROM_EMAIL` to `newsletter@speclog.dpdns.org`
2. In `sendWelcomeEmail()`: replace hardcoded `senderEmail = "onboarding@resend.dev"` with `process.env.RESEND_FROM_EMAIL!`; add `replyTo: "ereyes102504k@gmail.com"` and `bcc: "ereyes102504k@gmail.com"` to the Resend send call
3. In `sendNewsletter()`: add `replyTo` and `bcc` to the Resend send call
4. No template changes needed — `senderEmail` prop already flows to `createReplyMailto()`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.env.local` | Modified | `RESEND_FROM_EMAIL` → `newsletter@speclog.dpdns.org` |
| `src/lib/services/email.ts` | Modified | Replace hardcoded senderEmail, add replyTo + bcc to both send functions |
| `src/utils/mailto.ts` | None | No changes needed — already parameterized |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Resend rejects unverified domain | Low | Domain already verified per user |
| BCC leaks subscriber emails to owner | Low | BCC is invisible to recipients; owner sees all sent emails |
| Reply-to goes to personal email instead of newsletter | Low | Intentional — user wants replies to go to personal email |

## Rollback Plan

1. Revert `.env.local`: restore `RESEND_FROM_EMAIL=onboarding@resend.dev`
2. Revert `email.ts` changes via `git checkout`
3. Test with a manual subscription to confirm `onboarding@resend.dev` works again

## Dependencies

- Domain `speclog.dpdns.org` verified in Resend (already done per user)
- Resend API key with permissions for the verified domain

## Success Criteria

- [ ] Welcome email arrives from `newsletter@speclog.dpdns.org`
- [ ] Newsletter arrives from `newsletter@speclog.dpdns.org`
- [ ] BCC copy of each email arrives at `ereyes102504k@gmail.com`
- [ ] Replying to welcome email tip section composes to `ereyes102504k@gmail.com`
- [ ] No regressions in email delivery or rendering

Now let me write the proposal file.</think>

<｜DSML｜tool_calls>
<｜DSML｜invoke name="write">
<｜DSML｜parameter name="filePath" string="true">/home/eric_reyes/projects/spec-log/openspec/changes/domain-setup/proposal.md