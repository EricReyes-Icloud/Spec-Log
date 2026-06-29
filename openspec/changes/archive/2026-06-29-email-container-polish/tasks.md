# Tasks: Email Container Polish

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~15 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Core Implementation

Single file — `src/emails/templates/weekly-newsletter.tsx`. Changes are independent (same file, non-overlapping lines).

- [x] 1.1 Add `marginTop: "24px"`, `marginBottom: "24px"`, `boxShadow: "0 4px 12px rgba(0,0,0,0.15)"`, and `border: "1px solid #e0e0e0"` to the `container` CSSProperties object
- [x] 1.2 Add `className="email-container"` to the `<Container style={container}>` element
- [x] 1.3 Append `@media (max-width: 600px) { .email-container { margin: 12px auto !important; } }` to the existing `<style>` block inside `<Head>`

## Phase 2: Verification

- [x] 2.1 Run `npm run build` to confirm TypeScript compiles without errors
- [x] 2.2 Verify the template renders without runtime errors (preview/dev check)
