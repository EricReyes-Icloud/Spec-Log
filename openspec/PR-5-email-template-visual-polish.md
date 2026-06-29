# PR-5: Email template visual polish and tip rendering fix

## Description

The `WeeklyNewsletter` email template had two distinct problems: (1) icon images in the footer pills relied on PNG files served from the app domain, which failed to render in most email clients (Gmail, Outlook, etc.), leaving empty alt placeholders; (2) newsletter `<tip>` blocks rendered correctly in the JS-powered preview but appeared as empty divs in actual sent emails because the pre-parser stored their content as a `data-md` attribute that only React could hydrate.

For the template, icons were replaced with text-only pill links using a system monospace stack, the base font was bumped to `-apple-system` / `BlinkMacSystemFont` for better cross-client rendering, and the container received visual fallbacks (box-shadow, border, responsive margin). For the tip rendering bug, a new `renderTipBoxes()` function post-processes the HTML at send-time: it extracts the raw markdown from each `data-md` attribute, runs it through the same remark/rehype pipeline, and wraps the result in a `mailto:` link so clicking a tip composes a reply.

## Changes Made

### Bug fixes

- **`src/lib/services/email.ts`** — Added `renderTipBoxes()` to post-process `<div class="newsletter-tip" data-md="...">` elements at send time, rendering their markdown content inline and wrapping the result in a `mailto:` reply link. Integrated the function into the `sendNewsletter` pipeline so the rendered HTML replaces the empty pre-parser div before being passed to the email template.

### Visual / template refinements

- **`src/emails/templates/weekly-newsletter.tsx`** — Removed the `Img` import and the icon paths (`/icono github.png`, `/icono linkedin.png`) from the `SOCIAL_LINKS` config. Footer pills now use `inline-flex` layout with `ui-monospace` / `'Cascadia Code'` / `'Fira Code'` font stack instead of `Courier New`, and no longer reference external images.

- **`src/emails/templates/weekly-newsletter.tsx`** — Replaced `Arial, Helvetica, sans-serif` with the system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) in `main`, `contentCell`, and removed the duplicate font-family rule from `contentCell`. Font-size bumped from `16px` to `17px`, line-height from `1.6` to `1.5`.

- **`src/emails/templates/weekly-newsletter.tsx`** — Added `boxShadow` and `border` to `container` as visual fallbacks for clients that don't support `border-radius` on table elements. Added `marginTop: "24px"` / `marginBottom: "24px"` and `className="email-container"` on the `Container` component. Reduced `contentCell` padding from `1.5rem 2rem` to `0.5rem 2rem`.

- **`src/emails/templates/weekly-newsletter.tsx`** — Extracted the comment marker string into a module-level `COMMENT_LINE_TEXT` constant and removed the inline template literal. Updated `commentLine` style to use the same `ui-monospace` font stack and `#9ca3af` color. Simplified the `Hr` styling to `border: none; border-top: none`.

- **`src/emails/templates/weekly-newsletter.tsx`** — Moved `.newsletter-tip` CSS rules after `.content-area` group, added `margin-top: 0` to `.newsletter-tip p` to prevent excess vertical space in sent emails. Added a `@media (max-width: 600px)` rule that tightens container margin to `12px auto` on mobile.

### Chore

- **`src/lib/markdown-preparser.ts`** — Added a blank line between regex constants and function declaration (cosmetic formatting).

## Impact

- **Tip blocks now render correctly in email**: Subscribers will see `<tip>` content rendered as markdown inside a styled box instead of an empty gap. Clicking the tip area opens a `mailto:` compose window, providing a direct reply channel.
- **No broken images in footer**: The GitHub and LinkedIn pills now display as text-only links with a monospace font, eliminating the blank-image-placeholder issue across all email clients.
- **Better cross-client typography**: The system font stack adapts to each platform's native sans-serif (San Francisco on Apple devices, Segoe UI on Windows, Roboto on Android), improving readability over the generic Arial/Helvetica fallback.
- **Visual parity with preview**: The `renderTipBoxes` pipeline uses the same remark/rehype processing as the in-app preview, so email output now matches what the editor shows.
- **Backward compatible**: All existing props (`htmlContent`, `unsubscribeToken`) remain unchanged. The `SOCIAL_LINKS` array still carries `label` and `href`; only the `icon` field was removed.
- **Risks**: The `renderTipBoxes` regex and entity-decoding logic are sensitive to the exact HTML serialization produced by the pre-parser. If the pre-parser output format changes, the regex may fail to match. The mailto subject line is URL-encoded from the newsletter title; very long titles could produce unwieldy URLs.

## Notes

- **To verify**: Send a test newsletter containing `<tip>` tags to an email address on a major provider (Gmail, Outlook, Proton). Confirm the tip box renders with styled background, inline markdown (bold, links), and that clicking it opens the default mail client with the reply subject pre-filled.
- **Follow-up**: The `renderTipBoxes` entity-decoding logic (`&amp;` → `&`, etc.) duplicates what the pre-parser does on the preview side. Consider extracting a shared decoder utility if more post-processing HTML transforms are added.
- **PR dependency**: This PR builds on the pre-parser (<tip>, <cta>, <orange> custom tags) introduced in earlier PRs. No external deployment dependency.
