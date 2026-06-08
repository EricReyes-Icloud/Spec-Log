# Tasks: Post-Registro Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200-300 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Create `/subscribe` page with animation | PR 1 | Single PR, 2 new files, 0 modified |

## Phase 1: Core Implementation

- [x] 1.1 Create `src/styles/post-registro.css` — @reference globals.css, @layer components, terminal card (#000 bg, #FFF text), dot @keyframes, status colors
- [x] 1.2 Create `src/app/subscribe/page.tsx` — "use client", AnimState type, useState/useEffect animation machine, localStorage gate, prefers-reduced-motion check, MacHeader/Footer composition

## Phase 2: Verification

- [ ] 2.1 Visit `/subscribe` fresh — confirm 3 checkmarks at ~1.5s intervals, SUCCESS at end
- [ ] 2.2 Refresh during animation — confirm SUCCESS immediately, all checks visible
- [ ] 2.3 Enable prefers-reduced-motion: reduce — confirm SUCCESS immediately
- [ ] 2.4 Inspect colors: bg #000, labels #FFF, "In progress..." #FFD700, SUCCESS/checks #50C878, comment #F95616
- [ ] 2.5 Verify MacHeader: showTimer=false, buttonHref="/", buttonText="landing"
- [ ] 2.6 Navigate away and back — confirm SUCCESS immediately (flag persisted)
