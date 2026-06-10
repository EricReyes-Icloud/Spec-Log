# Subscription API Specification

## Purpose

Server-side API for newsletter subscription persistence. Accepts name and email from the landing page form, validates input, detects duplicates, creates a subscriber document in Firestore with engagement tracking fields, and returns a redirect URL for the confirmation flow.

## Requirements

### Requirement: Firebase Admin Initialization

The system MUST initialize a singleton Firebase Admin SDK instance from environment variables. Initialization MUST run server-only and MUST NOT expose credentials to the client.

#### Scenario: Singleton from environment variables

- GIVEN `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set
- WHEN `firebase-admin.ts` is first imported
- THEN a single Firebase Admin app instance is created
- AND subsequent imports reuse the same instance

### Requirement: Input Validation

The endpoint MUST validate that `name` is at least 2 characters and `email` matches a standard email format. Invalid input MUST return 400 with a descriptive error.

#### Scenario: Valid input passes

- GIVEN a POST with `{ "name": "Ana", "email": "ana@example.com" }`
- WHEN the server validates
- THEN processing continues

#### Scenario: Empty name returns 400

- GIVEN a POST with `{ "name": "", "email": "ana@example.com" }`
- WHEN the server validates
- THEN a 400 response indicates name is required
- AND no document is created

#### Scenario: Malformed email returns 400

- GIVEN a POST with `{ "name": "Ana", "email": "bad" }`
- WHEN the server validates
- THEN a 400 response indicates email is invalid
- AND no document is created

### Requirement: Duplicate Detection

The system MUST use the subscriber email as the Firestore document ID. If a document with that ID exists in `subscribers`, the endpoint MUST return 409.

#### Scenario: Duplicate email returns 409

- GIVEN a document with ID `ana@example.com` exists in `subscribers`
- WHEN a POST with the same email arrives
- THEN a 409 response indicates the user is already registered

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

The endpoint MUST return 201 with `{ "redirectUrl": "/subscribe" }`.

#### Scenario: Document created with full schema

- GIVEN valid input for `ana@example.com` that does not exist
- WHEN the server creates the document
- THEN a document exists at `subscribers/ana@example.com` with all schema fields
- AND `status` is `"active"`, `source` is `"landing-page"`, `totalEmailsSent` is `0`
- AND `confirmedAt` and `lastEmailSent` are `null`
- AND `metadata.browser` and `metadata.country` are set from request headers
- AND `unsubscribeToken` is a non-empty string
- AND a 201 response is returned with `redirectUrl`

### Requirement: Browser Detection

The system MUST parse the `User-Agent` header to detect the subscriber's browser. Unknown browsers MUST default to `"Unknown"`.

#### Scenario: Chrome detected from UA

- GIVEN a request with `User-Agent` containing "Chrome/120"
- WHEN the server parses the header
- THEN `metadata.browser` is `"Chrome"`

#### Scenario: Unknown browser defaults

- GIVEN a request with no `User-Agent` header
- WHEN the server parses the header
- THEN `metadata.browser` is `"Unknown"`

### Requirement: Country Detection

The system SHOULD detect the subscriber's country from the `x-vercel-ip-country` request header. If unavailable, it MUST default to `"unknown"`.

#### Scenario: Country from Vercel header

- GIVEN a request with `x-vercel-ip-country: CO`
- WHEN the server reads the header
- THEN `metadata.country` is `"CO"`

### Requirement: Unsubscribe Token Generation

The system MUST generate a unique unsubscribe token for each subscriber. The token MUST be an 8-character uppercase alphanumeric string.

#### Scenario: Token generated on creation

- GIVEN a valid subscription request
- WHEN the document is created
- THEN `unsubscribeToken` matches `/^[A-Z0-9]{8}$/`

### Requirement: Server Error Handling

The system MUST catch unexpected errors and return 500 with a generic message. Internal details MUST NOT leak to the client.

#### Scenario: Firestore write failure

- GIVEN the Firestore write fails unexpectedly
- WHEN the server catches the error
- THEN a 500 response is returned with a generic message
- AND internal details are logged server-side

### Requirement: Form Submission Integration

Hero.tsx MUST submit the form to `POST /api/subscribe` via `fetch`. On 201, the page MUST redirect to the returned URL. On error, the form MUST display an inline error without navigating.

#### Scenario: Success redirects to confirmation

- GIVEN the form has valid input
- WHEN the API returns 201 with `redirectUrl`
- THEN the browser navigates to that URL

#### Scenario: Error shows inline message

- GIVEN the form has valid input
- WHEN the API returns 4xx or 5xx
- THEN the user stays on the landing page
- AND an inline error is displayed below the form
- AND the submit button is re-enabled
