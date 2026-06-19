# Newsletter sending via Resend with React Email templates

## Description

The newsletter editor could create drafts and preview them, but had no way to actually send email to subscribers. The "Publicar" button was disabled since the initial editor implementation. Admins could compose markdown content with custom tags, save drafts, and preview how they'd look — but the final mile of delivery was missing.

This PR implements the full email sending pipeline: a React Email template that renders markdown into email-compatible HTML, a sending service that delivers per-subscriber via Resend with 150ms rate-limit spacing, a protected API route that orchestrates the flow, and the wired publish button in both editor pages (new and edit) with loading, success, and error states. The markdown preprocessing pipeline (`withLineBreaks` + `preparseMarkdown`) is shared between the browser preview and the email renderer, ensuring visual fidelity between what admins see and what subscribers receive.

## Changes Made

### Features — Email Template

- `src/emails/templates/weekly-newsletter.tsx` — React Email component using table-based layout and inline `CSSProperties` for cross-client compatibility. macOS traffic-light header (red/yellow/green dots), content area receiving pre-parsed HTML via `dangerouslySetInnerHTML`, and footer with GitHub/LinkedIn links, decorative comment, and dynamic unsubscribe URL built from `unsubscribeToken` prop + `NEXT_PUBLIC_BASE_URL`

### Features — Sending Service

- `src/lib/services/email.ts` — `sendNewsletter()` function that: applies `withLineBreaks()` + `preparseMarkdown()` (same pipeline as editor preview), renders the `WeeklyNewsletter` component per subscriber via `@react-email/render`, sends each email through Resend SDK, updates Firestore subscriber documents (`totalEmailsSent: increment(1)`, `lastEmailSent: Timestamp.now()`), and returns a `SendResult` with counts. Empty subscriber list returns early. 150ms delay between sends. Resend SDK returns `{ data, error }` — explicit error check added, does NOT rely on thrown exceptions

- `src/app/api/newsletter/send/route.ts` — POST handler: Firebase session cookie verification (401 if missing/invalid), newsletter exists check (404), already-sent check (409 with `ALREADY_SENT` code), active subscriber fetch via `.where("status", "==", "active")`, delegates to `sendNewsletter()`, all-or-nothing newsletter status update (only sets `status: "sent"` + `sentAt` when `failedCount === 0`), generic error response (500) with server-side-only details logged via `console.error`

- `src/lib/firebase-client.ts` — Added `sentAt: Timestamp | null` to `Newsletter` interface, `markNewsletterAsSent()` helper for client-side status updates, and `data.sentAt ?? null` fallback in `getNewsletter()`

### Features — Publish Button Wiring

- `src/app/admin/editor/page.tsx` — New editor: `handlePublish` saves the newsletter first (auto-creates draft), then POSTs the returned ID to `/api/newsletter/send`. Three UI states: sending ("Enviando..."), success ("¡Enviado!"), error (inline message with re-enabled button)

- `src/app/admin/editor/[id]/page.tsx` — Edit editor: same pattern but sends directly with `params.id` (no save step needed). Same loading/success/error states

### Refactors

- `src/lib/markdown-preparser.ts` — Extracted `withLineBreaks()` from `NewsletterPreview.tsx` into the shared module, now exported for use by both the preview component and the email service

- `src/components/email/NewsletterPreview.tsx` — Removed inline `withLineBreaks()` function, now imports it from `@/lib/markdown-preparser` instead

### Bug Fixes

- `src/emails/templates/weekly-newsletter.tsx` — Replaced static `{{UNSUBSCRIBE_URL}}` placeholder with dynamic URL built from `unsubscribeToken` prop + `process.env.NEXT_PUBLIC_BASE_URL` (fallback `http://localhost:3000`)

- `src/lib/services/email.ts` — Added explicit Resend SDK error response check (`const { error: sendError } = ... if (sendError) throw...`). Resend returns `{ data, error }` instead of throwing on failure. Added per-subscriber success logging and final summary log (`[email] Summary: sent=N, failed=N, total=N`)

