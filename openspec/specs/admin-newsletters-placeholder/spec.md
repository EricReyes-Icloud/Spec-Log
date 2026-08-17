# Admin Newsletters Placeholder Specification

## Purpose

Simple placeholder page at `/admin/newsletters` confirming the admin is authenticated, with an orange logout button for session termination.

## Requirements

### Requirement: Placeholder Page Layout

The `/admin/newsletters` page MUST display a confirmation heading indicating the admin is logged in, alongside a descriptive paragraph. A logout button SHALL appear in the top-right corner styled with orange (`#FF6B35`) background.

#### Scenario: Placeholder content renders

- GIVEN an authenticated admin
- WHEN they navigate to `/admin/newsletters`
- THEN a confirmation heading is displayed
- AND a descriptive paragraph explains this is a placeholder
- AND an orange logout button is visible in the top-right corner

### Requirement: Logout Action

Clicking the logout button MUST call `signOut` on the Firebase Auth instance and destroy the server-side session cookie. The browser MUST redirect to `/admin/login`.

#### Scenario: Logout succeeds

- GIVEN the admin is authenticated on `/admin/newsletters`
- WHEN they click the logout button
- THEN Firebase Auth sign-out is called
- AND the session cookie is destroyed
- AND the browser redirects to `/admin/login`

#### Scenario: Logout followed by admin URL

- GIVEN the admin has logged out
- WHEN they manually navigate to `/admin/newsletters`
- THEN the middleware redirects back to `/admin/login`

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

### Requirement: No Feature Content

The page MUST NOT include newsletter editor, preview, or any management functionality. It is a pure placeholder.

#### Scenario: Placeholder only

- GIVEN an authenticated admin on `/admin/newsletters`
- WHEN they inspect the page content
- THEN no editor, preview, or management UI elements are present
- AND only the confirmation message, descriptive text, and logout button are rendered

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
