# Exploration: First Email Sending

## Current State

### Subscriber Infrastructure (Working)
- **API Route** `src/app/api/subscribe/route.ts`: Fully functional — validates name/email, deduplicates by email as Firestore doc ID, creates subscriber documents with full schema (name, email, status, source, createdAt, confirmedAt, lastEmailSent, metadata, totalEmailsSent, unsubscribeToken)
- **Firestore collection `subscribers`**: Documents keyed by normalized email. Fields include engagement tracking (`totalEmailsSent`, `lastEmailSent`) and an `unsubscribeToken` for future unsubscribe flow. Status is `"active"` on creation.
- **Landing page form** (`src/components/landing/Hero.tsx`): Submits to `POST /api/subscribe` and redirects to `/subscribe` confirmation page on success.

### Newsletter Infrastructure (Partially Working)
- **Firebase client SDK** (`src/lib/firebase-client.ts`): `createNewsletter`, `updateNewsletter`, `getNewsletter` — all CRUD operations for the `newsletters` collection. Status field supports `"draft" | "scheduled" | "sent"` but only `"draft"` is ever set.
- **Admin editor** (`src/app/admin/editor/page.tsx` + `src/app/admin/editor/[id]/page.tsx`): Full markdown editor with live preview. Saves as draft via `createNewsletter`/`updateNewsletter`. The **"Publicar" button exists but is disabled** (`disabled` attribute, no onClick handler).
- **Newsletter preview** (`src/components/email/NewsletterPreview.tsx`): Client-side React component that renders markdown with custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, alignment tags) using `react-markdown` + `rehype-raw`. This is a **browser preview only** — not an email-compatible renderer.
- **Newsletter listing** (`src/app/admin/newsletters/page.tsx`): Placeholder page — shows "Open Editor" button only, no list of existing newsletters.

### Email Template (Empty)
- `src/emails/templates/weekly-newsletter.tsx`: **Completely empty file** (0 lines). No React Email component defined.
- No `react-email`, `@react-email/*`, or `resend` packages are installed (checked `node_modules` and `package.json`).

### Auth & Route Protection
- **Admin auth**: Firebase Auth email/password + session cookie via `/api/auth/session`
- **Route protection**: `src/proxy.ts` (non-standard — named `proxy` instead of `middleware`) checks session cookie on `/admin/*` routes
- **Firestore rules** (`firestore.rules`): 
  - `subscribers` collection: No explicit rule (denied by default for clients; Admin SDK bypasses)
  - `newsletters` collection: Requires `request.auth != null` (Firebase Auth)

