# Tasks: Subscribe to Firestore

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~70–90 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Add `firebase-admin` dependency to `package.json`
- [x] 1.2 Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` to `.env.local`
- [x] 1.3 Create `src/lib/firebase-admin.ts` — singleton Firebase Admin init from env vars with `admin.apps.find()` guard

## Phase 2: Core — API Route

- [x] 2.1 Create `src/app/api/subscribe/route.ts` — POST handler with name+email validation (name ≥ 2 chars, email regex)
- [x] 2.2 Add duplicate check: `getDoc()` on `subscribers/{email}` — return 409 if exists
- [x] 2.3 Create Firestore document via `setDoc()` with fields: `name`, `email`, `createdAt` (server Timestamp), `lastEmailSent` (null)
- [x] 2.4 Return 201 with `{ "redirectUrl": "/subscribe" }` on success, 400/409/500 with `{ "error": string }` on failure

## Phase 3: Integration — Hero Form

- [x] 3.1 Replace simulated `await new Promise(...)` in `Hero.tsx` with `fetch("POST /api/subscribe", { name, email })`
- [x] 3.2 Handle 201 response: redirect to `/subscribe` via `window.location.href` or Next.js `router.push`
- [x] 3.3 Handle 4xx/5xx: display inline error message below form, re-enable submit button

## Phase 4: Verification

- [x] 4.1 Run `next build` — verify zero TypeScript and lint errors
- [x] 4.2 Manual `curl` test: valid input → 201 + doc in Firestore; duplicate → 409; bad input → 400
