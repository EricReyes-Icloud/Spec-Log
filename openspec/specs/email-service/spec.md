# Email Service Specification

## Purpose

Server-side module at `src/lib/services/email.ts` that orchestrates newsletter delivery: processes content through the React Email template, sends individual emails via Resend SDK, and updates subscriber and newsletter records in Firestore.

## Requirements

### Requirement: Pipeline + React Email Rendering

The service MUST apply `withLineBreaks()`, then `preparseMarkdown()`, then convert markdown to HTML using `unified().use(remarkParse).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeStringify, {allowDangerousHtml: true})` to newsletter markdown, render the result via the React Email `weekly-newsletter` template, and produce email-safe HTML using `@react-email/render`. The `allowDangerousHtml: true` option MUST be passed to BOTH `remarkRehype` and `rehypeStringify`.
(Previously: pipeline was `withLineBreaks()` then `preparseMarkdown()` only, no markdown→HTML step)

#### Scenario: Renders to valid HTML with markdown conversion

- GIVEN newsletter with markdown content containing `**bold**` and `## heading`
- WHEN the service renders the template
- THEN a valid email HTML string is returned
- AND the output contains `<strong>` and `<h2>` elements from markdown syntax
- AND no rendering exceptions occur

#### Scenario: Dangerous HTML preserved through full pipeline

- GIVEN newsletter markdown containing raw HTML tags (`<coment>`, `<orange>`)
- WHEN the service renders the template
- THEN raw HTML custom tags are preserved in the output
- AND `preparseMarkdown` must run BEFORE the unified step so that custom tags are converted to standard HTML before markdown parsing

### Requirement: Individual Resend Delivery

The service MUST send one email per subscriber via the Resend SDK `emails.send()` method. Each email SHALL include the subscriber's `unsubscribeToken` in the unsubscribe link. A delay of at least 100ms SHALL be inserted between consecutive sends.

#### Scenario: Per-subscriber sends

- GIVEN a newsletter and 3 active subscribers with known `unsubscribeToken` values
- WHEN the service processes delivery
- THEN 3 individual `emails.send()` calls are made
- AND each call has a distinct `unsubscribeToken` in the HTML
- AND ≥100ms elapses between each call

### Requirement: Subscriber Record Update

After each successful individual send, the service MUST increment that subscriber's `totalEmailsSent` by 1 and set `lastEmailSent` to `Timestamp.now()`.

#### Scenario: Subscriber count increments

- GIVEN a subscriber with `totalEmailsSent: 2` and `lastEmailSent: null`
- WHEN the service successfully sends to this subscriber
- THEN `totalEmailsSent` becomes `3`
- AND `lastEmailSent` is a recent timestamp

### Requirement: Newsletter Status — All-or-Nothing

If ALL subscriber sends succeed, the service MUST set newsletter `status` to `"sent"` and `sentAt` to `Timestamp.now()`. If ANY send fails, the newsletter MUST remain `"draft"` and `sentAt` MUST NOT be set.

#### Scenario: All succeed → marked sent

- GIVEN 3 subscribers all send successfully
- WHEN all sends complete
- THEN newsletter `status` is `"sent"`
- AND `sentAt` is set

#### Scenario: Any fails → remains draft

- GIVEN 3 subscribers, 1 send fails with a Resend error
- WHEN processing completes
- THEN newsletter `status` remains `"draft"`
- AND `sentAt` is NOT set

### Requirement: No Active Subscribers

If the subscriber list is empty, the service MUST return immediately without calling Resend or modifying any Firestore documents.

#### Scenario: Empty list returns early

- GIVEN a newsletter and zero active subscribers
- WHEN the service is called
- THEN no Resend API calls are made
- AND no documents are updated

### Requirement: Partial Failure Logging

The service SHOULD log each subscriber's send result (success or failure) at `info` or `error` level. A summary log SHOULD report total sent, total failed, and total attempted.

#### Scenario: Failures logged

