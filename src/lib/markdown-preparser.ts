/**
 * markdown-preparser.ts
 *
 * Pure-function pre-parser that transforms custom tags into standard HTML
 * elements BEFORE react-markdown processes the input.
 *
 * Custom tags:
 *   <coment>texto</coment> → <span class="coment-line">
 *   <orange>texto</orange> → <span class="newsletter-orange">
 *   <tip>contenido</tip>   → <div class="newsletter-tip" data-md="...">
 *                            (content reprocessed as markdown by NewsletterPreview)
 *   <cta>código</cta>      → <pre class="newsletter-cta"><code>
 *                            (content escaped for raw display)
 *
 * Design decisions:
 * - Pure function: no side effects, no DOM access, no network calls.
 * - Unclosed tags pass through unchanged (regex requires closing tag).
 * - The original input is never mutated — returns a new string.
 *
 * @param input — raw markdown string (possibly containing custom tags)
 * @returns transformed string with custom tags converted to HTML elements
 */

// Using [\s\S] instead of . with the s flag for ES2017 compatibility.
// [\s\S] matches any character including newlines, same as /./s.
// Note: (?:<\/tag>|$) handles unclosed tags — while you're still typing the
// closing tag, the content up to the end of input gets transformed immediately.
const COMENT_REGEX = /<coment>([\s\S]*?)(?:<\/coment>|$)/g;
const ORANGE_REGEX = /<orange>([\s\S]*?)(?:<\/orange>|$)/g;
const TIP_REGEX = /<tip>([\s\S]*?)(?:<\/tip>|$)/g;
const CTA_REGEX = /<cta>([\s\S]*?)(?:<\/cta>|$)/g;

export function preparseMarkdown(input: string): string {
  return input
    .replace(COMENT_REGEX, '<span class="coment-line">$1</span>')
    .replace(ORANGE_REGEX, '<span class="newsletter-orange">$1</span>')
    .replace(TIP_REGEX, (_, content: string) => {
      // Escape quotes inside data-md to keep HTML valid
      const escaped = content.replace(/"/g, "&quot;");
      return `<div class="newsletter-tip" data-md="${escaped}"></div>`;
    })
    .replace(CTA_REGEX, (_, content: string) => {
      // Escape HTML entities so code like Array<string> doesn't break parsing
      const escaped = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre class="newsletter-cta"><code>${escaped}</code></pre>`;
    });
}
