# Design: Admin Authentication System

## Technical Approach

Implement Firebase Auth email/password login with server-side session cookies and Next.js middleware for `/admin/*` route protection. The flow: Firebase client SDK in the browser authenticates credentials, obtains an ID token, exchanges it for a server session cookie via API route, then middleware validates cookie presence on subsequent requests. Follows existing project patterns: singleton firebase-client.ts mirrors firebase-admin.ts, co-located CSS mirrors hero.css, API route mirrors subscribe/route.ts.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|----------|---------|--------|-----------|
| Client init | Singleton vs inline `getAuth()` | Singleton | Matches existing `firebase-admin.ts` pattern; ensures single app instance in browser |
| Session storage | httpOnly cookie vs localStorage | httpOnly cookie | Middleware can check it server-side; immune to XSS token theft; standard Firebase pattern |
| Middleware validation | Verify session cookie vs check existence | Cookie existence check | Firebase Admin SDK verifySessionCookie requires Node.js APIs unavailable in Edge Runtime; existence check is pragmatic — API routes do full validation |
| Cookie API route | Dedicated `/api/auth/session` vs inline in page | Dedicated route | Keeps session logic testable; follows existing `/api/subscribe` pattern |
| CSS strategy | Co-located CSS module vs shared stylesheet | Shared stylesheet (`admin-login.css`) | Matches existing pattern (hero.css, post-registro.css); Tailwind v4 `@reference` for theme tokens |
| Color tokens | Template exact colors vs existing brand vars | Template colors | Spec requires #FF6B35 and #1a1a1a per Template_email_instructions.md; add new CSS variables to globals.css |

## Data Flow

```
Browser                          Server
  │                                │
  ├─ GET /admin/newsletters ──────┤
  │                                ├─ middleware: no session cookie
  │                                ├─ 302 → /admin/login
  ├─ ← redirect ──────────────────┤
  │                                │
  ├─ GET /admin/login ────────────┤
  │                                ├─ middleware: bypass
  │                                ├─ renders login form
  │                                │
  ├─ POST email+password ────────┤
  │  (Firebase Auth client SDK)    │
  ├─ ← ID token ─────────────────┤
  │                                │
  ├─ POST /api/auth/session ─────┤
  │  { idToken }                  │
  │                                ├─ Admin SDK verifyIdToken
  │                                ├─ Admin SDK createSessionCookie
  │                                ├─ Set-Cookie: session=<cookie>
  │                                ├─ 200 { success: true }
  ├─ ← cookie set ───────────────┤
  ├─ redirect /admin/newsletters ─┤
  │                                │
  ├─ GET /admin/newsletters ──────┤
  │  Cookie: session=<cookie>      │
  │                                ├─ middleware: cookie exists → pass
  │                                ├─ renders placeholder page
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/firebase-client.ts` | Create | Singleton Firebase client SDK using `NEXT_PUBLIC_` env vars; exports `auth` instance |
| `src/app/admin/login/page.tsx` | Create | Client component with email/password form; uses `signInWithEmailAndPassword`, then POSTs ID token to `/api/auth/session` |
| `src/styles/admin-login.css` | Create | CSS for login page matching template colors (black carbon bg, orange title/button, transparent card, gray inputs) |
| `src/app/admin/newsletters/page.tsx` | Create | Placeholder page with confirmation text and top-right orange logout button |
| `src/middleware.ts` | Create | Edge middleware: checks for `session` cookie on `/admin/*` routes; allows `/admin/login` bypass |
| `src/app/api/auth/session/route.ts` | Create | POST: exchanges ID token for session cookie via Admin SDK; DELETE: clears session cookie |
| `src/styles/globals.css` | Modify | Add `--color-admin-orange` (#FF6B35) and `--color-admin-carbon` (#1a1a1a) for admin pages |
| `.env.local` | Modify | Add `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `package.json` | Modify | Add `firebase` client SDK dependency |

## Key Interfaces

```typescript
// src/lib/firebase-client.ts — singleton pattern
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
function getAuth(): Auth { ... }

// src/middleware.ts — route protection
export function middleware(request: NextRequest): NextResponse<unknown> {
  const sessionCookie = request.cookies.get("session");
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

// POST /api/auth/session — request/response
{ idToken: string }
→ { success: true } | { error: string }
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | Login flow | Start dev server, navigate to `/admin/login`, authenticate with Console-created user, verify redirect, verify middleware protects routes, verify logout clears session |
| Manual | Edge cases | Network failure during login, invalid credentials, expired session, direct URL access without auth |
| Build | Compilation | `next build` must succeed with all new files |

No test runner configured; manual testing only per `openspec/config.yaml`.

## Migration / Rollout

No migration required. Create admin user via Firebase Console → Authentication → Add user before testing. No existing data or routes affected.

## Open Questions

- [ ] Add `firebase` (client SDK) to `package.json` — version should match `firebase-admin` era or latest compatible
