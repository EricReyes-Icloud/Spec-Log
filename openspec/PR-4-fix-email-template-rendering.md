# Fix email template rendering: markdown-to-HTML pipeline, embedded CSS, and pill footer

## Description

The `WeeklyNewsletter` React Email template produced plain/unstyled HTML when sent. Custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, alignment tags) lost their visual styles because the CSS classes from `newsletter-template.css` are not available in email clients. Markdown syntax (`**bold**`, `## headings`) was never converted to HTML — subscribers saw raw `**bold**` and `## heading` text instead of styled elements. The footer also did not match the editor preview's pill-shaped social link design.

The underlying cause was a missing pipeline step: the `sendNewsletter` service applied `withLineBreaks()` and `preparseMarkdown()` (which transforms custom tags into standard HTML), but there was no markdown-to-HTML conversion. The template received pre-processed text where `## heading` was still raw markdown syntax, and custom tags like `<coment>` were injected as-is without any styling.

This PR adds a unified-based markdown-to-HTML conversion step between `preparseMarkdown` and the template render, embeds content-area CSS classes in a `<style>` block inside the email `<Head>`, converts all layout styles to inline CSS for email-client compatibility, and redesigns the footer social links as pill-shaped elements with `Img` icons matching the preview.

## Changes Made

### Bug Fixes — Markdown Rendering Pipeline

- `src/lib/services/email.ts` — Inserted a `unified()` pipeline (`remarkParse` + `remarkRehype` + `rehypeStringify`) AFTER `preparseMarkdown` so that custom tags are converted to standard HTML elements first, then markdown syntax is processed. `allowDangerousHtml: true` is passed to BOTH `remarkRehype` and `rehypeStringify` to prevent rehype-stringify from escaping the `<span>`, `<div>`, and `<pre>` elements produced by `preparseMarkdown`. Previously the pipeline was two steps (`withLineBreaks` + `preparseMarkdown` only), which meant `**bold**` and `## heading` passed through as raw text.

### Features — Email Template Styling

- `src/emails/templates/weekly-newsletter.tsx` — Added `<Head>` with an embedded `<style>` block defining CSS classes for the dynamic content area: `.coment-line`, `.newsletter-orange`, `.align-left/center/right`, `.newsletter-tip`, `.newsletter-cta`, and scope-limited typography for `.content-area h1/h2/h3/p/ul/ol/li/strong/a`. Layout-critical styles (header dots, container width, footer background) remain inline so the email degrades gracefully if the email client strips `<style>`.

- `src/emails/templates/weekly-newsletter.tsx` — Wrapped the `dangerouslySetInnerHTML` content div in a `<div class="content-area">` for CSS scoping of typography styles. Updated header dot colors to match the preview (`#FF5457`, `#FFC653`, `#56E75D`), changed header background to `#292C2E`, reduced `contentCell` padding from `2rem` to `1.5rem 2rem`.

### Features — Footer Redesign

- `src/emails/templates/weekly-newsletter.tsx` — Replaced the plain-text social link row with pill-shaped `<Link>` elements containing an `Img` icon + monospace label, styled with `borderRadius: 6px`, `padding: 6px 12px`, and `fontFamily: "Courier New, monospace"`. Social link data is extracted into a `SOCIAL_LINKS` constant with `icon`, `href`, and `label` fields. Icon URLs are built from `NEXT_PUBLIC_BASE_URL` + the icon filename. Updated footer section background to `#292C2E` with `padding: 1rem 1.5rem 1.5rem` to match the preview's dark footer.

### Dependencies

- `package.json` — Added `rehype-stringify ^10.0.1`, `remark-parse ^11.0.0`, `remark-rehype ^11.1.2`, `unified ^11.0.5`. All four packages are from the unified ecosystem and pin compatible major versions. `package-lock.json` and `pnpm-lock.yaml` updated accordingly with transitive dependencies (`hast-util-to-html`, `html-to-text`, `prettier`, `selderee`, etc.).

### SDD Documentation

- `openspec/specs/email-service/spec.md` — Updated the Pipeline + React Email Rendering requirement to include the unified three-step pipeline. Added scenario "Dangerous HTML preserved through full pipeline" to assert custom tags survive the unified step. Documented the pipeline order constraint (`preparseMarkdown` must run BEFORE unified).

- `openspec/specs/email-template/spec.md` — Updated Pipeline Parity requirement to reflect the three-step pipeline. Added "Dangerous HTML preserved through pipeline" scenario. Updated Cross-Client HTML Structure requirement to permit embedded `<style>` block alongside inline styles, with a scenario documenting graceful degradation when `<style>` is stripped. Updated Content Sections and footer-related scenarios to reflect pill-shaped social links with `Img` icons.

## Impact

- **Markdown syntax now renders correctly in sent emails**: `**bold**` becomes `<strong>`, `## heading` becomes `<h2>`, lists render as `<ul>`/`<ol>` with proper spacing. Custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, alignment tags) render with their expected visual styles via the embedded `<style>` block classes.
- **Pipeline order is critical**: `preparseMarkdown` must run BEFORE the unified step. If reversed, `remark-parse` treats `<coment>` as text and `rehype-stringify` escapes it to `&#x3C;coment>`.
- **Graceful degradation for email clients**: Structural layout (header dots, container, footer background) uses inline styles — if the `<style>` block is stripped, content remains readable and layout stays intact. Only content-area custom class styles are lost.
- **Footer matches preview design**: Pill-shaped links with `Img` icons and monospace labels provide consistent branding between the editor preview and the sent email.
- **No breaking changes**: The `WeeklyNewsletterProps` interface is unchanged (`htmlContent: string`, `unsubscribeToken: string`). The `sendNewsletter` function signature is unchanged. Existing drafts remain unaffected.

## Notes

### Testing

1. Run `npm install` to resolve new dependencies, then `next build` — verify zero TypeScript errors.
2. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_BASE_URL` in `.env.local`.
3. Create a newsletter with mixed content: markdown syntax (`**bold**`, `## heading`, `- list items`) and custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, `<left>`, `<center>`, `<right>`).
4. Publish the newsletter and inspect the received email in an email client and/or the Resend dashboard logs.
5. Verify that `**bold**` renders as bold, `## heading` renders as a heading, and custom tags display with styled backgrounds/borders/colors.
6. Verify footer pills show icons with monospace labels.
7. If troubleshooting: check that the rendered HTML output (visible in Resend logs or by calling `render(WeeklyNewsletter({...}))` in isolation) contains `<strong>`, `<h2>`, and `class="coment-line"` / `class="newsletter-orange"` attributes.

### Known Follow-ups

1. **Social icon hosting**: Icons are served from `NEXT_PUBLIC_BASE_URL/icono%20github.png`. These files need to be added to the public directory or an asset host. Currently they reference placeholder filenames — verify the files exist at the expected paths in all deployed environments.
2. **Email client testing**: The embedded `<style>` block approach is widely supported (Gmail, Outlook.com, Apple Mail) but Outlook desktop (Word rendering engine) ignores `<style>` and only reads inline styles. Layout should survive; content-area custom classes will not apply in Outlook desktop. This is an acceptable tradeoff per the design decision.

### Dependencies

- Requires `NEXT_PUBLIC_BASE_URL` environment variable for constructing social icon absolute URLs and the unsubscribe link.
- Social icon image files need to exist in the public directory at the paths referenced in `SOCIAL_LINKS`.
