# Design: Welcome Email

## Technical Approach

Add a welcome email that sends synchronously after Firestore document creation in `POST /api/subscribe`. The email renders via static JSX (`WelcomeEmail` component, no markdown pipeline) through `@react-email/render` and sends via Resend SDK. Failure is caught and logged — never blocks the 201 response.

Based on delta specs: `welcome-email/spec.md`, `email-service/spec.md`, `subscription-api/spec.md`.

## Architecture Decisions

### Decision: Static JSX over markdown pipeline

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Static JSX** | Fixed content, no `dangerouslySetInnerHTML`, simpler render | ✓ **Chosen** |
| Markdown pipeline (`unified`+`rehype`) | Flexible content | Rejected: content is static |

**Rationale**: Welcome email has fixed content — no dynamic markdown. Static JSX eliminates `dangerouslySetInnerHTML` and the entire unified/rehype chain. Simpler, safer, faster render.

### Decision: Synchronous send in request lifecycle

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Try/catch in route handler** | ~200–500ms added to response, no infra | ✓ **Chosen** |
| Message queue (SQS/Redis) | Decoupled but overkill for one email | Rejected |

**Rationale**: Single email send via Resend is fast (~200ms). Try/catch guarantees the 201 response regardless of email outcome. No queue infrastructure needed.

### Decision: No subscriber record update for welcome email

**Rationale**: `totalEmailsSent` and `lastEmailSent` track batch newsletter deliveries, not trust signals. Updating them after welcome email would conflate registration emails with campaign metrics.

## Data Flow

```
POST /api/subscribe
  │
  ├─ Validate name + email
  ├─ Check duplicate → 409 if exists
  ├─ Create Firestore doc (subscribers/{email})
  ├─ try {
  │     sendWelcomeEmail(email, unsubscribeToken)
  │       ├─ render(WelcomeEmail({ unsubscribeToken }))
  │       └─ resend.emails.send({ to: email, html, from, subject })
  │   } catch (err) {
  │       console.error("[email] Welcome email failed:", err)
  │   }
  └─ Return 201 { redirectUrl: "/subscribe" }
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/emails/welcome-email.tsx` | Rewrite | Replace copy of WeeklyNewsletter with standalone `WelcomeEmail` component. Props: `{ unsubscribeToken }` only. Static JSX content — no `dangerouslySetInnerHTML`. Preview: "Bienvenido a Spec Log". Same header/footer shell as weekly template |
| `src/lib/services/email.ts` | Modify | Add `sendWelcomeEmail(email, unsubscribeToken)` — render WelcomeEmail via `@react-email/render`, send via Resend SDK. No markdown pipeline, no Firestore writes, no rate limiting |
| `src/app/api/subscribe/route.ts` | Modify | Import `sendWelcomeEmail`. Call after `subscriberDoc.set()`, wrapped in try/catch. Log errors, always return 201 |

## Interfaces / Contracts

```typescript
// src/emails/welcome-email.tsx — new interface
interface WelcomeEmailProps {
  unsubscribeToken: string;   // 8-char alphanumeric token for unsubscribe link
}

// src/lib/services/email.ts — new export
/**
 * Renders WelcomeEmail via @react-email/render and sends via Resend.
 * No markdown pipeline, no Firestore updates, no rate limiting.
 * Caller is responsible for error handling — this function throws on failure.
 */
export async function sendWelcomeEmail(
  email: string,
  unsubscribeToken: string,
): Promise<void>
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | WelcomeEmail renders with token in unsubscribe link | Render component, assert href contains token |
| Unit | WelcomeEmail has no `dangerouslySetInnerHTML` | Source-level check or snapshot assertion |
| Unit | `sendWelcomeEmail` calls render + resend.emails.send | Mock Resend, assert called with correct args and subject |
| Unit | `sendWelcomeEmail` skips markdown pipeline | Assert no unified/rehype modules are invoked |
| Integration | POST /api/subscribe calls `sendWelcomeEmail` after doc creation | Mock email service, assert call order |
| Integration | Email failure still returns 201 | Mock Resend to throw, assert 201 response and logged error |

## Migration / Rollout

No migration required. Additive change — no existing data or behavior is modified.

## Open Questions

None.
