# PR-6: Responsive mobile adaptation, welcome email, and terminal visual fixes

## Description

The landing page and subscription flow were built desktop-first with fixed pixel values for padding, font sizes, and layout dimensions. On narrow viewports (320-640px), text overflowed containers, cards clipped off-screen, the terminal divider rendered horizontally instead of vertically, and the footer links wrapped poorly. These issues made the site unusable on mobile devices.

This PR introduces responsive breakpoints across all landing page and post-registration sections, moving from fixed values to a mobile-first approach with `lg:` and `sm:` Tailwind breakpoints. The terminal split-pane layout in `WhySpecLog` switches from side-by-side to stacked on narrow screens, and the horizontal divider line becomes a proper vertical separator that adapts at the `lg:` breakpoint.

Additionally, a new `WelcomeEmail` component and `sendWelcomeEmail` service function are introduced so new subscribers receive a branded welcome email upon registration. The subscription page animation was reworked to play on every visit (removing the `localStorage` gate), and a "back to landing" CTA button fades in after the sequence completes.

## Changes Made

### Features

- **`src/emails/welcome-email.tsx`** (new) — React Email component for the welcome message sent to new subscribers. Uses the same macOS-style header, system font stack, and pill-link footer as `WeeklyNewsletter`.
- **`src/utils/mailto.ts`** (new) — Extracted `createReplyMailto()` helper that encodes a reply subject into a `mailto:` URL. Used by both `WelcomeEmail` and `renderTipBoxes` in `email.ts`.
- **`src/lib/services/email.ts`** — Added `sendWelcomeEmail()` function that renders `WelcomeEmail` via `@react-email/render` and sends through Resend. Replaced inline `mailto:` construction in `renderTipBoxes` with the shared `createReplyMailto` utility.
- **`src/app/api/subscribe/route.ts`** — Calls `sendWelcomeEmail()` after writing the subscriber document to Firestore. Failure is logged but never blocks the 201 response.
- **`src/app/subscribe/page.tsx`** — Removed `localStorage` animation gate so the confirmation animation plays on every visit. Added a "Volver a la landing" link that fades in after the animation completes. Enabled the timer in `MacHeader` and passed a custom comment to `Footer`.

### Responsive mobile adaptation

- **`src/styles/globals.css`** — Added `min-width: 320px` and `overflow-x: hidden` on `html` to prevent horizontal scroll on narrow devices.
- **`src/styles/hero.css`** — Title scales from `32px` to `55px`, description from `17px` to `20px`. Layout switches from column to row at `lg:` (was `md:`). Image wrapper follows the same breakpoint.
- **`src/styles/mac-header.css`** — Dots shrink from `4x4` to `3x3` on mobile, padding tightens from `px-6 py-4` to `px-4 py-3`. Timer gets `px-5` for breathing room.
- **`src/styles/what-you-get.css`** — Section padding drops from `p-16` to `p-7`. Title scales `32px→42px`, description `18px→21px`, card headings `25px→28px`. Cards stack vertically below `lg:`. Terminal body padding `p-7 lg:p-10`.
- **`src/styles/why-spec-log.css`** — Heading/text scale `35px→42px` / `18px→20px`. Arrow box steps through three breakpoints (`max-width: 280px→360px→430px`). Terminal body switches `flex-direction: column` below `lg:`. Terminal pane uses `whitespace-pre-wrap` on mobile, `pre` on desktop.
- **`src/styles/tech-log.css`** — Heading scales `35px→42px`, comment and heading get `margin-left: 10px` for mobile alignment. Card title scales `24px→26px` at `lg:`.
- **`src/styles/end-log.css`** — Section padding `px-4 py-8` to `lg:px-18 lg:py-20`. Terminal line uses `pre-wrap` below `lg:`. CTA button goes full-width on mobile.
- **`src/styles/post-registro.css`** — Heading scales `35px→50px`, paragraph `18px→20px`. Terminal card gets `min-width: 340px`.
- **`src/styles/spec-log-info.css`** — Back arrow repositioned from absolute pixel offsets to responsive `mt-[75px] lg:mt-[125px] ml-[20px] lg:ml-[150px]`. Heading scales `35px→45px`.
- **`src/styles/about-section.css`** — Layout switches from `grid` to `flex flex-col` below `lg:`, reverting to grid at desktop. Photo sizes step `230px→250px→300px` across breakpoints. Heading scales `35px→42px`.
- **`src/styles/footer.css`** — Links switch to `flex-row flex-wrap` with tighter `gap-1 sm:gap-2` and smaller padding/text on mobile. Icon sizes shrink proportionally.

