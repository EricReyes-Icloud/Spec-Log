# Newsletter Send Specification

## Purpose

Protected API route at `POST /api/newsletter/send` that accepts a newsletter ID, validates state, fetches subscribers, and delegates to the email service. Client-side wiring enables the "Publicar" button in both editor pages.

## Requirements

### Requirement: Admin Session Protection

The API route MUST verify admin authentication via the Firebase session cookie. Requests without a valid session MUST return a 401 response with no further processing.

#### Scenario: Valid session processes request

- GIVEN a valid Firebase session cookie
- WHEN `POST /api/newsletter/send` receives `{ newsletterId: "abc" }`
- THEN the route proceeds to newsletter validation

#### Scenario: Missing session returns 401

- GIVEN no session cookie
- WHEN `POST /api/newsletter/send` is called
- THEN a 401 response is returned
- AND no Firestore or Resend operations occur

### Requirement: Newsletter Validation

The route MUST verify the newsletter exists in Firestore. If not found, it MUST return 404. If the newsletter status is already `"sent"`, it MUST return 409 Conflict.

#### Scenario: Newsletter not found

- GIVEN a nonexistent newsletter ID
- WHEN the route queries Firestore
- THEN a 404 response is returned

#### Scenario: Already sent returns 409

- GIVEN a newsletter with `status: "sent"`
- WHEN the route checks status
- THEN a 409 response is returned with error code `ALREADY_SENT`

### Requirement: Subscriber Fetching

The route MUST query the `subscribers` Firestore collection for all documents where `status === "active"`.

#### Scenario: Active subscribers fetched

- GIVEN a valid draft newsletter ID
- WHEN the route queries subscribers
- THEN all `subscribers` with `status: "active"` are returned

### Requirement: Delegate and Respond

The route MUST pass the newsletter data and subscriber list to the email service. On full success it MUST return 200 with `{ success: true, sentCount: N }`. On failure it MUST return 500 with a generic error message (details logged server-side only).

#### Scenario: Success response

- GIVEN valid newsletter, active subscribers, and successful delivery
- WHEN the email service completes
- THEN a 200 response with `{ success: true, sentCount: 3 }` is returned

#### Scenario: Error response

- GIVEN the email service throws an error
- WHEN the route catches the exception
- THEN a 500 response with a generic message is returned
- AND the error is logged server-side

### Requirement: Publish Button — Enabled

The "Publicar" button in both `admin/editor/page.tsx` and `admin/editor/[id]/page.tsx` MUST be enabled (remove `disabled` attribute) and SHALL call `POST /api/newsletter/send` with the current newsletter ID on click.

#### Scenario: Button triggers API call

- GIVEN a saved newsletter with a known Firestore ID
- WHEN the admin clicks "Publicar"
- THEN a `fetch POST /api/newsletter/send` is made with `{ newsletterId: "<id>" }`

### Requirement: Button States — Loading, Success, Error

During send, the button MUST be disabled with loading text. On success, a success message SHALL appear. On error, an inline error SHALL appear and the button SHALL re-enable.

#### Scenario: Loading during send

- GIVEN the admin clicks "Publicar"
- WHEN the API request is in flight
- THEN the button is disabled
- AND button text changes to show sending state

#### Scenario: Success shows confirmation

- GIVEN the API returns 200
- WHEN the response is received
- THEN a success message is displayed
- AND the button is re-enabled

#### Scenario: Error shows message

- GIVEN the API returns an error
- WHEN the response is received
- THEN an inline error message is displayed
- AND the button is re-enabled
