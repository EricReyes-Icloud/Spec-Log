# Tasks: Admin Editor Split Pane + Markdown + Preview

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~351 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Install `react-markdown` dependency in `package.json`
- [x] 1.2 Create `src/lib/markdown-preparser.ts` — pure function `preparseMarkdown()` with two regex replacements (`<coment>` → `.coment-line`, `<heading>` → `<h2>`), handling unclosed tags gracefully
- [x] 1.3 Create `src/styles/admin-editor.css` — glassmorphism container, CSS Grid split pane (`1fr 1fr`), light gray `border-r` divider, full viewport height
- [x] 1.4 Create `src/styles/newsletter-template.css` — macOS traffic light dots (static), white template background, light gray border + radius, footer styles
- [x] 1.5 Extend `src/lib/firebase-client.ts` — add `getFirestore()` import, cache Firestore instance, export `Newsletter` interface and functions `createNewsletter()`, `updateNewsletter()`, `getNewsletter()`

## Phase 2: Core Editor

- [x] 2.1 Create `src/components/email/NewsletterPreview.tsx` — email template wrapper with static macOS header (red/yellow/green dots), white background container, gray border, footer `"<!-- construyendo sistemas reales con IA -->"`, renders pre-parsed markdown via `react-markdown`
- [x] 2.2 Create `src/app/admin/editor/page.tsx` — new editor route (no ID), renders `<Editor />` with textarea + live preview split pane, conditional debounce (≤1000 chars immediate, >1000 chars debounced 300ms), save button with loading/success states, title input, validation for empty title
- [x] 2.3 Create `src/app/admin/editor/[id]/page.tsx` — edit route, loads newsletter by ID via `getNewsletter()`, renders `<Editor />` with pre-populated data, save button updates existing document instead of creating new one, error state for non-existent docs

## Phase 3: Verification

- [x] 3.1 Smoke test — run `next build` and confirm zero TypeScript/compilation errors
- [ ] 3.2 Manual: navigate `/admin/editor`, verify split pane renders with glassmorphism, textarea + preview both visible, divider present
- [ ] 3.3 Manual: type markdown in textarea, confirm preview updates in real-time; type `<coment>test</coment>` and `<heading>test</heading>`, verify transforms render correctly
- [ ] 3.4 Manual: save a newsletter with title and markdown, confirm document appears in Firestore console with correct schema; save with empty title, confirm validation error blocks save
- [ ] 3.5 Manual: navigate `/admin/editor/{id}` with a valid ID, confirm content loads; navigate with invalid ID, confirm error state