- `src/app/api/newsletter/send/route.ts` — Changed partial failure response from leaking `failedCount` and `sentCount` to returning generic `"Error interno del servidor"` (details logged server-side only)

### Dependencies

- `package.json` — Added `resend ^6.14.0` and `@react-email/render ^2.0.9`
- `pnpm-lock.yaml` — Lockfile update for Resend SDK, React Email renderer, and transitive dependencies

### SDD Documentation

- `openspec/changes/archive/2026-06-19-first-email-sending/` — Full SDD cycle with proposal, exploration, 3 delta specs (email-template, email-service, newsletter-send), design doc (sequence diagram + architecture decisions), task list (9/9 complete), and verification report (PASS — 22/22 spec scenarios compliant, zero TypeScript errors)
- `openspec/specs/email-template/spec.md` — Main spec synced from delta (5 requirements, 5 scenarios)
- `openspec/specs/email-service/spec.md` — Main spec synced from delta (6 requirements, 7 scenarios)
- `openspec/specs/newsletter-send/spec.md` — Main spec synced from delta (6 requirements, 8 scenarios)

## Impact

- **Admins can now publish newsletters** — the "Publicar" button triggers the full send pipeline. In the new editor, the newsletter is auto-saved as a draft first, then sent. In the edit editor, it sends the existing document directly.
- **Pipeline parity between preview and email** — the same `withLineBreaks` + `preparseMarkdown` processing ensures what admins see in the editor preview matches what subscribers receive (within email-client limitations).
- **Table-based, inline-styled HTML** — the React Email template generates email-client-compatible markup instead of relying on CSS classes or flexbox layouts that fail in Outlook and Gmail.
- **All-or-nothing status update** — the newsletter only transitions to `"sent"` if every subscriber received the email. Partial failures keep it as `"draft"` for retry. Per-subscriber errors are logged individually.
- **No breaking changes** — all additions are additive (new files, new exports). The preview component API is unchanged. Existing drafts remain in `"draft"` status until explicitly sent.
- **Subscriber records updated** — each sent email increments `totalEmailsSent` and sets `lastEmailSent` timestamp on the subscriber's Firestore document.
- **Unsubscribe URL is functional** — links point to `{NEXT_PUBLIC_BASE_URL}/unsubscribe?token={token}`, but no landing page exists at that route yet (returns 404).

## Notes

### Testing

1. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local` (use Resend test mode key from `resend.com/api-keys`)
2. Run `pnpm dev` and navigate to `/admin/editor`
3. Enter a title, write markdown content, click "Publicar" — verify the save-then-send flow works
4. Navigate to `/admin/editor/{id}` with an existing draft, click "Publicar" — verify direct send works
5. Verify newsletter appears with `status: "sent"` and `sentAt` timestamp in Firestore console
6. Verify active subscribers show incremented `totalEmailsSent` and updated `lastEmailSent`
7. Check server logs for `[email] Sent to ...` per-subscriber entries and a final summary line

### Known Follow-ups

1. **Custom tags rendering in email**: `<coment>`, `<orange>`, `<tip>`, `<cta>`, and alignment tags display as plain text in sent emails. The browser preview handles them via the ReactMarkdown + rehype-raw pipeline, but the email template injects pre-parsed HTML where these custom tags are not further transformed. Needs investigation into email-client-safe rendering of these visual elements.
2. **Unsubscribe landing page**: Tokens exist and links are correctly built, but `GET /unsubscribe` does not exist yet — subscribers clicking the link will hit a 404.
3. **Custom domain for production**: Currently sending from `onboarding@resend.dev` (Resend test mode). A verified custom domain is required before production use.

### Dependencies

- Requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL` environment variables configured
- Requires Resend account (free tier: 100 emails/day, 3 emails/second limit)
- Existing Firebase project, Admin SDK, and subscriber data with `unsubscribeToken` fields
