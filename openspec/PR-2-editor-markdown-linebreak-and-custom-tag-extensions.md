# Editor: line break fix, markdown rendering, alignment tags, and CTA enhancements

## Description

The newsletter editor's preview had two critical rendering bugs. First, pressing Enter multiple times in the markdown textarea produced an oscillation — even numbers of consecutive presses generated zero `<br>` elements while odd numbers generated exactly one, making paragraph spacing feel broken and unpredictable. Second, block-level markdown syntax (headings, lists, horizontal rules) was being ignored because the old `withLineBreaks()` approach consumed `\n\n` as paragraph boundaries, preventing ReactMarkdown from recognizing them as block elements.

Beyond the bugs, the editor lacked layout control tags (`<left>`, `<center>`, `<right>`) that admins need to structure newsletter content visually, and the `<cta>` code block tag couldn't render styled inline tags like `<orange>` and `<coment>` inside its content.

This PR fixes all three areas: a rewritten line break strategy, new alignment tags, and smarter CTA processing that allows styled spans inside code blocks.

## Changes Made

### Bug Fixes

- `src/components/email/NewsletterPreview.tsx` — Rewrote `withLineBreaks()`: instead of protecting `\n\n` (double newlines), the new approach protects only `\n` before markdown block-level syntax (`#`, `*`, `-`, `>`, `` ``` ``, `~~`) and converts every other `\n` to `<br>\n`. Consecutive newlines are grouped so `<br>` never lands at the start of a line (which would trigger CommonMark HTML block parsing). This eliminates the Enter-press oscillation and allows block elements to render correctly.

- `src/components/email/NewsletterPreview.tsx` — Moved `withLineBreaks()` + `preparseMarkdown()` processing into the component itself instead of requiring pre-processed content from parent pages. Both editor pages (`/admin/editor` and `/admin/editor/[id]`) now pass raw markdown directly.

- `src/app/admin/editor/page.tsx` — Removed `preparseMarkdown()` call from parent component; passes raw `markdown` state to `NewsletterPreview`.

- `src/app/admin/editor/[id]/page.tsx` — Same removal; passes raw `markdown` state to `NewsletterPreview`.

- `src/styles/newsletter-template.css` — Updated macOS dot colors to more vibrant hex values. Reduced heading `line-height` from 1.3 to 1 and `margin-top` from 1.5rem to 1rem. Reduced content `line-height` from 1.7 to 1.5. Adjusted content padding to `1.5rem 2rem` (symmetric). Changed `.coment-line` from `display: block` to `display: inline` and removed `margin-bottom`. Changed tip background from translucent black to brand orange (`#f97416`) and text color to `#1F1F1F`. Added hover state with cursor pointer and lighter orange.

### Features

- `src/lib/markdown-preparser.ts` — Added three new custom alignment tags: `<left>` → `.align-left`, `<center>` → `.align-center`, `<right>` → `.align-right`. Each renders as a `display: block` span so `text-align` distributes content correctly.

- `src/lib/markdown-preparser.ts` — Rewrote `<cta>` tag processing to process `<orange>` and `<coment>` tags inside CTA content first (converting them to HTML spans), protect those spans with placeholders, then HTML-escape the remaining content. This means `<orange>` and `<coment>` render as styled spans inside the code block while everything else stays literal.

- `src/lib/markdown-preparser.ts` — Added consecutive-space preservation: `"hello    world"` now renders with visible gaps via `&nbsp;` replacement.

- `src/styles/newsletter-template.css` — Added `.align-left`, `.align-right`, `.align-center` styles with `display: block` and corresponding `text-align` values.

### Dependencies

- `package.json` — Added `rehype-raw` (was already listed as a dependency in PR-1 but now confirmed resolved in lockfile) and `unist-util-visit`.

- `package-lock.json` / `pnpm-lock.yaml` — Lockfile updates for new transitive dependencies (`entities`, `hast-util-from-parse5`, `hast-util-parse-selector`, `hast-util-raw`, `hast-util-to-parse5`, `hastscript`, `html-void-elements`, `parse5`, `vfile-location`, `web-namespaces`) and `libc` annotations for native packages.

## Impact

- **Line breaks now work correctly**: every Enter press produces a visible `<br>` in the preview, and block-level markdown (headings, lists, blockquotes, code fences, horizontal rules) renders properly because the preceding blank line is preserved.
- **New alignment tags**: `<left>text</left>`, `<center>text</center>`, `<right>text</right>` give admins layout control inline with markdown content.
- **CTA code blocks support styled tags**: `<orange>` and `<coment>` inside `<cta>` blocks now render as styled spans, while all other HTML is escaped for literal code display.
- **Visual polish**: brighter macOS dots, tighter heading spacing, brand-colored tip blocks with hover effect, inline comment lines instead of block-level.
- **Backward compatible**: editor page API is unchanged (still takes `content: string`). Existing newsletters with raw markdown continue to work — the processing pipeline is now self-contained in `NewsletterPreview`.
- **Consecutive spaces preserved**: useful for indentation or ASCII art in newsletters.

## Notes

### Testing

1. Run `pnpm dev` and navigate to `/admin/editor`
2. Type markdown with multiple consecutive Enter presses — confirm each `<br>` appears in preview without oscillation
3. Type a heading (`## Title`), list (`- item`), blockquote (`> quote`), and horizontal rule (`---`) with a blank line before each — confirm they render correctly
4. Type `<left>Left aligned</left>`, `<center>Centered</center>`, `<right>Right aligned</right>` — confirm alignment in preview
5. Type `<cta><orange>const</orange> x: string = "hello"</cta>` — confirm `const` appears orange-highlighted inside the code block while the rest is literal
6. Type `hello    world` (4 spaces) — confirm visible gap renders

### Known Follow-up

- The `unist-util-visit` dependency is installed but not yet used in active code paths — reserved for future AST-level transformations
- Tip block hover cursor suggests interactive behavior (click to expand?) — not implemented yet, just visual styling

### Dependencies

- None beyond those already listed in PR-1 (Firebase project, Admin SDK env vars)
