# Tasks: Admin Authentication System

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~291 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Add `firebase` client SDK to `package.json` dependencies
- [x] 1.2 Add `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` to `.env.local`
- [x] 1.3 Add `--color-admin-orange` (#FF6B35) and `--color-admin-carbon` (#1a1a1a) to `src/styles/globals.css` theme block
- [x] 1.4 Create `src/lib/firebase-client.ts` — singleton Firebase client SDK exporting `auth` instance (mirrors `firebase-admin.ts` pattern)

## Phase 2: Auth Implementation

- [x] 2.1 Create `src/app/api/auth/session/route.ts` — POST exchanges ID token for session cookie via Admin SDK `createSessionCookie`; DELETE clears session cookie
- [x] 2.2 Create `src/middleware.ts` — Edge middleware: checks `session` cookie on `/admin/*`, bypasses `/admin/login`, redirects to `/admin/login` on missing cookie
- [x] 2.3 Create `src/styles/admin-login.css` — login page styles: carbon black bg, orange title/button, transparent card, gray inputs (per Template_email_instructions.md)
- [x] 2.4 Create `src/app/admin/login/page.tsx` — client component: `signInWithEmailAndPassword`, POST ID token to session API, redirect to `/admin/newsletters` on success, inline error on failure

## Phase 3: Admin UI

- [x] 3.1 Create `src/app/admin/newsletters/page.tsx` — placeholder page: confirmation heading, descriptive paragraph, top-right orange logout button that calls `signOut` + DELETE session API + redirect to `/admin/login`

## Phase 4: Verification

- [x] 4.1 Manual test: start dev server, navigate to `/admin/newsletters` → verify redirect to `/admin/login`
- [x] 4.2 Manual test: login with Console-created admin user → verify redirect to `/admin/newsletters` with placeholder content
- [x] 4.3 Manual test: click logout → verify session cleared and redirect to `/admin/login`
- [x] 4.4 Manual test: access `/admin/newsletters` post-logout → verify middleware redirect back to login
- [x] 4.5 Build: run `next build` and verify compilation succeeds with no errors
