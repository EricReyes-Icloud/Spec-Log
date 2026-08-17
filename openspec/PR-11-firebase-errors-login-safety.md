# PR-11: Firebase Error Mapping and Login Safety

## Description

Firebase Auth exposes detailed error codes (`auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password`, etc.) in client-side error messages. When these codes appear on the login page, they reveal whether a specific email account exists in the system — a classic email enumeration vector that lets attackers probe for registered addresses.

This PR eliminates the enumeration risk by introducing a pure error mapper that converts every possible login failure (Firebase code, network error, session-route body, null/undefined) into a single generic constant: `"Credenciales invalidas."`. The login page now uses this mapper exclusively, so no error path can leak account existence.

## Changes Made

**Error mapper (new)**
- `src/lib/firebase-errors.ts` — exports `GENERIC_LOGIN_ERROR` constant and pure `mapLoginError(err: unknown): string` that returns the constant for every input; raw codes, messages, and body text are never surfaced
- `src/lib/__tests__/firebase-errors.test.ts` — 88-line test file covering all known Firebase codes, unknown codes, plain `Error`, `TypeError` (network), session-route `{error}` body, null, undefined, and a negative assertion that output never contains `"auth/"`, `"Firebase error"`, or `"Origen"`

**Login page integration**
- `src/app/admin/login/page.tsx` — replaced inline `err instanceof Error ? err.message` catch block with `mapLoginError(err)`; button re-enable and redirect-on-success logic unchanged

**Login page tests (new)**
- `src/app/admin/login/__tests__/login-page.test.tsx` — 4 tests: invalid credentials shows generic message without leaking code, network failure shows generic message, session-route error shows generic message, success still redirects to `/admin/newsletters`

**Newsletters page tests (new)**
- `src/app/admin/newsletters/__tests__/newsletters-page.test.tsx` — 2 tests: mount does NOT register `onAuthStateChanged` listener, logout flow (signOut + server DELETE + redirect) still works

## Impact

Login failures no longer reveal Firebase error codes or account existence. Every failure path — invalid credentials, network errors, session-route rejections, null/undefined inputs — produces the same user-visible message. The test suite (7 new test files across the change) validates that no input can be distinguished by its output.

Backward compatible: the login page UX is unchanged (same form, same button behavior, same redirect on success). Only the error message text changes from raw Firebase codes to the generic constant.

## Notes

- Test command: `npx vitest run src/lib/__tests__/firebase-errors.test.ts src/app/admin/login/__tests__/login-page.test.tsx src/app/admin/newsletters/__tests__/newsletters-page.test.tsx`
- The `GENERIC_LOGIN_ERROR` constant is in Spanish (`"Credenciales invalidas."`) matching the existing login page language
- This PR is slice 1 of a chained feature-branch chain; PR-12 (proxy auth rewrite) builds on top of this
