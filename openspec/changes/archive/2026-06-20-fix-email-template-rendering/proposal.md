# Proposal: Fix Email Template Rendering

## Intent

The `weekly-newsletter.tsx` React Email template renders plain/unstyled HTML. Custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, alignment tags) lose their visual styles because CSS classes from `newsletter-template.css` are not available in email clients. Markdown syntax (`**bold**`, `## headings`) is never converted to HTML — shows as raw text. The footer doesn't match the preview's designed social link pills.

## Scope

### In Scope
- Adapt layout styles from `newsletter-template.css` to inline styles in `weekly-newsletter.tsx`
- Add embedded `<style>` block in email `<Head>` for dynamic content area CSS classes
- Process markdown → HTML in the `sendNewsletter` pipeline before passing to the template
- Install `rehype-stringify` for the unified-based markdown conversion
- Update footer to match `NewsletterPreview.tsx`: pill-shaped social links with icons + label
- Custom tags rendered with proper styles in the final email

### Out of Scope
- Changes to the editor preview (`NewsletterPreview.tsx`) — only the email template
- New custom tags — only making existing ones render correctly in email
- Email client compatibility testing beyond inline styles + embedded `<style>`

## Capabilities

### New Capabilities
- `email-rendering`: Complete styling for the React Email template matching the preview's visual fidelity, including custom tag rendering and markdown conversion

### Modified Capabilities
- None — this is a new capability for email output styling

## Approach

1. **Install `rehype-stringify`** — enables unified pipeline for markdown → HTML string conversion
2. **Update `email.ts`** — add `unified().use(remarkParse).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeStringify)` processing step after `withLineBreaks` and before `preparseMarkdown`
3. **Update `weekly-newsletter.tsx`** — convert CSS layout to inline styles, add `<style>` block in `<Head>` for content area CSS classes, update footer with pill-shaped social links using `Img` + monospace text
4. **Verify** — build passes, send test email, visual check

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/emails/templates/weekly-newsletter.tsx` | Modified | Styles, footer, embedded CSS |
| `src/lib/services/email.ts` | Modified | Add markdown→HTML conversion step |
| `package.json` | Modified | Add rehype-stringify dependency |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Transitive dep version mismatch | Low | rehype-stringify is in the same unified ecosystem, pinned compatible version |
| Email client CSS support | Med | Embedded `<style>` blocks widely supported; fallback inline styles for critical layout |

## Rollback Plan

Revert `weekly-newsletter.tsx`, `email.ts`, and `package.json` to previous state. The email will revert to current plain-text rendering.

## Dependencies

- `rehype-stringify` (npm install)

## Success Criteria

- [ ] Build passes without errors
- [ ] `**bold**` renders as `<strong>` in the email output
- [ ] `## heading` renders as `<h2>` in the email output
- [ ] Custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`, `<left>`, `<center>`, `<right>`) render with proper styles in the email
- [ ] Footer pills match the preview design (icons + monospace labels with border)
