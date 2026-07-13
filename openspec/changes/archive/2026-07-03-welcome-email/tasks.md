# Tasks: Welcome Email

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~170–225 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Email Component

- [x] 1.1 Rewrite `src/emails/welcome-email.tsx` — rename component to `WelcomeEmail`, interface `WelcomeEmailProps { unsubscribeToken: string }`, remove `htmlContent`
- [x] 1.2 Add static JSX content: comment header line → Title → Custom tags row → Tip section → Footer (social pills + unsubscribe link with token)
- [x] 1.3 Add `<PreviewText>` with `"Bienvenido a Spec Log"`
- [x] 1.4 Verify `dangerouslySetInnerHTML` is absent from all JSX

## Phase 2: Email Service

- [x] 2.1 Add `sendWelcomeEmail(email, unsubscribeToken)` to `src/lib/services/email.ts`
- [x] 2.2 Render `WelcomeEmail({ unsubscribeToken })` via `@react-email/render`, send via `resend.emails.send()` with `RESEND_FROM_EMAIL`
- [x] 2.3 Assert no markdown pipeline functions (`withLineBreaks`, `preparseMarkdown`, unified/rehype) are invoked

## Phase 3: API Integration

- [x] 3.1 Import `sendWelcomeEmail` in `src/app/api/subscribe/route.ts`
- [x] 3.2 Call `sendWelcomeEmail(email, unsubscribeToken)` after `subscriberDoc.set()`, wrapped in try/catch
- [x] 3.3 Log error on failure, always return 201 `{ redirectUrl: "/subscribe" }`

## Phase 4: Tests

- [x] 4.1 Unit: WelcomeEmail renders unsubscribe link containing the token
- [x] 4.2 Unit: `sendWelcomeEmail` calls `render()` then `resend.emails.send()` with correct args and subject
- [x] 4.3 Unit: `sendWelcomeEmail` does not invoke any markdown pipeline functions
- [x] 4.4 Integration: POST `/api/subscribe` calls `sendWelcomeEmail` after document creation
- [x] 4.5 Integration: Email throw still returns 201 with subscriber doc persisted
