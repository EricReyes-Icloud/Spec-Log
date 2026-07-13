# Design: Domain Setup — Migrate to Custom Sender Domain

## Technical Approach

Replace the hardcoded `onboarding@resend.dev` sender with env-configurable values. The mailto link in the tip section must reach both the newsletter domain (TO) and the owner's personal email (BCC in mailto). No BCC at the Resend API level.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Single env var for everything | Simple but conflates from/reply | **Rejected** |
| Separate env vars for from, replyTo, bccMailto | More vars but explicit intent | **Chosen** |
| Hardcode personal email | Simple but leaks to git | **Rejected** — use env var |
| Modify `createReplyMailto` signature | Breaks existing callers | **Accepted** — optional param, backward compatible |

## Data Flow

```
sendWelcomeEmail(email, token)
 │
 ├── senderEmail ← process.env.RESEND_REPLY_TO_EMAIL   ← newsletter@speclog.dpdns.org
 ├── bccMailto   ← process.env.RESEND_BCC_MAILTO       ← ereyes102504k@gmail.com
 │
 ├── render WelcomeEmail({
 │       unsubscribeToken,
 │       senderEmail,     ← newsletter domain
 │       replySubject,
 │       bccMailto,       ← personal email (NEW)
 │     })
 │     └── createReplyMailto(senderEmail, replySubject, bccMailto)
 │           └── mailto:newsletter@speclog.dpdns.org?bcc=ereyes102504k%40gmail.com&subject=...
 │
 └── resend.emails.send({
       from:      process.env.RESEND_FROM_EMAIL,    ← newsletter@speclog.dpdns.org
       reply_to:  process.env.RESEND_REPLY_TO_EMAIL, ← newsletter@speclog.dpdns.org
       to:        subscriber.email
     })
     /* NO bcc at API level */

sendNewsletter(title, content, subscribers[])
 │
 ├── markdown pipeline (unchanged)
 ├── renderTipBoxes(html, RESEND_REPLY_TO_EMAIL, "Re: " + title, RESEND_BCC_MAILTO)
 │     └── mailto:newsletter@...?bcc=ereyes102504k%40gmail.com
 │
 └── for each subscriber →
       resend.emails.send({
         from:     RESEND_FROM_EMAIL,
         reply_to: RESEND_REPLY_TO_EMAIL,
         to:       subscriber.email
       })
       /* NO bcc at API level */
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `.env.local` | Modify | Change `RESEND_FROM_EMAIL`, add `RESEND_REPLY_TO_EMAIL` + `RESEND_BCC_MAILTO` |
| `src/utils/mailto.ts` | Modify | Add optional `bccEmail` param to `createReplyMailto()` |
| `src/lib/services/email.ts` | Modify | Update senderEmail, add bccMailto, update both send functions |
| `src/emails/welcome-email.tsx` | Modify | Add `bccMailto` prop, pass to `createReplyMailto()` |
| `src/components/email/NewsletterPreview.tsx` | Check | Verify if it calls `createReplyMailto` or `renderTipBoxes` |

## Environment Variables

| Variable | Current | New Value |
|----------|---------|-----------|
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | `newsletter@speclog.dpdns.org` |
| `RESEND_REPLY_TO_EMAIL` | *missing* | `newsletter@speclog.dpdns.org` |
| `RESEND_BCC_MAILTO` | *missing* | `ereyes102504k@gmail.com` |

## Changes Detail

### 1. `src/utils/mailto.ts`
```ts
// Current:
export function createReplyMailto(senderEmail: string, replySubject: string): string {
  const encodedSubject = encodeURIComponent(replySubject);
  return `mailto:${senderEmail}?subject=${encodedSubject}`;
}

// New — optional bccEmail:
export function createReplyMailto(
  senderEmail: string,
  replySubject: string,
  bccEmail?: string,
): string {
  const encodedSubject = encodeURIComponent(replySubject);
  let href = `mailto:${senderEmail}?subject=${encodedSubject}`;
  if (bccEmail) {
    href += `&bcc=${encodeURIComponent(bccEmail)}`;
  }
  return href;
}
```

### 2. `src/lib/services/email.ts` — `sendWelcomeEmail()`
```ts
// Replace lines ~193-196:
// OLD:
const senderEmail = "onboarding@resend.dev";
const replySubject = "Bienvenido a Spec Log";
// NEW:
const senderEmail = process.env.RESEND_REPLY_TO_EMAIL!;
const bccMailto = process.env.RESEND_BCC_MAILTO!;
const replySubject = "Bienvenido a Spec Log";

// Update render call (line ~199):
// OLD:
const emailHtml = render(WelcomeEmail({ unsubscribeToken, senderEmail, replySubject }));
// NEW:
const emailHtml = render(WelcomeEmail({ unsubscribeToken, senderEmail, replySubject, bccMailto }));

// Update resend.emails.send() (lines ~205-210):
// OLD:
const { error: sendError } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: email,
  subject: "Bienvenido a Spec Log",
  html: emailHtml,
});
// NEW — add replyTo:
const { error: sendError } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  reply_to: [process.env.RESEND_REPLY_TO_EMAIL!],
  to: email,
  subject: "Bienvenido a Spec Log",
  html: emailHtml,
});
```

### 3. `src/lib/services/email.ts` — `sendNewsletter()` mailto fix
Current `renderTipBoxes()` call uses `RESEND_FROM_EMAIL` for the mailto. Must switch to `RESEND_REPLY_TO_EMAIL` and add BCC.

### 4. `src/emails/welcome-email.tsx`
- Add `bccMailto?: string` to `WelcomeEmailProps`
- Update `createReplyMailto()` call:
  ```ts
  const replyHref = createReplyMailto(senderEmail, replySubject, bccMailto);
  ```

### 5. `src/components/email/NewsletterPreview.tsx`
Check if it calls `createReplyMailto` — if so, update call to maintain backward compatibility (bccMailto is optional).

## Security Considerations

- **No API-level BCC** — personal email never appears in SMTP headers
- **Mailto BCC** — most email clients respect BCC in mailto links; the BCC recipient is invisible to the sender
- **Personal email in env vars** — `.env.local` is gitignored, safe from version control
- **No new secrets** — Resend API key unchanged

## Testing Notes

Manual verification (no test runner configured):

1. **Sender domain**: Subscribe test email → verify `from` header shows `newsletter@speclog.dpdns.org`
2. **Reply header**: Open welcome email → click "Reply" → verify To: is `newsletter@speclog.dpdns.org`
3. **Mailto link**: Click tip section → verify To: `newsletter@speclog.dpdns.org` and BCC: `ereyes102504k@gmail.com`
4. **No API BCC**: Capture Resend API call → verify no `bcc` field present
5. **Backward compat**: Existing callers of `createReplyMailto` without bccEmail still work

## Rollback Plan

1. Revert `.env.local`: restore `RESEND_FROM_EMAIL=onboarding@resend.dev`, remove new vars
2. `git checkout src/utils/mailto.ts src/lib/services/email.ts src/emails/welcome-email.tsx`
3. Subscribe test email → confirm welcome comes from `onboarding@resend.dev`
4. Confirm no BCC in mailto link
