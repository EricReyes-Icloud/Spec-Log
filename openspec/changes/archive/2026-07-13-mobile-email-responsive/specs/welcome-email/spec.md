# Delta for welcome-email

## ADDED Requirements

### Requirement: Mobile Responsive Width

The WelcomeEmail component MUST render inside a fluid wrapper `<table>` at 100% width with `padding: 24px 4%` on the inner `<td>`. The wrapper table SHALL contain the existing `Container` component which caps at 600px on desktop. The component MUST NOT depend on CSS media queries or `<style>` blocks for its width behavior.

#### Scenario: Fluid wrapper constrains mobile width

- GIVEN a viewport of 375px
- WHEN WelcomeEmail renders
- THEN the outermost element is a `<table>` at 100% width
- AND any `<style>` block inside `<Head>` does NOT contain width-related media queries
- AND the content renders at ~92% of the viewport width

## MODIFIED Requirements

### Requirement: Preview Text

The component SHOULD set preview text to `"Bienvenido a Spec Log"` via React Email's `<Preview>` component.
(Previously: used `<PreviewText>` component)

#### Scenario: Preview text renders

- GIVEN the component renders
- THEN the output contains a preview text element with value `"Bienvenido a Spec Log"`