- GIVEN 3 subscribers, 2 succeed and 1 fails
- WHEN processing completes
- THEN 2 success and 1 failure entry are logged
- AND a summary log reports `sent: 2, failed: 1, total: 3`

### Requirement: sendWelcomeEmail

The service MUST expose a `sendWelcomeEmail(email, unsubscribeToken)` function. This function SHALL render the `WelcomeEmail` component via `@react-email/render` and send the rendered HTML via the Resend SDK `emails.send()` method. This function MUST NOT apply any markdown pipeline — no `withLineBreaks()`, no `preparseMarkdown()`, no unified/rehype processing. The `from` address MUST match the existing `RESEND_FROM_EMAIL` config.

#### Scenario: Renders and sends welcome email

- GIVEN a valid email address and `unsubscribeToken: "ABC12345"`
- WHEN `sendWelcomeEmail` is called
- THEN `WelcomeEmail` is rendered via `@react-email/render`
- AND a single `emails.send()` call is made with the rendered HTML
- AND the `to` address matches the given email
- AND the HTML body contains the unsubscribe token

#### Scenario: No markdown processing applied

- GIVEN `sendWelcomeEmail` is called
- WHEN the function executes
- THEN neither `withLineBreaks()`, `preparseMarkdown()`, nor unified/rehype APIs are invoked
- AND the template receives the raw static content directly

### Requirement: Custom Sender Domain

All emails sent via Resend MUST use the domain configured in `RESEND_FROM_EMAIL` as the `from` address. Both `sendWelcomeEmail()` and `sendNewsletter()` SHALL include `replyTo` in the `resend.emails.send()` call, sourced from the `RESEND_REPLY_TO_EMAIL` env var. The `bcc` in the mailto link (tip/reply sections) MUST be driven by `RESEND_BCC_MAILTO`. No `bcc` field SHALL appear in the `resend.emails.send()` API calls.

#### Scenario: Welcome email uses custom sender domain

- GIVEN `sendWelcomeEmail()` is called with a valid email
- WHEN the Resend API call is made
- THEN `from` is `newsletter@speclog.dpdns.org` (from `RESEND_FROM_EMAIL`)
- AND `replyTo` includes `ereyes102504k@gmail.com` (from `RESEND_REPLY_TO_EMAIL`)
- AND no `bcc` field is present in the API call

#### Scenario: Newsletter sends use custom sender domain

- GIVEN `sendNewsletter()` processes subscribers
- WHEN each `resend.emails.send()` is called
- THEN `from` is `newsletter@speclog.dpdns.org`
- AND `replyTo` includes the personal email
- AND no `bcc` field is present in the API call

### Requirement: Mailto Sender Separated from From Header

The `senderEmail` prop passed to email templates (for mailto links in tip/reply sections) MUST be the personal email from `RESEND_REPLY_TO_EMAIL`, NOT the `from` address. This applies to `sendWelcomeEmail()` (passed to `WelcomeEmail` component) and `sendNewsletter()` (passed to `renderTipBoxes()`). The `createReplyMailto()` function MUST accept an optional `bccEmail` parameter; when provided, it SHALL append `&bcc=` to the mailto href.

#### Scenario: Welcome email mailto uses reply-to address

- GIVEN `sendWelcomeEmail()` renders the template
- WHEN the `senderEmail` prop is set
- THEN its value is `process.env.RESEND_REPLY_TO_EMAIL`
- AND the rendered mailto link targets `ereyes102504k@gmail.com`

#### Scenario: Newsletter tip mailto uses reply-to address

- GIVEN `sendNewsletter()` renders tip boxes
- WHEN `renderTipBoxes()` is called
- THEN the `senderEmail` argument is `process.env.RESEND_REPLY_TO_EMAIL`
- AND the rendered mailto link targets the personal email with BCC

#### Scenario: Mailto link includes BCC

- GIVEN `createReplyMailto(senderEmail, replySubject, bccEmail)` is called with all three args
- WHEN the mailto href is generated
- THEN it contains `mailto:{senderEmail}?subject=...&bcc={encodedBccEmail}`
- AND the BCC email is URL-encoded
