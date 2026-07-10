# Proposal: Welcome Email

## Intent

Send an automatic welcome email when a user registers via the landing page hero form. Currently the subscribe flow creates a Firestore document and redirects — but never notifies the user. This closes that gap with a simple, static welcome email.

## Scope

### In Scope
- Rewrite `src/emails/welcome-email.tsx`: rename to `WelcomeEmail`, use `WelcomeEmailProps { unsubscribeToken: string }`, static JSX content (no `dangerouslySetInnerHTML`)
- Add `sendWelcomeEmail()` to `src/lib/services/email.ts` — renders `WelcomeEmail` via React Email, sends single email via Resend (no markdown pipeline)
- Modify `POST /api/subscribe` to call `sendWelcomeEmail()` synchronously after Firestore doc creation

### Out of Scope
- Name personalization in email
- CTA button / call-to-action links
- Queue-based or retry delivery
- Client-side changes to the subscribe page
- Changes to `sendNewsletter()` or newsletter send flow

## Capabilities

### New Capabilities
- `welcome-email`: New React Email template component (`WelcomeEmail`) with static JSX content, macOS header, custom tags, tip section, footer with social pills and unsubscribe link. No `dangerouslySetInnerHTML`.

### Modified Capabilities
- `email-service`: Add `sendWelcomeEmail(name, email, unsubscribeToken)` — render `WelcomeEmail` via `@react-email/render`, send via Resend SDK. Simpler than `sendNewsletter` (no markdown pipeline).
- `subscription-api`: After document creation in `POST /api/subscribe`, call `sendWelcomeEmail()` synchronously with try/catch so email failure doesn't block registration.

## Approach

**Sync send in subscribe route** (Recommended by exploration). After creating the subscriber document, call `sendWelcomeEmail()` inline before returning the 201 response. The Resend call adds ~200-500ms — imperceptible vs the 6s confirmation page animation. Errors are logged server-side; the subscriber is already persisted so a failed email never loses the registration.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/welcome-email.tsx` | Modified | Rewrite: new interface, rename component, static JSX content |
| `src/lib/services/email.ts` | Modified | Add `sendWelcomeEmail()` function |
| `src/app/api/subscribe/route.ts` | Modified | Call `sendWelcomeEmail()` after doc creation |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Resend down at registration | Low | Error logged; subscriber exists in Firestore, can be targeted later |
| Added latency to subscribe | Low | ~200-500ms imperceptible vs 6s animation |
| No retry if email fails | Med | Acceptable for v1; subscriber still gets future newsletters |

## Rollback Plan

Revert changes to all 3 files: restore `welcome-email.tsx` to its placeholder state, remove `sendWelcomeEmail()` from `email.ts`, and remove the call from `subscribe/route.ts`. No data migration needed.

## Dependencies

- Existing Resend SDK config (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`)
- React Email render (`@react-email/render`)

## Success Criteria

- [ ] User registers via hero form and receives a welcome email at their address
- [ ] Welcome email renders correctly in Gmail, Outlook, and Apple Mail
- [ ] Unsubscribe link in the email works (token-based)
- [ ] Subscribe API still returns 201 with `redirectUrl` even if email send fails
