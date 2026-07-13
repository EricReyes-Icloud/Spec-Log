# Tasks: Mobile Email Responsive

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 40–60 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Fluid wrapper + cleanup on both email templates | PR 1 | Single PR; ~40-60 lines changed across 2 files |

## Phase 1: Fluid Wrapper — welcome-email.tsx

- [x] 1.1 In `src/emails/welcome-email.tsx`, wrap `<Container>` (line 187) and all its children in an outer `<table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: "100%", borderCollapse: "collapse" }}>` with a `<tr><td style={{ padding: "24px 4%" }}>` around the `<Container>`. Close `</td></tr></table>` after `</Container>` (after line 373).
- [x] 1.2 Remove `className="email-container"` from `<Container>` on line 187 (keep `<Container style={container}>`).
- [x] 1.3 Remove the entire `<style>` block and its contents from `<Head>` (lines 175–183). Replace with self-closing `<Head />` since no other content remains in `<Head>`.
- [x] 1.4 Run `npm run build` to verify compilation.

## Phase 2: Fluid Wrapper — weekly-newsletter.tsx

- [x] 2.1 In `src/emails/templates/weekly-newsletter.tsx`, wrap `<Container>` (line 146) and all its children in an outer `<table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: "100%", borderCollapse: "collapse" }}>` with a `<tr><td style={{ padding: "24px 4%" }}>` around the `<Container>`. Close `</td></tr></table>` after `</Container>` (after line 263).
- [x] 2.2 Remove `className="email-container"` from `<Container>` on line 146 (keep `<Container style={container}>`).
- [x] 2.3 Remove only the `@media (max-width: 600px) { .email-container { margin: 12px auto !important; } }` block (lines 139–141) from the `<style>` content. Keep all other CSS classes (`.coment-line`, `.newsletter-orange`, `.align-*`, `.newsletter-cta`, `.content-area`, `.newsletter-tip`).
- [x] 2.4 Run `npm run build` to verify compilation.

## Phase 3: Verification

- [x] 3.1 Run `npm run build` — must pass with zero errors.
- [x] 3.2 Verify both files render correctly by checking the build output for `welcome-email` and `weekly-newsletter` without warnings.
