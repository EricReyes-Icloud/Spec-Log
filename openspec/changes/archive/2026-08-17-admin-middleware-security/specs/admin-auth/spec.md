# Delta for admin-auth

## MODIFIED Requirements

### Requirement: Login Authentication

The system MUST authenticate via `signInWithEmailAndPassword`; on success it MUST create a server-side session cookie and redirect to `/admin/newsletters`. On failure it MUST display ONE generic message — never the raw error code, message, or email-existence signal — and MUST NOT redirect.
(Previously: displayed raw Firebase errors, leaking codes and email existence)

#### Scenario: Successful login

- GIVEN valid email and password for a Firebase Auth user
- WHEN the admin submits the login form
- THEN the server creates a session cookie
- AND the browser redirects to `/admin/newsletters`

#### Scenario: Invalid credentials

- GIVEN an email and password that do not match any Firebase Auth user
- WHEN the admin submits the login form
- THEN a generic error appears below the form
- AND it contains no Firebase error code
- AND the admin stays on `/admin/login`
- AND the submit button is re-enabled

#### Scenario: Network failure during login

- GIVEN the browser cannot reach Firebase Auth servers
- WHEN the admin submits the login form
- THEN a generic error is displayed
- AND no redirect occurs

#### Scenario: Session route error

- GIVEN Firebase Auth authenticates but the session route returns an error
- WHEN the login flow completes
- THEN the same generic message is shown
- AND no redirect occurs

### Requirement: Session Persistence

The system MUST NOT rely on an `onAuthStateChanged` listener to restore the session; the server-side session cookie SHALL be the source of persistence, and the client SHALL redirect to `/admin/newsletters` only after that cookie is set.
(Previously: restoration relied on an `onAuthStateChanged` listener)

#### Scenario: Session survives page reload

- GIVEN the admin is authenticated with a valid session cookie
- WHEN the page is reloaded
- THEN the session is restored from the cookie
- AND the admin remains on the current page
- AND no `onAuthStateChanged` listener is registered

#### Scenario: Redirect after cookie set

- GIVEN valid credentials are authenticated and the session route sets the cookie
- WHEN the login flow completes
- THEN the browser redirects to `/admin/newsletters`

#### Scenario: Expired session on navigation

- GIVEN the session cookie has expired or is invalid
- WHEN the admin navigates to `/admin/newsletters`
- THEN the middleware redirects to `/admin/login`

### Requirement: Middleware Route Protection

The Next.js proxy MUST intercept `/admin/:path*` with the `nodejs` runtime, bypass `/admin/login`, and verify session cookies via `verifySessionCookie(cookie, true)` (revocation checked) using a dynamic import of `firebase-admin/auth`. Missing, invalid, or revoked cookies MUST redirect (302) to `/admin/login`.
(Previously: only checked cookie presence; any session cookie passed)

#### Scenario: Unauthenticated redirect

- GIVEN a request to `/admin/newsletters` without a session cookie
- WHEN the proxy evaluates the request
- THEN a 302 redirect to `/admin/login` is returned

#### Scenario: Invalid or revoked cookie redirect

- GIVEN a request with an expired, tampered, or revoked session cookie
- WHEN the proxy verifies the cookie
- THEN a 302 redirect to `/admin/login` is returned

#### Scenario: Authenticated pass-through

- GIVEN a valid session cookie whose email matches `ADMIN_EMAIL`
- WHEN a request hits `/admin/newsletters`
- THEN the request passes through to the page handler

## ADDED Requirements

### Requirement: Middleware Authorization Allowlist

The proxy MUST authorize verified sessions by comparing `decodedToken.email` with `process.env.ADMIN_EMAIL` (case-sensitive exact match). Email mismatch or an unset `ADMIN_EMAIL` MUST return 403.

#### Scenario: Email mismatch denied

- GIVEN a valid session cookie whose token email differs from `ADMIN_EMAIL`
- WHEN a request hits `/admin/newsletters`
- THEN a 403 response is returned

#### Scenario: Env var unset denied

- GIVEN a valid session cookie and `ADMIN_EMAIL` unset
- WHEN a request hits `/admin/newsletters`
- THEN a 403 response is returned

### Requirement: Session Route Hardening

The session route MUST reject POSTs whose `Origin` or `Referer` does not match the request host (403, no cookie set) and MUST rate-limit POSTs per client IP in memory (429 above burst limit).

#### Scenario: Foreign origin rejected

- GIVEN a POST to `/api/auth/session` with a foreign `Origin` or `Referer`
- WHEN the route processes the request
- THEN a 403 response is returned
- AND no session cookie is set

#### Scenario: Burst throttled

- GIVEN POSTs to `/api/auth/session` from one IP exceed the burst threshold within the window
- WHEN the route processes the next request
- THEN a 429 response is returned