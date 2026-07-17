# PR-10: README Update and CSS Fixes

## Description

The project README was outdated: it still referenced the old flat file structure (`app/`, `components/`, `lib/` at root level), omitted several key technologies in the stack, and listed components and files that no longer existed. Meanwhile, four email components (`Header.tsx`, `Footer.tsx`, `ReplyBox.tsx`, `CodeComment.tsx`) had been left as empty stubs after earlier refactors, and `Identidad_visual.md` was a duplicate of the already-translated `Visual identity.md`. These inconsistencies made onboarding confusing and the repo harder to navigate.

On top of the documentation cleanup, two visual regressions were identified in the `/spec-log-info` and accordion pages: the back-arrow touch target was too small and had z-index stacking issues on mobile, and the accordion answer max-height was too tight for longer content. This PR addresses both the documentation debt and the UI polish in a single batch since they share the same scope — cleanup and refinement.

## Changes Made

### Documentation

- `README.md` — Rewrote entirely with the current `src/`-based project structure, a complete technology stack table (React 19, Next.js 16, react-email, Firebase Admin, Resend, Tailwind v4, Vercel deployment), updated section responsibilities, a project status tracker (In Development), and accurate file-count badges.
- `Identidad_visual.md` — Deleted. The file was a Spanish duplicate of `Visual identity.md` (already in English), introduced after the visual identity document was translated. The English version is canonical.

### Housekeeping

- `src/components/email/Header.tsx` — Removed (empty stub, 0 bytes).
- `src/components/email/Footer.tsx` — Removed (empty stub, 0 bytes).
- `src/components/email/ReplyBox.tsx` — Removed (empty stub, 0 bytes).
- `src/components/email/CodeComment.tsx` — Removed (empty stub, 0 bytes).

### Styles

- `src/styles/spec-log-info.css`:
  - `.spec-log-info-back`: Added `p-3` for a larger touch target on mobile, `z-index: 20` to fix z-index stacking below overlaying elements, adjusted `mt-[75px]` to `mt-[63px]` and `ml-[20px]` to `ml-[8px]` for better visual alignment on small screens.
  - `.spec-log-info-heading`: Changed `mb-10` to `mb-9` to reduce excess bottom spacing on mobile without affecting the `lg:mb-16` breakpoint.
- `src/styles/spec-log-accordion.css`:
  - `.accordion-question`: Replaced a fixed `font-size: 21px` with responsive `text-[20px] lg:text-[21px]` via Tailwind, so the question text scales down on mobile.
  - `.accordion-answer.open`: Increased `max-height` from `500px` to `550px` to prevent content clipping in answers with longer text.

## Impact

- **Documentation accuracy**: New contributors now see the correct project structure and stack. Obsolete references (`index.ts`, `EmailEditor`, etc.) are gone.
- **Touch UX**: The back-arrow on `/spec-log-info` now has a 12px padding zone around it, making it tappable on mobile without precision aiming. The improved z-index ensures it stays above page chrome.
- **Layout**: Accordion answers with moderate-length content no longer clip at 500px. The question font-size shrinks gracefully on mobile instead of jumping from 21px to an undefined smaller value.
- **Backward compatibility**: All changes are CSS-only or documentation-only. No component APIs, data models, or build artifacts are affected.
- **Risks**: Minimal. The README rewrite drops the old list of components. If any external link referenced those empty files, it will break — but the files were zero-byte stubs, so no real references exist.

## Notes

- **Testing**: Visit `/spec-log-info` on a mobile viewport (375px) and verify: the back-arrow is easily tappable and does not overlap with the heading, the heading bottom spacing looks balanced. On the landing page, toggle an accordion with a multi-paragraph answer — it should expand fully without clipping at 500px. Resize to desktop (1024px+) and confirm all styles match the originals.
- **Follow-up**: No pending issues. The four removed email components can be re-created with actual implementations in a future PR when the email template system is built out.
