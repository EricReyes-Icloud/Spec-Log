# Email Template Specification

## Purpose

React Email component at `src/emails/templates/weekly-newsletter.tsx` that transforms pre-processed newsletter markdown into email-client-compatible HTML using table-based layout with inline styles, ensuring visual parity with the editor preview.

## Requirements

### Requirement: Pipeline Parity

The email template MUST use the same `withLineBreaks` + `preparseMarkdown` pipeline from `@/lib/markdown-preparser` as `NewsletterPreview` to process markdown content before rendering into React Email components.

#### Scenario: Same pipeline produces matching output

- GIVEN markdown with custom tags (`<coment>`, `<orange>`, `<tip>`, `<cta>`)
- WHEN the email template processes the content
- THEN the pre-parser output is identical to what `NewsletterPreview` generates

### Requirement: Unsubscribe Link in Footer

The email template MUST render an unsubscribe link below the decorative comment line (`< !--- Construyendo sistemas reales con IA --- >`). The link SHALL contain a `{unsubscribeToken}` placeholder that the email service replaces per subscriber.

#### Scenario: Unsubscribe link present

- GIVEN a rendered email with subscriber token `ABC123`
- WHEN the email renders
- THEN the footer contains `<a>` with href containing `unsubscribeToken=ABC123`
- AND the link appears after the decorative comment line

### Requirement: Cross-Client HTML Structure

The email template MUST use table-based layout with inline CSS styles for email-client compatibility. The root element MUST be a `<table>`. Font families SHALL use web-safe fallbacks (`Arial, Helvetica, sans-serif` and `Courier New, monospace`).

#### Scenario: Table-based structure

- GIVEN the template renders any content
- THEN the outermost element is a `<table>`
- AND all visual properties are applied via `style=` attributes (no `<style>` blocks)

### Requirement: Content Sections

The template SHALL render these sections: macOS-style header (traffic light dots as colored circles), content area with rendered markdown HTML, footer with social links (GitHub + LinkedIn with text labels), decorative comment line, and unsubscribe link.

#### Scenario: All sections rendered

- GIVEN a newsletter with title "Test" and markdown "Hello"
- WHEN the template renders
- THEN the output includes a header section with three colored dots
- AND a content section containing rendered markdown HTML
- AND a footer with social link text, comment line, and unsubscribe anchor

### Requirement: Newline Robustness

The template SHOULD render gracefully when content arrives with `<br>` markers instead of `\n`. The `withLineBreaks` function SHALL handle both `\n` and `<br>` inputs without producing double line breaks.

#### Scenario: Content with mixed line breaks

- GIVEN content with both `\n` and `<br>` markers
- WHEN `withLineBreaks` processes the content
- THEN no double line breaks appear in the output
- AND rendered email matches visual expectation
