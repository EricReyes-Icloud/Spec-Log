# Welcome Email Specification

## Purpose

React Email template component (`WelcomeEmail`) that renders a static welcome email sent to new subscribers after registration. Uses static JSX only — no `dangerouslySetInnerHTML`, no markdown pipeline, no name personalization.

## Requirements

### Requirement: Component Interface

The `WelcomeEmail` component MUST accept `WelcomeEmailProps` with exactly one field: `unsubscribeToken: string`. It MUST NOT accept `htmlContent` or any content-injection props.

#### Scenario: Renders with valid unsubscribeToken

- GIVEN `WelcomeEmail` rendered with `unsubscribeToken: "ABC12345"`
- WHEN the component renders
- THEN valid React Email JSX is produced
- AND the unsubscribe link contains `ABC12345`

### Requirement: Static JSX Content Structure

The component MUST render content in this order: comment header line, title, custom tags row, tip section, footer with social pills and unsubscribe link. All content MUST be static JSX. The component MUST NOT use `dangerouslySetInnerHTML`.

#### Scenario: Content sections in correct order

- GIVEN the component renders
- THEN output begins with the comment header line
- AND title appears before custom tags
- AND custom tags appear before the tip section
- AND footer (social pills + unsubscribe) is last

#### Scenario: No dangerouslySetInnerHTML

- GIVEN the component source
- WHEN inspected
- THEN `dangerouslySetInnerHTML` is absent from all JSX elements

### Requirement: Unsubscribe Link

The component MUST render an unsubscribe link pointing to the token-based unsubscribe endpoint. The link MUST include the `unsubscribeToken` value.

#### Scenario: Token in unsubscribe URL

- GIVEN `unsubscribeToken: "XYZ98765"`
- WHEN the component renders
- THEN the unsubscribe `<a>` element's `href` contains `XYZ98765`

### Requirement: Preview Text

The component SHOULD set preview text to `"Bienvenido a Spec Log"` via React Email's `<Preview>` component.
(Previously: used `<PreviewText>` component)

#### Scenario: Preview text renders

- GIVEN the component renders
- THEN the output contains a preview text element with value `"Bienvenido a Spec Log"`

### Requirement: Mobile Responsive Width

The WelcomeEmail component MUST render inside a fluid wrapper `<table>` at 100% width with `padding: 24px 4%` on the inner `<td>`. The wrapper table SHALL contain the existing `Container` component which caps at 600px on desktop. The component MUST NOT depend on CSS media queries or `<style>` blocks for its width behavior.

#### Scenario: Fluid wrapper constrains mobile width

- GIVEN a viewport of 375px
- WHEN WelcomeEmail renders
- THEN the outermost element is a `<table>` at 100% width
- AND any `<style>` block inside `<Head>` does NOT contain width-related media queries
- AND the content renders at ~92% of the viewport width
