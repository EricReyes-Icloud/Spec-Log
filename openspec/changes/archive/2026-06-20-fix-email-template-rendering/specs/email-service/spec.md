# Delta for email-service

## MODIFIED Requirements

### Requirement: Pipeline + React Email Rendering

The service MUST apply `withLineBreaks()`, then `preparseMarkdown()`, then convert markdown to HTML using `unified().use(remarkParse).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeStringify, {allowDangerousHtml: true})` to newsletter markdown, render the result via the React Email `weekly-newsletter` template, and produce email-safe HTML using `@react-email/render`. The `allowDangerousHtml: true` option MUST be passed to BOTH `remarkRehype` and `rehypeStringify`.
(Previously: pipeline was `withLineBreaks()` then `preparseMarkdown()` only, no markdown→HTML step)

#### Scenario: Renders to valid HTML with markdown conversion

- GIVEN newsletter with markdown content containing `**bold**` and `## heading`
- WHEN the service renders the template
- THEN a valid email HTML string is returned
- AND the output contains `<strong>` and `<h2>` elements from markdown syntax
- AND no rendering exceptions occur

#### Scenario: Dangerous HTML preserved through full pipeline

- GIVEN newsletter markdown containing raw HTML tags (`<coment>`, `<orange>`)
- WHEN the service renders the template
- THEN raw HTML custom tags are preserved in the output
- AND `preparseMarkdown` must run BEFORE the unified step so that custom tags are converted to standard HTML before markdown parsing
