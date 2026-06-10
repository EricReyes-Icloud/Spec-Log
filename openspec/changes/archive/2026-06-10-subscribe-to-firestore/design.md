# Design: Subscribe to Firestore

## Technical Approach

REST API route (`POST /api/subscribe`) using Firebase Admin SDK to persist subscriber documents in Firestore with full engagement tracking schema (status, source, metadata, tokens). The Hero form submits the email via `fetch`; on 201 it redirects to `/subscribe`, on error it shows inline feedback.

## Architecture Decisions

| Decision | Alternatives | Rationale |
|----------|-------------|-----------|
| **API Route** (not Server Action) | Server Action | RESTful, testable via curl/Postman, works cleanly with React Compiler, no client bundle exposure |
| **Singleton Firebase Admin** | Re-init per request | Global `admin.apps.find()` guard prevents duplicate instances in dev hot-reload; standard pattern |
| **Email as document ID** | Auto-generated UUID | Enables direct reads by email, natural dedup via `getDoc()` check, simpler security rules — max 1500-byte limit is safe for emails |
| **get-then-create** (not upsert) | `setDoc({merge:false})` | Explicit duplicate check returns 409 instead of silent overwrite; race window is acceptable for infrequent signups |
| **Inline errors** (not toast/redirect) | Toast notification | Matches current form UX pattern (inline `hero-error`), zero new dependencies |
| **Full engagement schema** | Minimal fields | 9 fields covering status, source, metadata, email tracking, and unsubscribe — prevents future migrations |
| **Metadata from request headers** | Client-reported values | Parses `User-Agent` for browser, `x-vercel-ip-country` for country — server-authoritative, no extra deps |
| **Unsubscribe token via crypto** | UUID or nanoid | `crypto.randomUUID()` sliced to 8 uppercase chars — no extra dependency, deterministic length |

## Data Flow

```
┌─────────┐     POST /api/subscribe     ┌──────────────────┐
│  Hero   │  { name, email }            │  API Route       │
│  Form   │ ──────────────────────────► │  subscribe/      │
│  (client)│                            │  route.ts        │
│         │ ◄────────────────────────── │     │            │
└─────────┘     201 { redirectUrl }     │     ▼            │
     │              or 4xx/5xx { error } │  ┌──────────┐   │
     │                                  │  │ Validate  │   │
     │  redirect to /subscribe          │  └────┬─────┘   │
     │  ◄─── on 201 ──────────────────  │       ▼         │
     │                                  │  ┌──────────┐   │
     │  show inline error               │  │ getDoc()  │   │
     │  ◄─── on error ────────────────  │  │ (dup chk) │   │
     │                                  │  └────┬─────┘   │
     │                                  │       ▼         │
     │                                  │  ┌──────────┐   │
     │                                  │  │ setDoc()  │   │
     │                                  │  └──────────┘   │
     │                                  └──────────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │  Firestore    │
                                            │  subscribers/ │
                                            │  {email}      │
                                            └──────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/firebase-admin.ts` | Create | Singleton Firebase Admin init from env vars |
| `src/app/api/subscribe/route.ts` | Create | POST handler: validate → check dup → create doc → respond |
| `src/components/landing/Hero.tsx` | Modify | Replace mock await with `fetch()` call; 201→redirect, error→inline |
| `package.json` | Modify | Add `firebase-admin` dependency |
| `.env.local` | Modify | Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` |

## Interfaces / Contracts

```typescript
// POST /api/subscribe
// Content-Type: application/json

// Request body
{ "name": string, "email": string }

// 201 Created
{ "redirectUrl": "/subscribe" }

// 400 Bad Request
{ "error": string }

// 409 Conflict
{ "error": string, "code": "DUPLICATE_EMAIL" }

// 500 Internal Server Error
{ "error": string }
```

**Subscriber document** in `subscribers/{email}`:
```typescript
interface Subscriber {
  name: string;
  email: string;
  status: "active" | "unsubscribed";
  source: "landing-page";
  createdAt: admin.firestore.Timestamp;
  confirmedAt: admin.firestore.Timestamp | null;
  lastEmailSent: admin.firestore.Timestamp | null;
  metadata: {
    browser: string;      // parsed from User-Agent
    country: string;      // from x-vercel-ip-country or "unknown"
  };
  totalEmailsSent: number;
  unsubscribeToken: string; // 8-char uppercase, generated via crypto
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Integration | API route (validation, dup, create, error) | Manual with `curl` — no test runner in project (`testing.strict_tdd: false`) |
| E2E | Full form → API → redirect flow | Manual — fill form, submit, verify redirect + Firestore doc |
| Build | TypeScript + lint | `next build` must pass with zero errors per success criteria |

## Migration / Rollout

No migration required. The existing stub service is untouched. New subscribers flow through the new API route; old stub remains as fallback reference.

## Open Questions

None.
