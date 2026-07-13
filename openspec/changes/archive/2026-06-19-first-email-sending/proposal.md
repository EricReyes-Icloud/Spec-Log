# Proposal: First Email Sending

## Intent

Implement the first email sending capability in Spec Log to deliver newsletter content to subscribers. This addresses the core functionality gap where admins can create and preview newsletters but cannot actually send them via email. The system will enable one-click publishing from the editor interface that sends the newsletter to all active subscribers using Resend for delivery and React Email for template rendering.

## Scope

### In Scope
- Installation and configuration of `resend` and `@react-email/render` packages
- Creation of a React Email template (`src/emails/templates/weekly-newsletter.tsx`) that converts markdown + custom tags to email-compatible HTML
- Implementation of an email sending service (`src/lib/services/email.ts`) using Resend SDK
- Creation of a protected API route (`POST /api/newsletter/send`) for triggering email sends
- Wiring the "Publicar" button in both editor pages (`src/app/admin/editor/page.tsx` and `src/app/admin/editor/[id]/page.tsx`) to call the send API
- Updating subscriber records after send: increment `totalEmailsSent` and set `lastEmailSent` timestamp
- Updating newsletter status to `"sent"` and setting `sentAt` timestamp
- Adding unsubscribe link to email footer using existing `unsubscribeToken` field
- Environment variable configuration for `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

### Out of Scope
- Newsletter listing page enhancements (`/admin/newsletters` remains placeholder)
- Scheduling functionality (newsletters sent immediately upon publish)
- Send confirmation dialog (single-click publish as specified)
- Open/click tracking or analytics
- Retry mechanisms for failed sends
- Batch sending optimizations (individual sends with small delays)
- Unsubscribe endpoint creation (though unsubscribe link will be included in emails)
- Multiple newsletter templates (only weekly-newsletter template)

## Approach

The email sending pipeline will follow this architecture:
1. Admin clicks "Publicar" button in editor (either create or edit page)
2. Button calls `POST /api/newsletter/send` API route with newsletter ID
3. API route authenticates admin session and validates newsletter exists
4. Route fetches newsletter data from Firestore (title, markdown content)
5. Route retrieves all active subscribers from Firestore
6. For each subscriber:
   - Render newsletter markdown to HTML using React Email template and `@react-email/render`
   - Personalize unsubscribe link with subscriber's `unsubscribeToken`
   - Send email via Resend SDK
   - Add small delay between sends to avoid rate limits
7. After all sends complete:
   - Update newsletter document: set status to `"sent"` and `sentAt` timestamp
   - Update each subscriber document: increment `totalEmailsSent` and update `lastEmailSent`
8. Return success response to client

Key technical decisions:
- Use `@react-email/render` for server-side HTML generation (not client-side preview)
- Reuse existing markdown preprocessing logic (`withLineBreaks` + `preparseMarkdown`) for consistency with editor preview
- Individual subscriber sending rather than batch API for better error isolation and rate limit handling
- Server-side only implementation (no client-side email sending for security)
- Minimalist approach focused on getting first email sent successfully

## Key Decisions and Rationale

### Why React Email + Resend?
- **React Email**: Provides standardized, email-compatible components that generate table-based HTML with inline styles, ensuring better cross-client compatibility than direct HTML/Tailwind approaches
- **Resend**: Simple API, good documentation, generous free tier, and handles email delivery complexities (SPF/DKIM, deliverability optimization)
- **Consistency**: Using the same markdown preprocessing pipeline as the editor preview ensures visual fidelity between what admins see and what subscribers receive

### Why Two Rendering Pipelines?
- **Editor Preview**: Uses `react-markdown` + `rehype-raw` in browser for fast, interactive preview during editing (client-side, Tailwind styling)
- **Email Rendering**: Uses React Email components on server to generate standards-compliant HTML with inline tables/styles (server-side, email-client compatible)
- This separation maintains development velocity (fast preview) while ensuring production quality (email-safe output)

### Why Individual Sending vs Batch?
- Simpler error handling (failure on one subscriber doesn't stop entire send)
- Better rate limit control (can add delays between sends)
- Easier logging and tracking per subscriber
- For initial implementation with small subscriber lists, performance difference is negligible

### Why No Send Confirmation?
- Per requirements: "One click — the 'Publicar' button sends directly to ALL active subscribers without an extra confirmation step"
- Simplifies user flow for first implementation
- Can be added in future iterations if needed

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Email rendering inconsistency across clients (Outlook, Gmail, Apple Mail) | Medium | High | Use React Email's standardized components; test with Litmus or similar before full send; document known limitations |
| Resend rate limits (free tier: 100 emails/day) | Low | Medium | Add 100ms delay between sends; monitor usage; upgrade plan if needed |
| Missing unsubscribe mechanism (CAN-SPAM/GDPR violation) | Low | High | Include unsubscribe link in email footer using existing `unsubscribeToken`; implement endpoint in follow-up |
| Firestore write overload during subscriber updates | Low | Medium | Use batched writes; add error handling for partial failures |
| API key exposure or misuse | Low | High | Store `RESEND_API_KEY` in environment variables only; restrict to server-side routes; use Vercel environment variables |
| Template rendering failures due to malformed markdown | Medium | Medium | Wrap rendering in try/catch; log errors; send fallback plain text version if needed |
| Newsletter status inconsistency if process fails mid-send | Low | High | Use Firestore transactions where possible; implement idempotency checks; add manual recovery process |

## Rollback Plan

1. Immediately stop further sends by removing or renaming the `/api/api/newsletter/send` route
2. Revert newsletter status updates: change any accidentally sent newsletters back to `"draft"` and remove `sentAt`
3. Revert subscriber engagement metrics: decrement `totalEmailsSent` and restore previous `lastEmailSent` values (requires tracking sent count during operation)
4. Remove installed packages: `npm uninstall resend @react-email/render`
5. Remove environment variables: unset `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
6. Delete created files:
   - `src/lib/services/email.ts`
   - `src/emails/templates/weekly-newsletter.tsx`
   - `src/app/api/newsletter/send/route.ts`
