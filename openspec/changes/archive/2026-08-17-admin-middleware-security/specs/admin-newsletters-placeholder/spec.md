# Delta for admin-newsletters-placeholder

## MODIFIED Requirements

### Requirement: Inherited Route Protection

The `/admin/newsletters` page MUST inherit middleware route protection from the `admin-auth` capability. Unauthenticated access MUST redirect to `/admin/login`; authenticated access by an email that does not match `ADMIN_EMAIL` MUST return 403.
(Previously: protection was session-cookie presence only)

#### Scenario: Direct access without session

- GIVEN no valid session cookie exists
- WHEN a request is made to `/admin/newsletters`
- THEN the middleware returns a 302 redirect to `/admin/login`

#### Scenario: Non-allowlisted email denied

- GIVEN a valid session cookie whose token email does not match `ADMIN_EMAIL`
- WHEN a request is made to `/admin/newsletters`
- THEN a 403 response is returned

## ADDED Requirements

### Requirement: No Client-Side Auth Listener

The `/admin/newsletters` page MUST NOT register a Firebase `onAuthStateChanged` listener, and MUST NOT contain comments claiming the middleware handles unauthenticated access.

#### Scenario: Page renders without listener

- GIVEN the page mounts on `/admin/newsletters`
- WHEN the client inspects active subscriptions
- THEN no `onAuthStateChanged` listener is registered
- AND the logout flow still works

#### Scenario: No stale security comment

- GIVEN the page source is inspected
- WHEN a request is made for the page source
- THEN no comment claims the middleware handles unauthenticated access