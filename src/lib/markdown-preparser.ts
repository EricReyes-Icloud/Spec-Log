/**
 * markdown-preparser.ts
 *
 * Pure-function pre-parser that transforms custom tags into standard HTML
 * elements BEFORE react-markdown processes the input.
 *
 * Also exports `withLineBreaks` — converts every \n to <br>\n at the STRING
 * level before markdown parsing, so that ALL Enter presses produce visible
 * line breaks in the final HTML.
 *
 * withLineBreaks:
 *   Why protecting \n\n (double newline) didn't work:
 *     The old approach replaced \n\n → sentinel → <br>\n → \n\n. This caused
 *     oscillation: \n\n was consumed as a paragraph marker, so even numbers of
 *     consecutive Enter presses produced ZERO <br> while odd numbers produced
 *     exactly ONE. The user saw: down, up, down, up.
 *
 *   The fix: protect ONLY \n that appears before markdown block-level syntax
 *   (headings, lists, blockquotes, code fences). Block elements in markdown
 *   need \n\n (a blank line) BEFORE them to be recognized as block syntax.
 *   By protecting only those \n, we preserve block structure while converting
 *   every other \n to <br>\n.
 *
 *     1. Protect \n before block syntax (headings, lists, quotes, code fences)
 *     2. Replace ALL remaining \n with <br>\n
 *     3. Restore block markers back to \n
 *
 *   This eliminates the oscillation: every Enter press produces a <br> unless
 *   it precedes a block-level element, in which case the blank line is preserved.
 *
 *   Why \n+ (consecutive newlines as a group):
 *     Converting every \n individually to <br>\n puts <br> at the START of a
 *     new line when there are consecutive newlines. In CommonMark, <br> at the
 *     start of a line triggers an HTML block (type 7), which causes ALL inline
 *     markdown syntax (**bold**, *italic*, etc.) to be treated as raw text.
 *     By matching \n+ as a group and emitting <br> repeated N times followed
 *     by a single \n, every <br> stays at the END of its line — never at the
 *     start of a new line — so HTML blocks are never formed.
 *
 * Custom tags:
 *   <coment>texto</coment>  → <span class="coment-line">
 *   <orange>texto</orange>  → <span class="newsletter-orange">
 *   <left>contenido</left>  → <span class="align-left">contenido</span>
 *   <right>contenido</right> → <span class="align-right">contenido</span>
 *   <center>contenido</center> → <span class="align-center">contenido</span>
 *   <tip>contenido</tip>    → <div class="newsletter-tip" data-md="...">
 *                            (content reprocessed as markdown by NewsletterPreview)
 *   <cta>código</cta>      → <pre class="newsletter-cta"><code>
 *                            (content escaped for raw display;
 *                             <orange> and <coment> inside are NOT escaped —
 *                             they render as styled spans within the code block)
 *
 * Design decisions:
 * - CTA is processed FIRST so inner <orange>/<coment> tags are converted to spans
 *   and protected before the rest of the CTA content is HTML-escaped.
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
const LEFT_REGEX = /<left>([\s\S]*?)(?:<\/left>|$)/g;
const RIGHT_REGEX = /<right>([\s\S]*?)(?:<\/right>|$)/g;
const CENTER_REGEX = /<center>([\s\S]*?)(?:<\/center>|$)/g;
const TIP_REGEX = /<tip>([\s\S]*?)(?:<\/tip>|$)/g;
const CTA_REGEX = /<cta>([\s\S]*?)(?:<\/cta>|$)/g;


export function preparseMarkdown(input: string): string {
  return input
    // CTA first — processes inner <orange> and <coment> into spans, then escapes
    // the remaining HTML so code displays literally while tags render as styled spans.
    .replace(CTA_REGEX, (_, content: string) => {
      // 1. Convert allowed tags to spans FIRST (inline regexes to avoid lastIndex issues)
      const withSpans = content
        .replace(/<coment>([\s\S]*?)(?:<\/coment>|$)/g, '<span class="coment-line">$1</span>')
        .replace(/<orange>([\s\S]*?)(?:<\/orange>|$)/g, '<span class="newsletter-orange">$1</span>');

      // 2. Protect spans with unique placeholders
      const spans: string[] = [];
      const withPlaceholders = withSpans.replace(
        /(<span[^>]*>[\s\S]*?<\/span>)/g,
        (match) => {
          spans.push(match);
          return `\x00CTA_SPAN_${spans.length - 1}\x00`;
        },
      );

      // 2b. Revert <br> back to \n — withLineBreaks() runs before preparseMarkdown,
      // so every \n is already converted to <br>\n. Inside CTA we want real newlines
      // (rendered via CSS white-space: pre-wrap) instead of literal &lt;br&gt; text.
      const withNewlines = withPlaceholders
        .replace(/<br>\n/g, '\n')
        .replace(/<br>/g, '\n');

      // 3. Escape HTML in the unprotected text
      const escaped = withNewlines
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // 4. Restore protected spans
      const restored = escaped.replace(
        /\x00CTA_SPAN_(\d+)\x00/g,
        (_, idx) => spans[parseInt(idx)],
      );

      return `<pre class="newsletter-cta"><code>${restored}</code></pre>`;
    })
    // Then COMENT and ORANGE outer processing (handles tags OUTSIDE CTA).
    // Content inside CTA blocks is already wrapped so these won't match it.
    .replace(COMENT_REGEX, '<span class="coment-line">$1</span>')
    .replace(ORANGE_REGEX, '<span class="newsletter-orange">$1</span>')
    .replace(LEFT_REGEX, '<span class="align-left">$1</span>')
    .replace(RIGHT_REGEX, '<span class="align-right">$1</span>')
    .replace(CENTER_REGEX, '<span class="align-center">$1</span>')
    .replace(TIP_REGEX, (_, content: string) => {
      // Escape quotes inside data-md to keep HTML valid
      const escaped = content.replace(/"/g, "&quot;");
      return `<div class="newsletter-tip" data-md="${escaped}"></div>`;
    })
    // Preserve consecutive spaces so "hello    world" renders with visible gaps.
    // Must run AFTER all escaping is done so & doesn't get double-escaped.
    .replace(/ {2,}/g, (match) => "&nbsp;".repeat(match.length));
}

/**
 * Convert every \n to <br>\n at the STRING level, preserving block-level
 * markdown syntax boundaries (headings, lists, blockquotes, code fences).
 *
 * Run BEFORE markdown parsing so every Enter press produces a visible <br>,
 * not just double-newlines.
 */
export function withLineBreaks(input: string): string {
  return input
    // Protect \n before markdown block elements
    .replace(/\n(?=#{1,6}\s|[*+\-]\s|\d+\.\s|>\s|```|~~)/g, "\x00BLOCK\x00")
    // Convert ALL remaining \n to <br>\n — group consecutive \n
    .replace(/\n+/g, (match) => "<br>".repeat(match.length) + "\n")
    // Restore block markers back to \n
    .replace(/\x00BLOCK\x00/g, "\n");
}