7. Revert editor changes: disable "Publicar" button again in both editor pages
8. The change is largely additive; most existing functionality remains intact

## Dependencies

### New Packages
- `resend`: Official Node.js SDK for Resend API
- `@react-email/render`: Server-side rendering for React Email components

### Environment Variables
- `RESEND_API_KEY`: Authentication token from Resend dashboard
- `RESEND_FROM_EMAIL`: Verified sender address (e.g., `newsletter@yourdomain.com`)

### Existing Dependencies (No Changes Needed)
- Firebase Admin SDK (already configured in `src/lib/firebase-admin.ts`)
- Firebase Client SDK (already in `src/lib/firebase-client.ts`)
- React Email core (`react-email` may already be present; if not, will be installed as peer dependency)
- TypeScript, Next.js, Tailwind CSS (existing setup)

### Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add `resend` and `@react-email/render` dependencies |
| `.env.local` | Modify | Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` |
| `src/emails/templates/weekly-newsletter.tsx` | Create | React Email component for newsletter template |
| `src/lib/services/email.ts` | Create | Service wrapping Resend SDK with template rendering |
| `src/app/api/newsletter/send/route.ts` | Create | Protected API route for triggering sends |
| `src/app/admin/editor/page.tsx` | Modify | Enable and wire "Publicar" button |
| `src/app/admin/editor/[id]/page.tsx` | Modify | Enable and wire "Publicar" button |
| `src/lib/firebase-client.ts` | Modify | Add helper functions for batch updates if needed |

## Success Criteria

- [ ] Admin can create/edit newsletter in editor interface
- [ ] "Publicar" button is enabled and functional in both editor pages
- [ ] Clicking "Publicar" sends email to all active subscribers
- [ ] Recipients receive email with visual appearance matching editor preview (within email client limitations)
- [ ] Email includes functional unsubscribe link in footer
- [ ] Sender address appears as configured `RESEND_FROM_EMAIL`
- [ ] Newsletter status updates to `"sent"` with `sentAt` timestamp after successful send
- [ ] Subscriber records updated: `totalEmailsSent` incremented, `lastEmailSent` set to send timestamp
- [ ] No server-side errors during send process (checked via logs)
- [ ] `RESEND_API_KEY` and `RESEND_FROM_EMAIL` properly configured in environment