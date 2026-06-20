# Design: Fix Email Template Rendering

## Technical Approach

Add a unified markdown→HTML step AFTER `preparseMarkdown` in the content pipeline using `unified` + `remark-parse` + `remark-rehype` + `rehype-stringify` with `allowDangerousHtml: true` on both remark-rehype AND rehype-stringify. Adapt layout styles from `newsletter-template.css` to the React Email template: inline styles for structural layout (header dots, container, footer background), embedded `<style>` block inside `<Head>` for content-area CSS classes. Redesign footer social links as pill-shaped `Img` + monospace label with border, matching `NewsletterPreview.tsx`.

## Architecture Decisions

| Decision | Options | Rationale |
|----------|---------|-----------|
| Pipeline order: `withLineBreaks` → `preparseMarkdown` → unified | (a) `withLineBreaks` → unified → `preparseMarkdown`; (b) `withLineBreaks` → `preparseMarkdown` → unified; (c) no markdown step | **(b) chosen.** `remark-parse` does not recognize custom tags (`<coment>`, `<orange>`) as raw HTML — treats them as text and rehype-stringify escapes them to `&#x3C;coment>`. By running `preparseMarkdown` BEFORE unified, custom tags become standard HTML (`<span>`, `<div>`) which unified handles correctly. `allowDangerousHtml: true` must be set on BOTH `remarkRehype` and `rehypeStringify` or rehype-stringify escapes raw HTML anyway. |
| Embedded `<style>` block for content-area CSS, inline styles for layout | (a) All inline styles; (b) all `<style>` block; (c) hybrid | (c) chosen: layout (header dots, container, footer bg) uses inline styles for 100% client compatibility; content-area classes (`.coment-line`, `.newsletter-orange`, alignments, `.newsletter-tip`, `.newsletter-cta`, heading/paragraph/list typography) live in `<style>` inside `<Head>` since they are numerous and rarely stripped. Degrades gracefully if `<style>` is stripped — content remains readable, layout stays intact. |
| `Img` component for social icons with absolute URLs | (a) Base64-encoded SVGs; (b) `Img` from React Email; (c) external image hosting | (b) chosen: `Img` handles absolute URL rendering for email clients. Icons served from the app's domain via `NEXT_PUBLIC_BASE_URL` + `/icono%20github.png`. Base64 bloats the HTML. External hosting adds dependency. |

## Data Flow

```
markdownContent (raw string)
    │
    ▼
withLineBreaks()      ──→ \n → <br>\n (string level)
    │
    ▼
preparseMarkdown()    ──→ <coment> → <span class="coment-line">
                           <orange> → <span class="newsletter-orange">
                           <right> → <span class="align-right">
                           <tip> → <div class="newsletter-tip">
                           <cta> → <pre class="newsletter-cta"><code>
    │
    ▼
unified pipeline      ──→ **bold** → <strong>, ## h → <h2>
  remarkParse              preserves <span>, <div>, <pre> as HTML
  remarkRehype({allowDangerousHtml: true})
  rehypeStringify({allowDangerousHtml: true})
    │
    ▼
WeeklyNewsletter({     ──→ React Email template renders with
  htmlContent,              inline layout styles + <style> block
  unsubscribeToken          + pill footer with Img icons
})                       → render() → email-safe HTML string
    │
    ▼
resend.emails.send()   ──→ Delivered to subscriber
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `rehype-stringify` dependency |
| `src/lib/services/email.ts` | Modify | Insert unified pipeline step AFTER `preparseMarkdown()`, with `allowDangerousHtml: true` on both `remarkRehype` and `rehypeStringify` |
| `src/emails/templates/weekly-newsletter.tsx` | Modify | Add `<Head>` with embedded `<style>` block; convert layout styles to inline; redesign footer with `Img` pills + monospace labels + border |

## Interfaces / Contracts

**No new interfaces.** `WeeklyNewsletterProps` already accepts `htmlContent: string` and `unsubscribeToken: string`. The `sendNewsletter` signature is unchanged — only internal pipeline logic changes.

The embedded `<style>` block in `<Head>` will define these CSS classes (adapted from `newsletter-template.css` content section):

```css
.coment-line { display:inline; font-size:0.80rem; color:#9ca3af; }
.newsletter-orange { color:#F95616; font-weight:600; }
.align-left { display:block; text-align:left; }
.align-center { display:block; text-align:center; }
.align-right { display:block; text-align:right; }
.newsletter-tip { background:#f97416; border-radius:8px; padding:1rem 1.25rem; margin-bottom:1rem; color:#1F1F1F; }
.newsletter-cta { background:#292C2E; border-radius:10px; padding:1rem 1.25rem; margin-bottom:1rem; }
.newsletter-cta code { color:#e0e0e0; font-family:monospace; font-size:0.8125rem; white-space:pre-wrap; }
.content-area h1, .content-area h2, .content-area h3 { margin-top:1rem; margin-bottom:0.75rem; font-weight:700; }
.content-area h1 { font-size:1.5rem; } .content-area h2 { font-size:1.25rem; } .content-area h3 { font-size:1.125rem; }
.content-area p { margin-bottom:1rem; }
.content-area ul, .content-area ol { margin-bottom:1rem; padding-left:1.5rem; }
.content-area li { margin-bottom:0.25rem; }
.content-area strong { font-weight:700; }
.content-area a { color:#F95616; text-decoration:underline; }
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Pipeline order correctness | Test `withLineBreaks → preparseMarkdown → unified` with mixed markdown + custom tags; assert `<strong>`, `<h2>`, `<span class="coment-line">` in output |
| Unit | `allowDangerousHtml` on both remark-rehype and rehype-stringify | Assert custom tags survive pipeline without being escaped to `&#x3C;` entities |
| Visual | Template renders all sections | Render `WeeklyNewsletter` with test content; assert header dots, content div, footer pills + icons + comment line + unsubscribe link in output |
| Visual | Footer pill structure | Assert `Img` elements have absolute `src` URLs, monospace label text, and border styling in rendered HTML |
| Build | Dependency resolution | `npm install` completes; `next build` passes without type errors |

## Open Questions

- [ ] Should social link icon URLs be hardcoded relative to `NEXT_PUBLIC_BASE_URL` or passed as props? Current approach uses `baseUrl` from env var — confirm this is correct for all environments (dev/preview/prod).
- [ ] The `contentCell` padding uses `2rem` which may be large in email — consider reducing to `1.5rem` to match the preview's `1.5rem 2rem 1.5rem` content padding.
