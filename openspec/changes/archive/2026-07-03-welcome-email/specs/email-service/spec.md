# Delta for Email Service

## ADDED Requirements

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
