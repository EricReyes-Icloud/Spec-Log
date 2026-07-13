# Delta for email-template

## MODIFIED Requirements

### Requirement: Pipeline Parity

The email template MUST receive content that was processed through the three-step pipeline: `withLineBreaks` → `preparseMarkdown` → unified markdown→HTML from `@/lib/markdown-preparser`. The unified pipeline SHALL use `unified().use(remarkParse).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeStringify, {allowDangerousHtml: true})` to convert markdown syntax (headings, bold, lists) to HTML AFTER custom tag pre-parsing. The `allowDangerousHtml: true` option MUST be passed to BOTH `remarkRehype` and `rehypeStringify` to prevent HTML escaping of the `<span>`, `<div>`, and `<pre>` elements produced by `preparseMarkdown`.
(Previously: pipeline was `withLineBreaks` + `preparseMarkdown` only, no markdown→HTML step)

#### Scenario: Same pipeline produces matching output

- GIVEN markdown with custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`) and markdown syntax (`**bold**`, `## heading`)
- WHEN the email template processes the content
- THEN bold syntax renders as `<strong>` and headings render as `<h2>`/`<h3>`
- AND custom tags are rendered with their expected visual styles

#### Scenario: Dangerous HTML preserved through pipeline

- GIVEN markdown containing raw HTML tags like `<coment>text</coment>`
- WHEN the unified pipeline processes the content with `{allowDangerousHtml: true}`
- THEN raw HTML tags are preserved in the output
- AND `preparseMarkdown` can still transform them in the final step

### Requirement: Cross-Client HTML Structure

The email template MUST use table-based layout with inline CSS styles for email-client compatibility. The root element MUST be a `<table>`. Font families SHALL use web-safe fallbacks (`Arial, Helvetica, sans-serif` and `Courier New, monospace`). The template MAY include an embedded `<style>` block inside the `<Head>` component for CSS classes used in the dynamic content area only. The template's own layout (header dots, wrapper table, footer structure) MUST still use inline styles.
(Previously: all visual properties via inline styles only, no `<style>` blocks allowed)

#### Scenario: Table-based structure with embedded CSS

- GIVEN the template renders any content
- THEN the outermost element is a `<table>`
- AND layout properties use `style=` attributes
- AND a `<style>` block exists inside `<Head>` with CSS classes for content-area elements (`.coment-line`, `.newsletter-orange`, `.align-left`, `.align-center`, `.align-right`, `.newsletter-tip`, `.newsletter-cta`, content typography)

#### Scenario: Style block does not affect layout

- GIVEN the template renders with the embedded `<style>` block
- WHEN an email client strips `<style>` (rare)
- THEN the layout remains intact via inline styles
- AND only content-area custom class styles are lost

### Requirement: Content Sections

The template SHALL render these sections: macOS-style header (traffic light dots as colored circles), content area with rendered markdown HTML, footer with pill-shaped social links (GitHub + LinkedIn) using `Img` icons and monospace text labels with border styling, decorative comment line, and unsubscribe link.
(Previously: footer had social links with text labels only, no pills, no icons)

#### Scenario: All sections rendered with updated footer

- GIVEN a newsletter with title "Test" and markdown "Hello"
- WHEN the template renders
- THEN the output includes a header section with three colored dots
- AND a content section containing rendered markdown HTML
- AND a footer with pill-shaped social links containing `Img` elements and monospace text
- AND social link pills have border styling matching preview design
- AND the decorative comment line and unsubscribe anchor are present
