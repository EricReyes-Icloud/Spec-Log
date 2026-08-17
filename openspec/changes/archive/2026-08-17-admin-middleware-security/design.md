# Design: Admin Middleware Security (real auth + env allowlist)

## Technical Approach

Replace the cookie-presence `src/proxy.ts` with real authentication + authorization: `verifySessionCookie(cookie, true)` (revocation checked) via a dynamic ESM import of `firebase-admin/auth`, then authorization by `decodedToken.email === process.env.ADMIN_EMAIL` (Option B, no custom claims). Harden the login page (single generic error via a pure mapper), the session route (Origin check + per-IP in-memory rate limit), and remove the dead `onAuthStateChanged` listener. Covers `admin-auth` (Middleware Route Protection, Authorization Allowlist, Login Authentication, Session Persistence, Session Route Hardening) and `admin-newsletters-placeholder` (Inherited Route Protection, No Client-Side Auth Listener). Mirrors the send-route dynamic-import pattern and the `firebase-admin.ts` `initApp()` singleton.

## Data Flow

```
Request → config.matcher "/admin/:path*"  (also matches "/admin" index)
   ├─ pathname starts with "/admin/login" ──→ NextResponse.next()   [bypass]
   └─ else → requireAuth(request)
        ├─ no "session" cookie │ verifySessionCookie rejects (invalid/expired/revoked)
        │    → 302 /admin/login  +  Set-Cookie: session=; Max-Age=0   (clear)
        └─ verified → requireAdmin(decodedToken)
             ├─ token.email === process.env.ADMIN_EMAIL (case-sensitive) → next()
             ├─ mismatch ───────────────────────────────────────────────→ 403
             └─ ADMIN_EMAIL unset ──────────────────────────────────────→ 403  (fail-closed)

Login flow: form → signInWithEmailAndPassword → POST /api/auth/session
   → isSameOrigin (403) → rate limit (429) → createSessionCookie → Set-Cookie → 200
   → router.push("/admin/newsletters");  ANY failure → mapLoginError → generic message
```

## Architecture Decisions

| # | Decision | Options | Choice | Rationale |
|---|----------|---------|--------|-----------|
| 1 | Authorization source | Custom claims vs env allowlist | **Env allowlist** (today) | Single admin; zero Admin-SDK role infra; unset env fails closed. Claims (`decodedToken.admin`) = documented follow-up if multiple roles appear (proposal Follow-ups) |
| 2 | File structure | Two middleware files vs single proxy | **Single `src/proxy.ts`**, internal `requireAuth`/`requireAdmin` | Next.js permits exactly one proxy/middleware file; internal split keeps one exported `proxy` + one `config` |
| 3 | firebase-admin loading | Top-level vs per-request import | **Dynamic `await import("firebase-admin/auth")`**, cached at module level | Matches send-route ESM pattern (proposal approach); `runtime: "nodejs"` + `serverExternalPackages` already set. An in-function `await import` re-runs per request — cache the promise: `cachedAuth ??= import(...)` so `verifySessionCookie` reuse is cheap per instance |
| 4 | App initialization in proxy | `getAuth()` bare (send-route) vs `getAuth(initApp())` (session-route) | **`getAuth(initApp())`** | Send-route omits `initApp` — cold instances throw "default app does not exist" (latent bug, out of scope; shared auth helper already a follow-up). Proxy uses the correct session-route pattern |
| 5 | Env unset behavior | Open vs fail-closed | **Fail-closed 403** | Missing config must deny, never panic-open; the pre-deploy `ADMIN_EMAIL` step makes it an explicit wall (proposal MUST-complete) |
| 6 | Response statuses | 302 vs 403 | AuthN failure → **302 /admin/login** (cookie cleared); AuthZ failure → **403** | 302 only for "not logged in" (retryable); 403 for "logged in but not allowlisted" — redirecting would loop against `/admin/login` and blur authN/authZ |
| 7 | Rate limiter location | Shared module vs co-located helper | **Co-located** in session `route.ts`, exported factory | Shared module is a proposal follow-up; keep this change scoped. Exported pure factory stays unit-testable and route-independent |
| 8 | Login error surfacing | Per-code messages vs single generic | **ONE generic constant** via pure mapper | Anti-enumeration: every Firebase code, network error, and session-route error → identical string; unit-tested to never leak `auth/*` codes (admin-auth Login Authentication) |

## Interfaces / Contracts

