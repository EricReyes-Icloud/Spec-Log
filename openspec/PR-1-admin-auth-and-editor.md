# Admin Authentication & Editor (Fase 1 + Fase 2)

## Description

The system lacked any admin interface — there was no way to authenticate, manage newsletters, or create content. Admins could subscribe users but had no dashboard to compose or preview newsletters.

This PR implements the first two phases of the newsletter system:

- **Fase 1 — Admin Authentication**: Firebase email/password login, server-side session cookies via httpOnly cookie, and middleware protection for `/admin/*` routes. Admins are created manually in Firebase Console; there is no registration endpoint.
- **Fase 2 — Admin Editor**: A split-pane editor with live markdown preview, custom tag pre-parser (`<coment>`, `<orange>`, `<tip>`, `<cta>`), Firestore persistence for newsletters (draft status), and a placeholder newsletters management page with logout.

Both phases were developed following the SDD process — each has complete specs, design docs, task lists, and verification reports in `openspec/`.

## Changes Made

### Features — Admin Authentication

- `src/lib/firebase-client.ts` — Singleton Firebase client SDK exporting `auth` instance and Firestore CRUD functions (`createNewsletter`, `updateNewsletter`, `getNewsletter`)
- `src/app/admin/login/page.tsx` — Client-component login page with email/password form; authenticates via `signInWithEmailAndPassword`, exchanges ID token for session cookie via API route, redirects to `/admin/newsletters` on success
- `src/app/api/auth/session/route.ts` — POST creates a server-side httpOnly session cookie (5-day expiry); DELETE clears it; both use Firebase Admin SDK
- `src/proxy.ts` — Next.js edge middleware that checks for session cookie on `/admin/*` routes, bypasses `/admin/login`, redirects unauthenticated requests to `/admin/login`
- `src/styles/admin-login.css` — Login page styles: carbon black background, orange brand accents, glassmorphism card, light gray inputs per template instructions

### Features — Admin Editor & Newsletter Management

- `src/app/admin/editor/page.tsx` — Create route: split-pane editor with title input, textarea (left), live markdown preview (right), save button with loading/success/error states, empty-title validation, debounce infrastructure for large content
- `src/app/admin/editor/[id]/page.tsx` — Edit route: loads newsletter by ID via `getNewsletter()`, pre-populates editor, updates existing document on save, handles not-found and error states gracefully
- `src/app/admin/newsletters/page.tsx` — Placeholder management page with confirmation heading, descriptive text, logout button that calls `signOut` + DELETE session API + redirect
- `src/components/email/NewsletterPreview.tsx` — Email template preview component: macOS-style traffic light header, white container, renders pre-parsed markdown with `react-markdown` + `rehype-raw`, social links footer, custom `<tip>` block with nested markdown support
- `src/lib/markdown-preparser.ts` — Pure-function pre-parser that transforms custom tags into HTML: `<coment>` to `.coment-line`, `<orange>` to `.newsletter-orange`, `<tip>` to `.newsletter-tip`, `<cta>` to code block; handles unclosed tags, escapes HTML entities
- `src/styles/admin-editor.css` — Glassmorphism split-pane container via CSS Grid, toolbar styles, save/publish buttons, top navigation bar
- `src/styles/newsletter-template.css` — Email template preview: macOS header dots, typography for headings/paragraphs/lists, custom tag styles (coment-line, orange-highlight, tip callout, CTA code block), footer with social links

### Bug Fixes

- `src/styles/globals.css` — Removed trailing whitespace on `--color-brand-comment` declaration
- `src/styles/newsletter-template.css` — Added `overflow-wrap: break-word` and `word-break: break-word` to content area, `white-space: pre-wrap` to code blocks to prevent horizontal overflow

### Configuration

- `.firebaserc` — Firebase project alias configuration
- `firebase.json` — Firebase CLI configuration (Firestore, hosting)
- `firestore.rules` — Dev-mode Firestore security rules (open read/write, locked down in production)
- `pnpm-workspace.yaml` — pnpm workspace settings with allow-builds for `@firebase/util`, `protobufjs`, `sharp`, `unrs-resolver`
- `package.json` — Added dependencies: `firebase` (client SDK), `react-markdown`, `rehype-raw`, `unist-util-visit`
- `pnpm-lock.yaml` — Lockfile update with new transitive dependencies for markdown parsing and Firebase client SDK
- `src/styles/globals.css` — Added `--color-admin-orange` (#F95616) and `--color-admin-carbon` (#1a1a1a) CSS custom properties for admin theme

### SDD Documentation & Developer Tooling

- `skills/pr-creator/SKILL.md` — New skill documenting the PR content creation process for this project
- `openspec/program/newsletter-system.md` — Program-level spec describing the full newsletter system vision, architecture, data model, and phased plan
- `openspec/changes/admin-editor/` — Full SDD artifacts: proposal, 3 spec files (editor interface, markdown pre-parser, newsletter persistence), design doc, task list, and verification report (30/30 scenarios compliant)
- `openspec/changes/archive/2026-06-12-admin-auth/` — Archived SDD artifacts: proposal, 2 spec files (admin-auth, admin-newsletters-placeholder), design doc, task list, and verification report (17/17 scenarios compliant)
- `openspec/specs/admin-auth/spec.md` — Current admin-auth spec (symlink/copy)
- `openspec/specs/admin-newsletters-placeholder/spec.md` — Current admin newsletters placeholder spec

## Impact

- **New protected admin area** at `/admin/*` — unauthenticated users are redirected to `/admin/login`. Admins authenticate via Firebase email/password and receive a 5-day session cookie.
- **Newsletter editor** available at `/admin/editor` (create) and `/admin/editor/{id}` (edit). The split-pane layout gives real-time feedback while composing markdown with custom tags.
- **Newsletter persistence** in Firestore `newsletters` collection with full schema (title, markdown, status, timestamps). Drafts can be created, loaded, and updated.
- **No breaking changes** — existing user-facing routes (`/`, `/subscribe`, etc.) are unaffected. The middleware only activates for `/admin/*` paths.
- **Backward compatible** dependency additions — all new packages (firebase client, react-markdown, rehype-raw) are additive.
- **Known caveat**: The middleware (`src/proxy.ts`) is placed outside the standard `middleware.ts` convention and may need to be moved or re-exported depending on the Next.js version's expectations. The session cookie route uses `firebase-admin` SDK for cookie creation, which works in Node.js runtime but not Edge Runtime.
- The "Publish" (Publicar) button is disabled — actual sending will be implemented in Fase 3.

## Notes

### Testing
1. Create an admin user in Firebase Console > Authentication > Add user
2. Run `pnpm dev` and navigate to `/admin/newsletters` — should redirect to `/admin/login`
3. Login with the created credentials — should redirect to `/admin/newsletters`
4. Click "Open Editor" — verify split-pane renders with textarea and live preview
5. Type markdown with custom tags like `<coment>note</coment>` and `<orange>highlight</orange>` — verify preview updates in real-time
6. Enter a title and click Save — verify success message; check Firestore console for new document
7. Navigate to `/admin/editor/{id}` with the saved document ID — verify content loads
8. Click Logout — verify redirect to `/admin/login`

### Known Follow-up
- **Fase 3** — React Email template + Resend integration for actual newsletter sending
- **Fase 4** — Scheduling via Vercel Cron Jobs
- The debounce infrastructure is wired but the preview update is synchronous (derived state) — the debounce timer is reserved for future server-sync debouncing

### Dependencies
- Requires Firebase project with Authentication (email/password) enabled
- Requires Firebase Admin SDK service account configured in project environment
- Environment variables needed: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`
