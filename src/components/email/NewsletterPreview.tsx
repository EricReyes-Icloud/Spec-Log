"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { preparseMarkdown } from "@/lib/markdown-preparser";
import "@/styles/newsletter-template.css";

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
 * re-processes it through preparseMarkdown + ReactMarkdown so that
 * negritas, <orange>, links, etc. render correctly inside the tip.
 */
function TipBlock({ dataMd }: { dataMd?: string }) {
  if (!dataMd) return null;

  const processed = preparseMarkdown(dataMd);

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
 */
export default function NewsletterPreview({ content }: NewsletterPreviewProps) {
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
          {content}
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
