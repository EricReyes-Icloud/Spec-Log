# Proposal: Admin Middleware Security

## Intent

Admin routes are unprotected server-side today: `src/proxy.ts` treats ANY cookie as authentication, so `/admin/*` is effectively public. The login page leaks Firebase error codes (email enumeration), the session route has no CSRF or rate limiting, and dead client code gives false security confidence. This change makes server-side authentication real and authorizes access via an env allowlist (`ADMIN_EMAIL` email compare) — no custom claims.

## Scope

### In Scope
- Rewrite `src/proxy.ts` (Next.js 16 proxy file — do NOT create middleware.ts) with real auth + env-allowlist authorization
- Login error mapping to a single generic message (no raw `err.message`)
- Session route: Origin CSRF check + basic in-memory rate limiting
- Remove dead `onAuthStateChanged` effect + fake comment in newsletters page
- Document `ADMIN_EMAIL` env var setup (mandatory before deploy); value must exactly match the Firebase Auth login email (case-sensitive)

### Out of Scope
- `/api/newsletter/send` and `/api/subscribe` (keep inline verification)
- Cookie property changes (already correct: httpOnly, secure, sameSite strict)
- Two-middleware split (Next.js allows only one — use internal requireAuth/requireAdmin in the single proxy file)

## Capabilities

### New Capabilities
- None — hardening lands inside existing capabilities

### Modified Capabilities
- `admin-auth`: middleware route protection changes from cookie-presence to `verifySessionCookie(cookie, true)` + authorization by `decodedToken.email === process.env.ADMIN_EMAIL`; login MUST show one generic error for all Firebase codes; session route adds Origin check + rate limit; session-persistence requirement (onAuthStateChanged listener) must be reconciled with listener removal.
- `admin-newsletters-placeholder`: inherited route protection now also requires the email allowlist match (mismatch → 403); dead effect removal.

## Approach

Single `src/proxy.ts`: `export function proxy` + `config.matcher = "/admin/:path*"` with `/admin/login` bypass and `runtime = "nodejs"`. Internal `requireAuth` (verifySessionCookie via dynamic `await import("firebase-admin/auth")`, matching the send-route ESM pattern) and `requireAdmin` (`decodedToken.email === process.env.ADMIN_EMAIL`). Unauthenticated → 302 to `/admin/login`; authenticated whose email doesn't match the env value (or env unset) → 403. Login page maps every Firebase error to one generic Spanish message. Session route compares Origin to host and throttles POSTs per IP with an in-memory map.

## Pre-Deployment Requirement (MUST complete BEFORE deploy)

No claims, no Admin SDK script — authorization reads a single env var:

1. Add `ADMIN_EMAIL=tucorreo@dominio.com` to `.env.local` AND to the Vercel project env vars.
2. The value MUST be the exact Firebase Auth login email of the admin user — case-sensitive; copy it from Firebase Console → Authentication → Users.
3. Verify by logging in as that user and reaching `/admin/newsletters`.

Without `ADMIN_EMAIL`, every `/admin/*` route returns 403 after deploy.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/proxy.ts` | Modified | Real auth + `ADMIN_EMAIL` allowlist authorization |
| `src/app/admin/login/page.tsx` | Modified | Generic error mapping |
| `src/app/api/auth/session/route.ts` | Modified | Origin check + rate limit |
| `src/app/admin/newsletters/page.tsx` | Modified | Dead effect/comment removed |
| `openspec/specs/` (admin-auth, admin-newsletters-placeholder) | Modified | Delta specs |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `ADMIN_EMAIL` missing or mismatched (case/typo) → all admin routes 403 | Med | MUST-complete pre-deploy doc; copy exact email from Console |
| Email as identity: fine for a single admin today | Low | Follow-up: migrate to custom claims if multiple admin roles appear |
| firebase-admin ESM in proxy runtime | Low | Dynamic import + nodejs runtime; serverExternalPackages already set |
| In-memory rate limiter resets on restart | Med | Acceptable for single admin; basic by design (follow-up) |
| Strict Origin check breaks dev/non-browser clients | Low | Host/allow-list comparison documented |

## Rollback Plan

- `src/proxy.ts`: `git revert` the commit — prior cookie-presence version restores immediately (single file).
- Session route: revert per-route (drop Origin check + limiter) independently.
- Login mapping / page cleanup: cosmetic, trivially revertible.
- Env change: trivially revertible (remove or fix `ADMIN_EMAIL`; no data migration).

## Dependencies

- Firebase Admin credentials (env already present) — used for session cookie verification
- `ADMIN_EMAIL` env var set in `.env.local` + Vercel project env vars before deploy (see above)

## Success Criteria

- [ ] `/admin/*` without session → 302 `/admin/login`
- [ ] Valid session whose token email `!== ADMIN_EMAIL` → 403; equal → passes through
- [ ] Login never renders Firebase error codes (unit tested)
- [ ] Session POST from foreign Origin rejected; burst throttled
- [ ] Newsletters page: no listener, no fake comment
- [ ] `npx vitest run` green; `next build` passes

## Follow-ups (documented, not in scope)

- Failed-attempt logging
- `/api/newsletter/send` shared auth helper
- `test` script in package.json
- Shared rate-limiter module
- Migrate authorization to Firebase custom claims (`decodedToken.admin`) if multiple admin roles appear