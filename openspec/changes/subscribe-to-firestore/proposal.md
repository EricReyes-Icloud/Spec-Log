# Proposal: Subscribe to Firestore (subscribe-to-firestore)

## Intent

Connect the landing page subscription form to Firestore so user registrations are persisted. On form submit, create a subscriber document in the `subscribers` collection, then redirect to `/subscribe` for the confirmation animation.

## Scope

### In Scope
- New API route `POST /api/subscribe` using Firebase Admin SDK
- Firebase Admin SDK initialization module (`src/lib/firebase-admin.ts`)
- Modify `Hero.tsx` — replace simulated submission with real fetch + redirect
- Document ID = user email (for direct reads, upserts, and automatic deduplication)
- Server-side validation (name, email format, duplicate check)
- `lastEmailSent` as nullable Timestamp (fix current schema issue)
- `.env.local` credentials setup

### Out of Scope
- Email confirmation or verification flow
- Scheduled newsletter delivery
- Unsubscribe endpoint or logic
- Admin panel or subscriber management UI
- Rate limiting (will add later if needed)
- Browser/country metadata detection (simple, add as bonus)

## Capabilities

### New Capabilities
- `subscription-api`: Server-side API route for newsletter subscription

### Modified Capabilities
- None

## Approach

1. Create `src/lib/firebase-admin.ts` — singleton Firebase Admin app initialized from env vars
2. Create `src/app/api/subscribe/route.ts` — POST handler:
   - Validate name + email
   - Check if document with same email ID already exists → 409
   - Create document with email as ID in `subscribers` collection
   - Return 201 with redirect URL
3. Modify `Hero.tsx` — replace mock await with `fetch("/api/subscribe", { method: "POST", body: JSON.stringify(...) })`, handle 201 → redirect to `/subscribe`, handle 409/errors → show inline error
4. Add `FIREBASE_*` env vars to `.env.local`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/api/subscribe/route.ts` | New | POST handler for subscription |
| `src/lib/firebase-admin.ts` | New | Firebase Admin SDK singleton |
| `src/components/landing/Hero.tsx` | Modify | Replace mock with real API call + redirect |
| `.env.local` | Modify | Firebase credentials |
| `openspec/specs/subscription-api/spec.md` | New | Spec for the new capability |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Firebase credentials exposed in client bundle | Low | Admin SDK only used in API routes (server-only) |
| Email as doc ID has length limits (max 1500 bytes) | Low | Emails are well under limit |
| Duplicate submissions cause 409 errors | Medium | Show user-friendly message "Ya estás registrado" |
| Firestore rate limits (1 write/sec per doc) | Low | Per-email writes are infrequent |

## Rollback Plan

1. Remove `src/app/api/subscribe/` directory
2. Remove `src/lib/firebase-admin.ts`
3. Revert `Hero.tsx` to simulated submission
4. Remove env vars from `.env.local`
5. No data loss — subscribers remain in Firestore

## Dependencies

- Firebase Admin SDK (`firebase-admin` npm package)
- Firebase service account key or Google Cloud credentials
- Existing `subscribers` Firestore collection

## Success Criteria

- [ ] `POST /api/subscribe` with valid name+email returns 201 and creates document in Firestore
- [ ] Document ID equals the submitted email
- [ ] Duplicate email returns 409 with clear message
- [ ] Invalid input returns 400 with validation error
- [ ] Hero form redirects to `/subscribe` on success
- [ ] Hero form shows inline error on failure
- [ ] Build passes with zero errors