### Terminal visual fixes

- **`src/components/landing/WhySpecLog.tsx`** — Replaced hard-coded whitespace string (`"           "`) for the "certificación" indentation with `paddingLeft: "11ch"` so the alignment is resilient to font rendering differences.
- **`src/styles/why-spec-log.css`** — Fixed terminal divider: was `width: 1px` (horizontal line), now `width: 100%; height: 1px` (horizontal on mobile) switching to `width: 1px; height: auto; align-self: stretch` at `lg:` (vertical on desktop).

### Component refinements

- **`src/components/landing/AboutSection.tsx`** — Replaced the gray placeholder `div` with an `<Image>` component rendering `/Foto profesional.png` at 250x250.
- **`src/components/landing/Footer.tsx`** — Added optional `comment` prop to allow per-page footer text overrides.
- **`src/emails/templates/weekly-newsletter.tsx`** — Added `footerPillIcon` style object for consistent icon sizing in email pills.

### Dev tooling

- **`package.json`** — Added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, and `jsdom` as dev dependencies.
- **`vitest.config.ts`** (new) — Vitest configuration file.

### Spec updates

- **`openspec/specs/email-service/spec.md`** — Updated to document `sendWelcomeEmail` behavior.
- **`openspec/specs/subscription-api/spec.md`** — Updated to document welcome email dispatch on subscription.

## Impact

- **Mobile usability**: The entire landing page and subscription flow are now functional and visually coherent from 320px up to wide desktop. No horizontal overflow, no clipped cards, no text overflow.
- **Welcome email flow**: New subscribers now receive a branded welcome email immediately after registration. The email uses the same visual language as the weekly newsletter (macOS header, system fonts, monospace footer pills). Email send failure is non-blocking — the subscription still succeeds.
- **Terminal accuracy**: The divider line in `WhySpecLog` now renders as a proper vertical separator on desktop, fixing the visual bug where it appeared as a thin horizontal line spanning the terminal width.
- **Subscribe page UX**: The animation plays on every visit instead of only the first, giving returning visitors the full visual experience. The "Volver a la landing" button provides a clear exit path after the animation completes.
- **Backward compatible**: All existing component props are preserved. `Footer` gained an optional `comment` prop with a default fallback. The `sendWelcomeEmail` import in `route.ts` is additive.
- **Risks**: The `WelcomeEmail` uses a hard-coded sender address (`onboarding@resend.dev`) that should be moved to an environment variable for production. The animation timing changes in `page.tsx` may feel slower on fast connections — worth A/B testing if conversion metrics matter.

## Notes

- **To verify responsive**: Resize the browser to 375px width (iPhone SE) and step through each section: hero, what-you-get, why-spec-log, tech-log, end-log, footer. Confirm no horizontal scroll, readable text, and properly stacked cards.
- **To verify welcome email**: Subscribe with a test email address and confirm the welcome email arrives with the macOS header, welcome content, reply tip section, and footer links rendering correctly.
- **To verify terminal divider**: View the WhySpecLog section at full desktop width and confirm a thin vertical gray line separates the left and right panes. On mobile, confirm the line becomes horizontal above the stacked panes.
- **Follow-up**: Move the hard-coded `senderEmail` in `sendWelcomeEmail` to `process.env.WELCOME_EMAIL_FROM` for production. Consider extracting the animation sequence in `page.tsx` into a custom hook for testability.
- **PR dependency**: Builds on the email service infrastructure from PR-5.
