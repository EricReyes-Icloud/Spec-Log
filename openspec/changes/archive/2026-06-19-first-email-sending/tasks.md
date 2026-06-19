# Tasks: First Email Sending

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~230 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Dependencies & Foundation

- [ ] 1.1 Add `resend` and `@react-email/render` to `package.json` dependencies
- [ ] 1.2 Add `sentAt: Timestamp | null` to `Newsletter` type in `src/lib/firebase-client.ts` and export `setNewsletterSent(id: string)` helper that sets `status: "sent"` and `sentAt: Timestamp.now()`
- [ ] 1.3 Note: `RESEND_API_KEY` and `RESEND_FROM_EMAIL` must be configured in `.env.local` (user-managed, not code)

## Phase 2: Email Template

- [ ] 2.1 Create `src/emails/templates/weekly-newsletter.tsx` — React Email component with `{ htmlContent, unsubscribeToken }` props, table-based layout with inline styles, web-safe font fallbacks, macOS header (3 colored circles), content area via `dangerouslySetInnerHTML`, footer with social links (GitHub + LinkedIn text), decorative comment line, and unsubscribe link

## Phase 3: Email Service

- [ ] 3.1 Create `src/lib/services/email.ts` — `sendNewsletter(newsletter, subscribers[])` function that: runs `withLineBreaks()` → `preparseMarkdown()` on markdown, renders via `WeeklyNewsletter` template + `@react-email/render`, loops subscribers with 100ms delay sending via Resend SDK, updates each subscriber's `totalEmailsSent++` and `lastEmailSent` on success, logs per-subscriber result, returns `SendResult { sentCount, failedCount, failedEmails }`, updates newsletter to `"sent"` + `sentAt` only if ALL succeed

## Phase 4: Send API Route

- [ ] 4.1 Create `src/app/api/newsletter/send/route.ts` — POST handler that verifies Firebase session cookie (401), validates `newsletterId` in body, fetches newsletter from Firestore (404 if not found, 409 if `status === "sent"`), fetches active subscribers (`status === "active"`, 200 with `{ sentCount: 0 }` if empty), calls email service, returns 200 `{ success: true, sentCount }` or 500 with generic error

## Phase 5: Publish Button Wiring

- [ ] 5.1 Modify `src/app/admin/editor/page.tsx` — enable "Publicar" button; on click: save newsletter via `createNewsletter()`, get returned ID, call `POST /api/newsletter/send` with `{ newsletterId }`, handle loading/success/error states, disable button during send
- [ ] 5.2 Modify `src/app/admin/editor/[id]/page.tsx` — enable "Publicar" button; on click: call `POST /api/newsletter/send` with existing ID from `params.id`, handle loading/success/error states, disable button during send

## Phase 6: Verification

- [ ] 6.1 Manual verification — `pnpm build` passes, save newsletter as draft, "Publicar" button enabled in both editors, new editor: save-first-then-send flow works, edit editor: direct send works, success/error states render correctly
