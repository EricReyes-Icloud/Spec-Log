# Tasks: Admin Middleware Security

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 400–430 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (firebase-errors) → PR 2 (proxy + session + login + newsletters) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Pure error mapper + tests | PR 1 (~77 lines) | `npx vitest run src/lib/__tests__/firebase-errors.test.ts` | N/A — pure function, no runtime scenario | `src/lib/firebase-errors.ts` + `src/lib/__tests__/firebase-errors.test.ts` only |
| 2 | Proxy auth rewrite, session hardening, login wiring, newsletters cleanup + all tests | PR 2 (~351 lines) | `npx vitest run` (full suite) | `next build` passes; manual: `/admin/*` unauthenticated → 302; `/admin/login` bypasses; email mismatch → 403 | `src/proxy.ts`, `src/app/api/auth/session/route.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/newsletters/page.tsx` + their tests — revertible independently from Unit 1 |

## Phase 1: Foundation — Error Mapper (TDD)

- [x] 1.1 **RED** Create `src/lib/__tests__/firebase-errors.test.ts`: assert `mapLoginError` returns `GENERIC_LOGIN_ERROR` for every known code (`auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password`, `auth/too-many-requests`, `auth/user-disabled`, `auth/network-request-failed`, `auth/invalid-email`, `auth/invalid-login-credentials`), unknown `Error`, network error, and session-route `{error}` body. Assert output never contains `"auth/"`.
- [x] 1.2 **GREEN** Create `src/lib/firebase-errors.ts`: export `GENERIC_LOGIN_ERROR = "Credenciales inválidas."` and pure `mapLoginError(err: unknown): string` that maps all inputs to the constant. Run `npx vitest run src/lib/__tests__/firebase-errors.test.ts` — all pass.

## Phase 2: Core — Proxy Rewrite (TDD)

- [x] 2.1 **RED** Create `src/__tests__/proxy.test.ts`: mock `firebase-admin/auth` (`verifySessionCookie`) and `@/lib/firebase-admin` (`initApp`). Stub `NextRequest` with cookies/nextUrl/url. Assert: no cookie → 302 + cookie cleared; `verifySessionCookie` rejects → 302; email mismatch → 403; `ADMIN_EMAIL` unset → 403; match → `next()`; `/admin/login` bypasses auth.
- [x] 2.2 **GREEN** Rewrite `src/proxy.ts`: `/admin/login` bypass, `requireAuth` (cached dynamic `await import("firebase-admin/auth")` + `getAuth(initApp())` + `verifySessionCookie(cookie, true)`, 302 + `Set-Cookie: session=; Max-Age=0` on failure), `requireAdmin` (`decodedToken.email === process.env.ADMIN_EMAIL`, 403 on mismatch or unset). 403 body: `new Response("Forbidden", { status: 403 })`. **Deviation (verified by build)**: `runtime: "nodejs"` NOT set — Next 16.2.6 rejects route segment config in Proxy files (`Route segment config is not allowed in Proxy file`); Proxy always runs on Node.js. Fix committed in `df3cdf1`.

## Phase 3: Integration — Session Hardening, Login, Newsletters

- [x] 3.1 **RED** Create `src/app/api/auth/session/__tests__/guards.test.ts`: assert `isSameOrigin` — matching host passes, foreign Origin rejected, Referer fallback, missing headers → false. Assert `createRateLimiter(5, 30_000)` — 5 allowed, 6th denied, window reset, size sweep.
- [x] 3.2 **GREEN** Modify `src/app/api/auth/session/route.ts`: add exported `isSameOrigin(request: Request)` and exported `createRateLimiter(limit, windowMs)` co-located. POST order: body parse → `isSameOrigin` gate (403 `{ error: "Origen no permitido" }`) → rate gate (429 `{ error: "Demasiados intentos" }`) → `createSessionCookie` → Set-Cookie. Module-level `const limiter = createRateLimiter(5, 30_000)`. IP from `x-forwarded-for` first value, fallback `"unknown"`.
- [x] 3.3 Modify `src/app/admin/login/page.tsx`: import `mapLoginError` from `@/lib/firebase-errors`, replace catch-block message assignment with `mapLoginError(err)`. Keep button re-enable and redirect-on-success logic.
- [x] 3.4 Modify `src/app/admin/newsletters/page.tsx`: remove `useEffect`, `onAuthStateChanged` import (keep `signOut` import), remove the stale security comment. Keep `handleLogout` intact.

## Phase 4: Verification

- [x] 4.1 Run `npx vitest run` — all tests green: **7 files passed / 1 failed (pre-existing `welcome-email.test.tsx` template drift, out of scope, identical to baseline)**; 44 passed / 1 failed.
- [x] 4.2 Run `next build` — **PASS** (Next.js 16.2.6, Turbopack); Proxy detected as `ƒ Proxy (Middleware)` on Node.js runtime.
