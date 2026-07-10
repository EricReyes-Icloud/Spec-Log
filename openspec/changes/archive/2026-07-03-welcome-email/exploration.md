# Exploration: Welcome Email for Spec Log

## Current State

### Welcome Email Component
`src/emails/welcome-email.tsx` exists as an **exact copy** of `src/emails/templates/weekly-newsletter.tsx`:
- Same interface: `WeeklyNewsletterProps { htmlContent: string; unsubscribeToken: string }`
- Same function name: `WeeklyNewsletter` (should be `WelcomeEmail`)
- Same `dangerouslySetInnerHTML` rendering with dynamic `htmlContent` prop
- Identical visual shell: macOS header dots, content area, footer with social pills

This is a placeholder — it needs to be transformed into a standalone welcome email with **static content** written directly in JSX (no `dangerouslySetInnerHTML`).

### Registration Flow
1. User fills Hero form (`src/components/landing/Hero.tsx`) — fields: `name`, `email`
2. Form submits via `fetch("POST /api/subscribe")` with `{ name, email }`
3. API route (`src/app/api/subscribe/route.ts`) validates input, checks for duplicates, creates Firestore document in `subscribers/{email}` with schema: `{ name, email, status: "active", source: "landing-page", createdAt, confirmedAt: null, lastEmailSent: null, metadata: { browser, country }, totalEmailsSent: 0, unsubscribeToken }`
4. Returns `{ redirectUrl: "/subscribe" }` with status 201
5. Client redirects to `/subscribe` — animated terminal-style confirmation page

**Key gap**: No email is sent during registration. The subscribe route creates the document and redirects, but never triggers any email delivery.

### Email Sending Infrastructure
- `src/lib/services/email.ts` exports `sendNewsletter()` — processes markdown → HTML via unified pipeline, renders via React Email `WeeklyNewsletter` template, sends via Resend SDK
- Currently ONLY used by `POST /api/newsletter/send` (admin-triggered, requires Firebase session cookie auth)
- Resend configured: `RESEND_API_KEY`, `RESEND_FROM_EMAIL=onboarding@resend.dev`
- Rate limiting: 150ms delay between sends (for batch newsletters)

### Data Available at Registration
From the subscribe API route, we have access to:
- `name` (trimmed string)
- `email` (normalized lowercase)
- `unsubscribeToken` (generated 8-char uppercase alphanumeric)

## Affected Areas

| File | Why |
|------|-----|
| `src/emails/welcome-email.tsx` | **Rewrite** — change interface to `{ name: string; unsubscribeToken: string }`, replace `dangerouslySetInnerHTML` with static JSX content, rename export to `WelcomeEmail` |
| `src/lib/services/email.ts` | **Add** `sendWelcomeEmail(name, email, unsubscribeToken)` function — simplified pipeline (no markdown processing needed), renders `WelcomeEmail` template, sends single email via Resend |
| `src/app/api/subscribe/route.ts` | **Modify** — call `sendWelcomeEmail()` after creating the subscriber document (fire-and-forget or await with error handling) |
| `src/app/subscribe/page.tsx` | **No changes needed** — the animation already shows "Primer mail enviado" as a UI element; this becomes truthful once the welcome email is actually sent |

## Approaches

### 1. Synchronous send in subscribe API route (Recommended)
Call `sendWelcomeEmail()` directly in the POST handler after document creation, before returning the response.

- **Pros**: Simplest implementation, no new files/routes, email sending uses the same Resend infrastructure, single transaction flow
- **Cons**: Adds ~200-500ms latency to the registration response (Resend API call), user waits slightly longer before redirect, if Resend is down the registration still succeeds but email is lost
- **Effort**: Low

### 2. Fire-and-forget with `setTimeout` / `Promise.resolve()`
Call `sendWelcomeEmail()` without `await` — let it run in the background while the response is returned immediately.

- **Pros**: Zero added latency to registration response, user experience unchanged
- **Cons**: Unhandled promise rejection risk (need `.catch()`), email errors are silently swallowed, harder to debug, no retry mechanism, Vercel serverless functions may terminate before the background promise resolves
- **Effort**: Low

### 3. Separate API route + client trigger
Create `POST /api/welcome-email` that the client calls after redirecting to `/subscribe`.

- **Pros**: Clean separation, client can show email-sending status, retry possible
- **Cons**: Requires client-side code changes, adds complexity, client must handle errors, email could fail after the user already sees the success animation, two network requests instead of one
- **Effort**: Medium

### 4. Queue-based (future-proof)
Use a job queue (e.g., Inngest, QStash, or even a Firestore-based queue) to process welcome emails asynchronously.

- **Pros**: Reliable delivery, retry mechanism, scalable, decoupled from request lifecycle
- **Cons**: Massive over-engineering for a single welcome email, adds external dependency, requires new infrastructure, current project has no queue system
- **Effort**: High

## Recommendation

**Approach 1: Synchronous send in subscribe API route.**

Rationale:
1. The welcome email is a single, lightweight email (no markdown pipeline needed) — the Resend API call adds minimal latency
2. Simplicity: no new routes, no client changes, no fire-and-forget risk
3. The subscribe page animation already takes ~6 seconds to complete — an extra 200-500ms is imperceptible
4. If Resend fails, the registration still succeeds (document is already created) — we log the error and the subscriber still exists in the system
5. Follows the existing pattern: `sendNewsletter()` is called synchronously in the newsletter send route

**Implementation plan:**
1. Rewrite `welcome-email.tsx`: new interface `{ name: string; unsubscribeToken: string }`, static JSX content (greeting, welcome message, what to expect, social links, unsubscribe), rename export to `WelcomeEmail`
2. Add `sendWelcomeEmail()` to `email.ts`: import `WelcomeEmail`, render via `@react-email/render`, send single email via Resend (no markdown pipeline needed)
3. Modify `subscribe/route.ts`: import and call `sendWelcomeEmail()` after document creation, wrap in try/catch so email failure doesn't block registration

## Risks

1. **Email delivery failure**: If Resend is down or the send fails, the user has registered but never received the welcome email. Mitigation: log the error, the subscriber record exists and can be targeted later. A future enhancement could add a "welcome email sent" boolean to the subscriber document.
2. **Latency on registration**: The synchronous Resend call adds ~200-500ms. Mitigation: the subscribe page animation already takes 6 seconds, so this is imperceptible to users.
3. **No retry mechanism**: If the email fails, there's no automatic retry. Mitigation: acceptable for v1 — the subscriber is in the system and can receive future newsletters. A retry queue could be added later.
4. **Welcome email content is static**: The user needs to define what the welcome email says. The exploration assumes a standard welcome message (greeting, what to expect, social links) but the exact copy should be confirmed before implementation.
5. **`sendWelcomeEmail` function location**: Could go in `email.ts` (alongside `sendNewsletter`) or in a new `welcome-email.ts` service. Recommendation: keep it in `email.ts` since it uses the same Resend infrastructure.

## Ready for Proposal

**Yes** — The exploration is complete. The recommended approach is clear, all affected files are identified, and the change is scoped to 3 files with low effort. The orchestrator should:
1. Confirm the welcome email content/copy with the user before proposing
2. Proceed to `sdd-propose` for the `welcome-email` change
