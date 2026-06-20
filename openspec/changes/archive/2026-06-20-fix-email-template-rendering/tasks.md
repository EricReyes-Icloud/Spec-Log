# Tasks: Fix Email Template Rendering

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 230–280 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Install `rehype-stringify` as a production dependency via `npm install rehype-stringify`
- [x] 1.2 Add imports to `src/lib/services/email.ts`: `unified`, `remarkParse`, `remarkRehype`, `rehypeStringify`

## Phase 2: Core Implementation

- [x] 2.1 Modify `src/lib/services/email.ts`: insert unified pipeline (`unified().use(remarkParse).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeStringify, {allowDangerousHtml: true})`) AFTER `preparseMarkdown()` — custom tags must be converted to standard HTML first, then markdown syntax is processed. `allowDangerousHtml: true` on BOTH remarkRehype AND rehypeStringify to prevent HTML escaping.
- [x] 2.2 Modify `src/emails/templates/weekly-newsletter.tsx`: add `<Head>` with embedded `<style>` block defining content-area CSS classes (`.coment-line`, `.newsletter-orange`, `.align-left/center/right`, `.newsletter-tip`, `.newsletter-cta`, `.content-area h1/h2/h3/p/ul/ol/li/strong/a`) per design spec
- [x] 2.3 Modify `src/emails/templates/weekly-newsletter.tsx`: wrap content `<div>` in a table-based layout; convert header dots, container, and footer background to inline styles; wrap content area in `<div class="content-area">` for CSS scope
- [x] 2.4 Modify `src/emails/templates/weekly-newsletter.tsx`: redesign footer social links as pill-shaped `<Link>` elements with `Img` icon + monospace label + `1px solid white` border + `borderRadius: 6px`, matching `NewsletterPreview.tsx` pattern

## Phase 3: Verification

- [x] 3.1 Run `npm install` to resolve `rehype-stringify` dependency, then `next build` — verify zero type errors and successful build
