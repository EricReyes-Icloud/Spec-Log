# Tasks: Container Width Apple Mail Fix

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 2 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add `width: "100%"` to both container style objects and verify build | PR 1 | Single PR — trivially small, 2-line CSS addition |

## Phase 1: Implementation

- [x] 1.1 In `src/emails/welcome-email.tsx`, add `width: "100%",` to the `container` style object (after line 33, the `maxWidth: "600px"` entry)
- [x] 1.2 In `src/emails/templates/weekly-newsletter.tsx`, add `width: "100%",` to the `container` style object (after line 27, the `maxWidth: "600px"` entry)

## Phase 2: Verification

- [x] 2.1 Run `npm run build` to confirm both templates compile without errors
