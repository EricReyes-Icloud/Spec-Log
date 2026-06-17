"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { preparseMarkdown } from "@/lib/markdown-preparser";
import "@/styles/newsletter-template.css";

/**
 * withLineBreaks — converts every \n to <br>\n at the STRING level
 * BEFORE markdown parsing, so that ALL Enter presses (not just the first 2)
 * produce visible line breaks in the final HTML.
 *
 * Why protecting \n\n (double newline) didn't work:
 *   The old approach replaced \n\n → sentinel → <br>\n → \n\n. This caused
 *   oscillation: \n\n was consumed as a paragraph marker, so even numbers of
 *   consecutive Enter presses produced ZERO <br> while odd numbers produced
 *   exactly ONE. The user saw: down, up, down, up.
 *
 * The fix: protect ONLY \n that appears before markdown block-level syntax
 * (headings, lists, blockquotes, code fences). Block elements in markdown
 * need \n\n (a blank line) BEFORE them to be recognized as block syntax.
 * By protecting only those \n, we preserve block structure while converting
 * every other \n to <br>\n.
 *
 *   1. Protect \n before block syntax (headings, lists, quotes, code fences)
 *   2. Replace ALL remaining \n with <br>\n
 *   3. Restore block markers back to \n
 *
 * This eliminates the oscillation: every Enter press produces a <br> unless
 * it precedes a block-level element, in which case the blank line is preserved.
 *
 * Why \n+ (consecutive newlines as a group):
 *   Converting every \n individually to <br>\n puts <br> at the START of a
 *   new line when there are consecutive newlines. In CommonMark, <br> at the
 *   start of a line triggers an HTML block (type 7), which causes ALL inline
 *   markdown syntax (**bold**, *italic*, etc.) to be treated as raw text.
 *   By matching \n+ as a group and emitting <br> repeated N times followed
 *   by a single \n, every <br> stays at the END of its line — never at the
 *   start of a new line — so HTML blocks are never formed.
 */
function withLineBreaks(input: string): string {
  return input
    // Protect \n before markdown block elements (headings, lists, blockquotes, code fences)
    .replace(/\n(?=#{1,6}\s|[*+\-]\s|\d+\.\s|>\s|```|~~)/g, "\x00BLOCK\x00")
    // Convert ALL remaining \n to <br>\n — group consecutive \n so <br> never lands at line start
    .replace(/\n+/g, (match) => "<br>".repeat(match.length) + "\n")
    // Restore block markers back to \n
    .replace(/\x00BLOCK\x00/g, "\n");
}

export interface NewsletterPreviewProps {
  content: string;
}

const SOCIAL_LINKS = [
  { label: "github.com/eric_reyes", href: "https://github.com/EricReyes-Icloud", icon: "/icono github.png" },
  { label: "linkedin.com/in/eric_reyes", href: "https://www.linkedin.com/in/eric-reyes-b96418343/", icon: "/icono linkedin.png" },
];

/**
 * TipBlock
 *
 * Renders <tip> content with NESTED markdown support.
 * The pre-parser stores the raw content in data-md, and this component
 * re-processes it through withLineBreaks + preparseMarkdown + ReactMarkdown
 * so that negritas, <orange>, links, etc. render correctly inside the tip.
 */
function TipBlock({ dataMd }: { dataMd?: string }) {
  if (!dataMd) return null;

  const processed = preparseMarkdown(withLineBreaks(dataMd));

  return (
    <div className="newsletter-tip">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {processed}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Custom div component — intercepts <div class="newsletter-tip"> from the
 * pre-parser output and delegates to TipBlock for nested markdown processing.
 * All other divs render normally.
 */
function CustomDiv({ className, children, ...props }: any) {
  if (typeof className === "string" && className.includes("newsletter-tip")) {
    return <TipBlock dataMd={props["data-md"]} />;
  }
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

/**
 * NewsletterPreview
 *
 * Renders pre-parsed markdown inside an email template mockup:
 * - Static macOS-style header (red/yellow/green traffic light dots)
 * - White background, light gray border + radius
 * - Floating/centered in the parent pane (does NOT fill full width/height)
 * - Footer matching landing page style with social links and custom comment
 *
 * Uses rehype-raw to render HTML produced by the pre-parser,
 * and components to intercept blocks that need nested markdown processing.
 *
 * Line breaks: withLineBreaks() runs BEFORE markdown parsing at the string
 * level, converting each \n to <br>\n while protecting \n that precedes
 * block-level markdown syntax (headings, lists, blockquotes, code fences).
 * This ensures ALL Enter presses produce visible breaks, not just the first 2,
 * without the oscillation of the \n\n protection approach.
 */
export default function NewsletterPreview({ content }: NewsletterPreviewProps) {
  // 1) withLineBreaks — convert every \n to <br>\n (preserving block syntax boundaries)
  // 2) preparseMarkdown — transform custom tags (<coment>, <orange>, <tip>, <cta>,
  //    alignment tags) and preserve consecutive spaces.
  const processed = preparseMarkdown(withLineBreaks(content));

  return (
    <div className="newsletter-template">
      {/* macOS header — static dots only, NO animations */}
      <div className="newsletter-template-header">
        <span className="newsletter-template-dot newsletter-template-dot--red" />
        <span className="newsletter-template-dot newsletter-template-dot--yellow" />
        <span className="newsletter-template-dot newsletter-template-dot--green" />
      </div>

      {/* Markdown content */}
      <div className="newsletter-template-content">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{ div: CustomDiv }}
        >
          {processed}
        </ReactMarkdown>
      </div>

      {/* Footer — matching landing page style */}
      <div className="newsletter-template-footer">
        <div className="newsletter-template-footer-links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className="newsletter-template-footer-link"
            >
              <Image
                src={link.icon}
                alt=""
                width={16}
                height={16}
                className="newsletter-template-footer-icon"
              />
              {link.label}
            </a>
          ))}
        </div>

        <p className="newsletter-template-footer-comment">
          {"< !--- Construyendo sistemas reales con IA --- >"}
        </p>
      </div>
    </div>
  );
}
