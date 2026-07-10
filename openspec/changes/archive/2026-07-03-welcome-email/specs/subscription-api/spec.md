# Delta for Subscription API

## MODIFIED Requirements

### Requirement: Subscription Creation

On valid input with no duplicate, the system MUST create a document at `subscribers/{email}` with the following schema:

| Field | Type | Initial Value |
|-------|------|--------------|
| `name` | string | trimmed name |
| `email` | string | normalized email |
| `status` | `"active"` | `"active"` |
| `source` | `"landing-page"` | `"landing-page"` |
| `createdAt` | Timestamp | `Timestamp.now()` |
| `confirmedAt` | Timestamp \| null | `null` |
| `lastEmailSent` | Timestamp \| null | `null` |
| `metadata` | `{ browser, country }` | parsed from request |
| `totalEmailsSent` | number | `0` |
| `unsubscribeToken` | string | random 8-char uppercase token |

After the document is created, the system SHOULD call `sendWelcomeEmail(email, unsubscribeToken)` wrapped in a try/catch block. The endpoint MUST return 201 with `{ "redirectUrl": "/subscribe" }` regardless of the email send outcome.
(Previously: no welcome email send step after document creation)

#### Scenario: Document created with full schema

- GIVEN valid input for `ana@example.com` that does not exist
- WHEN the server creates the document
- THEN a document exists at `subscribers/ana@example.com` with all schema fields
- AND `status` is `"active"`, `source` is `"landing-page"`, `totalEmailsSent` is `0`
- AND `confirmedAt` and `lastEmailSent` are `null`
- AND `metadata.browser` and `metadata.country` are set from request headers
- AND `unsubscribeToken` is a non-empty string
- AND a 201 response is returned with `redirectUrl`

#### Scenario: Welcome email sent after document creation

- GIVEN a valid subscription request for `ana@example.com`
- WHEN the document is created successfully
- THEN `sendWelcomeEmail("ana@example.com", unsubscribeToken)` is called
- AND a 201 response is returned with `redirectUrl`

#### Scenario: Email failure does not block registration

- GIVEN a valid subscription request
- WHEN the document is created but `sendWelcomeEmail` throws an error
- THEN the error is caught and logged server-side
- AND a 201 response is still returned with `redirectUrl`
- AND the subscriber document persists in Firestore