```ts
// src/lib/firebase-errors.ts — pure, no imports
export const GENERIC_LOGIN_ERROR = "Credenciales inválidas.";
export function mapLoginError(err: unknown): string;
// Every input (known code | unknown Error | network | session-route {error}) → GENERIC_LOGIN_ERROR.
// Never returns err.code / err.message / raw body text.

// src/proxy.ts
export function proxy(request: NextRequest): Promise<NextResponse | Response>;
export const config = { matcher: "/admin/:path*", runtime: "nodejs" };
async function requireAuth(request: NextRequest): Promise<DecodedIdToken | null>;
//   no cookie → 302 /admin/login (+ cleared cookie); verify throws → same; success → token
function requireAdmin(token: DecodedIdToken): boolean; // token.email === process.env.ADMIN_EMAIL
let cachedAuthPromise: Promise<Auth> | null = null;    // ??= per instance

// src/app/api/auth/session/route.ts — co-located, exported for unit tests
export function isSameOrigin(request: Request): boolean;
//   host(Origin|Referer URL).toLowerCase() === request.headers.get("host").toLowerCase();
//   neither header present → false (fail-closed, 403). Dev: localhost:3000 matches itself.
export function createRateLimiter(limit: number, windowMs: number): RateLimiter;
//   { allow(ip): boolean } — Map<ip, {count, resetAt}>, fixed window;
//   stale entry resets on access; prune() evicts expired entries and runs a
//   size sweep (cap ~1000) so the map cannot grow unbounded.
//   Per serverless instance only — resets on restart (documented limitation, proposal Risks).
```

Module-level rate limiter instance in the route: `const limiter = createRateLimiter(5, 30_000);` — IP from `x-forwarded-for` first value (Vercel), fallback `"unknown"`. POST order: body parse → Origin gate (403 `{ error: "Origen no permitido" }`) → rate gate (429 `{ error: "Demasiados intentos" }`) → `createSessionCookie` → Set-Cookie.

Proxy 403 body: plain `new Response("Forbidden", { status: 403 })` — browser navigation, non-sensitive.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/proxy.ts` | Modify | Rewrite: `runtime: "nodejs"` in config, login bypass, `requireAuth` (verify via cached dynamic import + `initApp()`, 302 + cookie clear on failure), `requireAdmin` (email allowlist → 403) |
| `src/lib/firebase-errors.ts` | Create | `GENERIC_LOGIN_ERROR` constant + pure `mapLoginError(err)` |
| `src/app/admin/login/page.tsx` | Modify | Catch block: `error: mapLoginError(err)`; button re-enable preserved; redirect only on success |
| `src/app/api/auth/session/route.ts` | Modify | POST: `isSameOrigin` gate → rate-limit gate → cookie creation; export `isSameOrigin`, `createRateLimiter` |
| `src/app/admin/newsletters/page.tsx` | Modify | Remove `useEffect`, `onAuthStateChanged` import, and the stale security comment; keep `handleLogout` (signOut + DELETE session) |
| `src/lib/__tests__/firebase-errors.test.ts` | Create | RED: mapping table + no-code-leak assertions |
| `src/app/api/auth/session/__tests__/guards.test.ts` | Create | RED: `isSameOrigin` + `createRateLimiter` units |
| `src/__tests__/proxy.test.ts` | Create | RED: proxy behavior with `vi.mock`'d firebase-admin/auth + initApp and NextRequest/NextResponse stubs |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `mapLoginError` — every code (`auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password`, `auth/too-many-requests`, `auth/user-disabled`, `auth/network-request-failed`, `auth/invalid-email`, `auth/invalid-login-credentials`), unknown `Error`, session-route body | Assert result `=== GENERIC_LOGIN_ERROR`; never contains `"auth/"`; never echoes raw input. Mirrors existing `subscribe` route test style (pure, no mocks) |
| Unit | `createRateLimiter` — 5 allowed, 6th denied, window expiry resets, expired-entry eviction, size sweep | Fixed-window math; inject timestamps or vi.useFakeTimers |
| Unit | `isSameOrigin` — matching host passes; foreign Origin rejected; Referer fallback; missing headers rejected; host compare | `Request` stubs |
| Integration | `proxy` — no cookie → 302 + cookie cleared; `verifySessionCookie` rejects → 302; email mismatch → 403; env unset → 403; match → `next()`; `/admin/login` → `next()`; `/admin` index protected | `vi.mock("firebase-admin/auth")`, `vi.mock("@/lib/firebase-admin")`; NextRequest stub `{ cookies, nextUrl, url }` per existing `vi.hoisted` pattern |
| Build | Compilation + full suite | `npx vitest run` green; `next build` passes (proxy nodejs runtime) |

## Threat Matrix

`N/A` — this change touches HTTP request routing (proxy matcher) only. No shell command, subprocess, git/VCS or PR automation, executable-file classification, or process-integration boundary exists in scope. All matrix rows (documentation-like paths, git repo selection, commit state, push state, PR commands) are `N/A`; no RED tests required for them.

## Migration / Rollout

No data migration. Deploy gate (MUST, from proposal): `ADMIN_EMAIL` in `.env.local` + Vercel project env vars, value copied exactly (case-sensitive) from Firebase Console → Authentication → Users. Without it every `/admin/*` returns 403 after deploy — deliberate fail-closed. Rollback: `git revert` proxy.ts (single file) restores cookie-presence behavior; session-route hardening reverts independently; env change trivially revertible.

## Open Questions

- [ ] None blocking. Exact generic copy is a one-line constant (`GENERIC_LOGIN_ERROR`), trivially adjustable at apply time.