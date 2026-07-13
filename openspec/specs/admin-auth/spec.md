# Admin Auth Specification

## Purpose

Client-side Firebase Auth email/password login for a single admin, with server-side session cookies and Next.js middleware protecting `/admin/*` routes.

## Requirements

### Requirement: Firebase Client Initialization

The system MUST initialize a singleton Firebase client SDK in the browser using `NEXT_PUBLIC_` environment variables.

#### Scenario: Singleton from public env vars

- GIVEN `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, and `NEXT_PUBLIC_FIREBASE_PROJECT_ID` are set
- WHEN the client SDK is first imported in the browser
- THEN a single Firebase app instance is created
- AND subsequent imports reuse the same instance

### Requirement: Login Page Layout

The `/admin/login` page MUST render a centered card with these design tokens: black carbon (`#1a1a1a`) background, orange (`#FF6B35`) "SPEC LOG EDIT" title, transparent card background with gray border, light gray (`#e0e0e0`) input fields, and an orange button with black carbon text.

#### Scenario: Matches template instructions

- GIVEN an admin navigates to `/admin/login`
- THEN the page background is black carbon
- AND "SPEC LOG EDIT" is rendered in orange
- AND the card is transparent with a gray border
- AND inputs are light gray
- AND the button is orange with black text

### Requirement: Login Authentication

The system MUST authenticate via `signInWithEmailAndPassword`. On success, the system MUST create a server-side session cookie and redirect to `/admin/newsletters`. On failure, the system MUST display an inline error without redirecting.

#### Scenario: Successful login

- GIVEN valid email and password for a Firebase Auth user
- WHEN the admin submits the login form
- THEN Firebase Auth authenticates the credentials
- AND the server creates a session cookie
- AND the browser redirects to `/admin/newsletters`

#### Scenario: Invalid credentials

- GIVEN an email and password that do not match any Firebase Auth user
- WHEN the admin submits the login form
- THEN Firebase Auth returns an auth error
- AND an inline error message appears below the form
- AND the admin stays on `/admin/login`
- AND the submit button is re-enabled

#### Scenario: Network failure during login

- GIVEN the browser cannot reach Firebase Auth servers
- WHEN the admin submits the login form
- THEN a generic error message is displayed
- AND no redirect occurs

### Requirement: Session Persistence

The system MUST listen to Firebase `onAuthStateChanged` to restore the session on page reload. A valid session SHALL survive page reloads and navigation within `/admin/*`.

#### Scenario: Session survives page reload

- GIVEN the admin is authenticated
- WHEN the page is reloaded
- THEN the session is restored from the cookie
- AND the admin remains on the current page

#### Scenario: Expired session on navigation

- GIVEN the session cookie has expired or is invalid
- WHEN the admin navigates to `/admin/newsletters`
- THEN the middleware redirects to `/admin/login`

### Requirement: Logout

The system MUST provide a logout mechanism that destroys the session cookie and redirects to `/admin/login`.

#### Scenario: Logout clears session

- GIVEN the admin is authenticated
- WHEN the admin clicks the logout button
- THEN the session cookie is destroyed
- AND the browser redirects to `/admin/login`
- AND subsequent `/admin/*` requests redirect back to login

### Requirement: Middleware Route Protection

The Next.js middleware MUST intercept `/admin/*` requests. Requests without a valid session cookie MUST redirect to `/admin/login`. Requests with a valid session cookie MUST pass through.

#### Scenario: Unauthenticated redirect

- GIVEN a request to `/admin/newsletters` without a session cookie
- WHEN the middleware evaluates the request
- THEN a 302 redirect to `/admin/login` is returned

#### Scenario: Authenticated pass-through

- GIVEN a request to `/admin/newsletters` with a valid session cookie
- WHEN the middleware evaluates the request
- THEN the request passes through to the page handler

### Requirement: Middleware Login Bypass

The middleware MUST allow `/admin/login` regardless of session state.

#### Scenario: Login always accessible

- GIVEN a request to `/admin/login` without a session cookie
- WHEN the middleware evaluates the request
- THEN the request passes through without redirect

### Requirement: No Registration Endpoint

The system MUST NOT expose any registration endpoint. Admin accounts MUST be created manually via the Firebase Console.

#### Scenario: Registration endpoint absent

- GIVEN a request to `/admin/register` or `/api/register`
- WHEN the server processes the request
- THEN a 404 response is returned
