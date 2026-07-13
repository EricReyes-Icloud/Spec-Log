# Delta for email-template

## MODIFIED Requirements

### Requirement: Cross-Client HTML Structure

The email template MUST use table-based layout with inline CSS styles for email-client compatibility. The root element MUST be a fluid wrapper `<table>` at 100% width with `role="presentation"`. The fluid wrapper SHALL contain an inner `<td>` with `padding: 24px 4%`, which SHALL contain the inner content `<table>` at `max-width: 600px`. Font families SHALL use web-safe fallbacks (`Arial, Helvetica, sans-serif` and `Courier New, monospace`). The template MAY include an embedded `<style>` block inside the `<Head>` component for CSS classes used in the dynamic content area only. The template's own layout (header dots, wrapper table, footer structure) MUST still use inline styles.
(Previously: root element was a plain `<table>` without fluid wrapper, `padding`, or `role="presentation"`; inner content table had no `max-width` constraint)

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

#### Scenario: Fluid wrapper constrains mobile width

- GIVEN a viewport of 375px
- WHEN the email template renders
- THEN the outermost element is a `<table>` at 100% width
- AND the inner `<td>` has `padding: 24px 4%`
- AND the content appears at ~92% viewport width with vertical margin
