# PR-12: Proxy Auth Rewrite and Session Hardening

## Description

The proxy previously only checked whether a session cookie existed — any cookie, regardless of validity, granted access to `/admin/*` routes. The session route accepted POSTs from any origin with no rate limiting, leaving it open to CSRF and brute-force attacks. The newsletters page registered a dead `onAuthStateChanged` listener that did nothing but consume a Firebase SDK subscription.

This PR replaces cookie-presence checks with real Firebase session verification (`verifySessionCookie(cookie, true)` with revocation), adds an email allowlist so only a specific admin can access protected routes, hardens the session route with origin validation and per-IP rate limiting, and removes the dead auth listener.

## Changes Made

**Proxy auth rewrite**
- `src/proxy.ts` — replaced cookie-presence check with `requireAuth()` (cached dynamic `await import("firebase-admin/auth")` + `getAuth(initApp())` + `verifySessionCookie(cookie, true)`); added `requireAdmin()` comparing `decodedToken.email` against `process.env.ADMIN_EMAIL` (case-sensitive, fail-closed on unset); missing/invalid/revoked cookie returns 302 + clears `Set-Cookie`; email mismatch returns 403 with `"Forbidden"` body; `/admin/login` bypass preserved

**Session route hardening**
- `src/app/api/auth/session/route.ts` — added `isSameOrigin(request)` (Origin header host must match Host header; falls back to Referer; missing both fails closed with 403); added `createRateLimiter(limit, windowMs)` fixed-window in-memory rate limiter keyed by client IP from `x-forwarded-for` first value (5 requests per 30s window, map capped at ~1000 entries); POST now enforces: body parse, origin gate (403), rate gate (429), then cookie creation

**Newsletters page cleanup**
- `src/app/admin/newsletters/page.tsx` — removed `useEffect` and `onAuthStateChanged` import (kept `signOut` import); removed stale security comment; `handleLogout` unchanged

**Tests**
- `src/__tests__/proxy.test.ts` — 7 tests: no cookie clears session and redirects, invalid cookie redirects, passes cookie to `verifySessionCookie` with revocation flag, email mismatch returns 403, unset `ADMIN_EMAIL` returns 403 (fail-closed), matching admin passes through, `/admin/login` bypasses auth
- `src/app/api/auth/session/__tests__/guards.test.ts` — 9 tests: `isSameOrigin` matching/referer fallback/foreign/missing headers; `createRateLimiter` burst limit, per-IP budget, window reset, size sweep

## Impact

Unauthenticated requests to `/admin/*` are now rejected after real Firebase session verification, not just cookie-presence. Only the email in `ADMIN_EMAIL` can access protected routes — a second admin account is denied with 403. The session route is protected against CSRF (origin check) and abuse (per-IP rate limiting). Dead client-side auth listener removed.

**Documented deviation**: `runtime: "nodejs"` is NOT set in proxy config. Next.js 16.2.6 rejects `runtime` option in Proxy files (`Route segment config is not allowed in Proxy file`). The Proxy always runs on Node.js by default. The firebase-admin dynamic import resolves against the Node runtime. Fixed in commit `df3cdf1`.

## Notes

- Test command: `npx vitest run src/__tests__/proxy.test.ts src/app/api/auth/session/__tests__/guards.test.ts`
- Full suite: `npx vitest run` — 44 passed / 1 failed (pre-existing `welcome-email.test.tsx` template drift, out of scope)
- Build: `npx next build` passes; Proxy detected as `ƒ Proxy (Middleware)` on Node.js runtime
- This PR is slice 2 of a chained feature-branch chain targeting PR-11 (`feat/middleware-security-1-firebase-errors`)
- `ADMIN_EMAIL` env var is required at deploy time; unset value causes all admin requests to return 403 (fail-closed by design)
