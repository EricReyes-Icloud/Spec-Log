# Delta for email-service

**Change**: domain-setup
**Summary**: Migrate sender domain from `onboarding@resend.dev` to `newsletter@speclog.dpdns.org`, add BCC and reply-to to owner's personal email, and separate mailto reply address from the `from` header.

## Environment Variables

| Variable | Current Value | New Value | Purpose |
|----------|--------------|-----------|---------|
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` | `newsletter@speclog.dpdns.org` | `from` header in Resend API (subscriber sees this) |
| `RESEND_REPLY_TO_EMAIL` | _(not set)_ | `ereyes102504k@gmail.com` | `replyTo` + `bcc` in Resend API; `senderEmail` prop for mailto links |

## ADDED Requirements

### Requirement: Reply-To and BCC on All Sends

Both `sendWelcomeEmail()` and `sendNewsletter()` MUST include `replyTo: [RESEND_REPLY_TO_EMAIL]` and `bcc: [RESEND_REPLY_TO_EMAIL]` in every `resend.emails.send()` call. The value SHALL come from the `RESEND_REPLY_TO_EMAIL` env var.

#### Scenario: Welcome email includes replyTo and bcc

- GIVEN `sendWelcomeEmail()` is called with a valid email
- WHEN the Resend API call is made
- THEN `replyTo` is `["ereyes102504k@gmail.com"]`
- AND `bcc` is `["ereyes102504k@gmail.com"]`

#### Scenario: Newsletter sends include replyTo and bcc per subscriber

- GIVEN `sendNewsletter()` processes 3 subscribers
- WHEN each `resend.emails.send()` is called
- THEN each call includes `replyTo` and `bcc` with the personal email
- AND recipients do not see the BCC recipient

### Requirement: Mailto Sender Separated from From Header

The `senderEmail` prop passed to email templates (for mailto links in tip/reply sections) MUST be the personal email from `RESEND_REPLY_TO_EMAIL`, NOT the `from` address. This applies to `sendWelcomeEmail()` (passed to `WelcomeEmail` component) and `sendNewsletter()` (passed to `renderTipBoxes()`).

#### Scenario: Welcome email mailto uses reply-to address

- GIVEN `sendWelcomeEmail()` renders the template
- WHEN the `senderEmail` prop is set
- THEN its value is `process.env.RESEND_REPLY_TO_EMAIL`
- AND the rendered mailto link targets `ereyes102504k@gmail.com`

#### Scenario: Newsletter tip mailto uses reply-to address

- GIVEN `sendNewsletter()` renders tip boxes
- WHEN `renderTipBoxes()` is called
- THEN the `senderEmail` argument is `process.env.RESEND_REPLY_TO_EMAIL`
- AND the rendered mailto link targets `ereyes102504k@gmail.com`

## Success Criteria

- [ ] Welcome email `from` header is `newsletter@speclog.dpdns.org`
- [ ] Newsletter `from` header is `newsletter@speclog.dpdns.org`
- [ ] BCC copy of each email arrives at `ereyes102504k@gmail.com`
- [ ] Replying to welcome email tip section composes to `ereyes102504k@gmail.com`
- [ ] Replying to newsletter tip section composes to `ereyes102504k@gmail.com`
- [ ] No regressions in email delivery or template rendering

## Regression Scope

When verifying, confirm these remain intact:

- **Welcome email renders with correct content**: no template changes involved, but verify the `senderEmail` prop doesn't break the `createReplyMailto()` call
- **Newsletter markdown pipeline unchanged**: `withLineBreaks()`, `preparseMarkdown()`, unified/rehype flow unaffected
- **Unsubscribe token flow**: still passes correctly in both send functions
- **Rate limiting in `sendNewsletter()`**: 150ms delay between sends unaffected
- **Firestore subscriber updates**: `totalEmailsSent` and `lastEmailSent` tracking unaffected
- **Empty subscriber list**: early return path unaffected
- **Error handling**: Resend errors still thrown correctly; BCC/Reply-To addition doesn't introduce new failure modes