### Environment Variables
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID` — set ✓
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — set ✓
- **`RESEND_API_KEY` — MISSING**
- **No `.env.local` entry for any email service**

### Stub Service
- `src/lib/services/subscribe.ts`: Placeholder with `setTimeout(500)` — mentions Resend integration for "Phase 2" in comments but is not connected to anything.

---

## What's Missing to Send the First Email

### 1. Dependencies (Critical)
| Package | Status | Purpose |
|---------|--------|---------|
| `resend` | NOT INSTALLED | Email delivery API client |
| `react-email` / `@react-email/render` | NOT INSTALLED | Server-side email template rendering to HTML |

### 2. Environment Variables (Critical)
- `RESEND_API_KEY` — needed for Resend API authentication
- Potentially `RESEND_FROM_EMAIL` — sender address (must be from verified domain in Resend)

### 3. Email Sending Service (Critical)
- No `src/lib/services/email.ts` or equivalent exists
- No API route for triggering email sends (no `/api/send`, `/api/newsletter/send`, etc.)
- No integration between newsletter status (`"sent"`) and actual email dispatch

### 4. React Email Template (Critical)
- `src/emails/templates/weekly-newsletter.tsx` is empty — needs a proper React Email component
- Must render markdown content into email-compatible HTML (tables, inline styles, no CSS variables)
- Must include header/footer matching the preview component's design

### 5. Send Flow / UI (High)
- The "Publicar" button in both editor pages is disabled with no handler
- No confirmation dialog or send-to-all-preview
- No batch sending logic (iterate subscribers, send one-by-one or batch)
- No tracking of `totalEmailsSent` or `lastEmailSent` on subscriber documents after send

### 6. Newsletter Listing (Medium)
- `/admin/newsletters` is a placeholder — no list of existing newsletters
- Admin can't see drafts vs sent, can't select a newsletter to send
- Need at minimum: list view with status badges, send button per newsletter

### 7. Firestore Rules (Low Risk)
- `subscribers` collection has no explicit Firestore rule — fine for Admin SDK but should be documented
- `newsletters` already allows authenticated read/write — sufficient for now

---

## Affected Areas

| File/Path | Why Affected |
|-----------|-------------|
| `package.json` | Need to add `resend` and `react-email` (or `@react-email/render`) |
| `.env.local` | Need `RESEND_API_KEY` and `RESEND_FROM_EMAIL` |
| `src/emails/templates/weekly-newsletter.tsx` | Empty — must implement the actual email template |
| `src/lib/services/` (new file) | Email sending service using Resend SDK |
| `src/app/api/` (new route) | API endpoint for triggering send (e.g., `/api/newsletter/send`) |
| `src/app/admin/editor/page.tsx` | Enable and wire the "Publicar" button |
| `src/app/admin/editor/[id]/page.tsx` | Enable and wire the "Publicar" button |
| `src/app/admin/newsletters/page.tsx` | Replace placeholder with real newsletter listing |
| `src/lib/firebase-client.ts` | May need `listNewsletters()` function |

---

## Approaches

### 1. Minimal Send — Direct from Editor
Wire the "Publicar" button in the editor to a new API route that: fetches all active subscribers, renders the newsletter markdown into email HTML via `@react-email/render`, and sends via Resend batch API.

- **Pros**: Fastest path to first email. Single flow: edit → preview → publish.
- **Cons**: No send history, no scheduling, no retry. Tightly couples editing and sending.
- **Effort**: Low (template + service + API route + button wiring)

### 2. Send from Listing Page with Status Tracking
Build the newsletter listing page first. Admin selects a newsletter, clicks "Send", confirms, and the system sends. Track status transitions (`draft → scheduled → sent`) with timestamps.

- **Pros**: Cleaner separation of concerns. Full lifecycle visibility. Foundation for scheduling.
- **Cons**: More work upfront (listing UI + status management + send confirmation).
- **Effort**: Medium

### 3. Full Newsletter Lifecycle (Overkill for First Send)
Build scheduling, batch processing with retry, open/click tracking, unsubscribe handling — the complete system.

- **Pros**: Production-ready from day one.
- **Cons**: Massive scope creep for "first email sending". Blocks shipping.
- **Effort**: High — not recommended for this phase.

---

## Recommendation

**Approach 1 (Minimal Send) with targeted upgrades from Approach 2.** Specifically:

1. Install `resend` + `@react-email/render`
2. Add env vars for Resend
3. Implement the React Email template in `weekly-newsletter.tsx`
4. Create `src/lib/services/email.ts` — a thin wrapper around Resend
5. Create `POST /api/newsletter/send` API route (auth-protected, server-side only)
6. Enable the "Publicar" button in both editor pages → calls the send API
7. Update subscriber `totalEmailsSent` and `lastEmailSent` after successful send
8. Update newsletter `status` to `"sent"` + `sentAt` timestamp

This gets a working first email out while leaving the door open for scheduling and listing in a follow-up.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Email rendering inconsistency** — React Email HTML may render differently across clients (Outlook, Gmail, Apple Mail) | Medium | Use `@react-email/render` for consistent HTML; test with real email clients before sending to all subscribers |
| **Resend rate limits** — free tier has limits (100 emails/day, 3000/month) | Low | Batch sending with small delays; for first send this is fine |
| **No unsubscribe mechanism** — subscribers have `unsubscribeToken` but no endpoint to use it | Medium | Must NOT send without an unsubscribe link (CAN-SPAM/GDPR). Add unsubscribe URL to email footer |
| **Firestore rules for `subscribers`** — no explicit rule (rule mismatch: rule says `/subscribe/` but collection is `subscribers`) | Low | Admin SDK bypasses rules; not blocking but should be cleaned up |
| **Empty template** — `weekly-newsletter.tsx` is 0 lines; the markdown-to-email conversion is non-trivial | Medium | Need to convert markdown + custom tags into email-safe HTML (inline styles, table layout for Outlook) |
| **No send confirmation** — clicking "Publicar" sends immediately with no undo | Low | Add a confirmation dialog before actual send |
| **`src/proxy.ts` naming** — middleware file is named `proxy` not `middleware`, which is non-standard for Next.js | Low | Not blocking but should be investigated — may not be working as expected |

---

## Key Technical Decisions Needed

1. **React Email template approach**: Should the email template reuse the same `withLineBreaks` + `preparseMarkdown` logic from `NewsletterPreview`, or should it use a simpler email-safe rendering path? Email HTML requires inline styles and table-based layouts — the current Tailwind-based preview won't work in email clients.

2. **Send trigger location**: Should sending be triggered from the editor (publish button) or from a dedicated send page? Editor is simpler; dedicated page is more maintainable.

3. **Batch vs individual sending**: For first email, sending individually to each subscriber (with a small delay) is simpler and more resilient than a single batch call.

4. **Unsubscribe link**: Every email MUST include an unsubscribe link. The `unsubscribeToken` is already stored — just need a `/api/unsubscribe/[token]` endpoint and a footer link in the email template.
