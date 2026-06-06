# Proposal: Spec Log Info Page (`/spec-log-info`)

## Intent

Landing page introduces Spec Log at a glance, but visitors who want the full story have nowhere to read it. Add a second route (`/spec-log-info`) with a classic accordion answering the nine "Sección `{ }` spec-log" questions from `Identidad_visual.md`.

## Scope

### In Scope
- New route `src/app/spec-log-info/page.tsx` and `SpecLogAccordion` client component (one-open-at-a-time)
- Extend `MacHeader` with `showTimer`, `buttonHref`, `buttonText` (defaults preserve current behavior)
- New CSS files `spec-log-info.css`, `spec-log-accordion.css`
- Reuse existing `Footer` as-is

### Out of Scope
- Authoring answer copy (left empty for the user)
- Backend, persistence, search, analytics, i18n
- Editing `Identidad_visual.md` (consumed as visual spec only)

## Capabilities

### New Capabilities
- `spec-log-info-page`: Second route answering the nine brand questions via an accordion.

### Modified Capabilities
- `landing-header`: `MacHeader` becomes configurable per-page; landing behavior stays the default.

## Capabilities

### New Capabilities
- `spec-log-info-page`: Second route answering the nine brand questions via an accordion.

### Modified Capabilities
- `landing-header`: `MacHeader` becomes configurable per-page; landing behavior stays the default.

## Approach

1. Add three optional props to `MacHeader` with current values as defaults; when `showTimer` is false, render a spacer `<div>` so the grid stays balanced.
2. `src/app/spec-log-info/page.tsx` is a server component: `MacHeader` (no timer, button `{ } landing` → `/`), heading "Descubre todo sobre **Spec Log**" (orange), `SpecLogAccordion`, `Footer`.
3. `SpecLogAccordion` is `"use client"` with `openIndex: number | null`; clicking toggles and closes any other open item. Chevron `▸` / `▾`; clickable on chevron or bold text.
4. CSS colocated per file in `src/styles/`; reuse `--color-brand-orange` and `--color-brand-carbon`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/spec-log-info/page.tsx` | New | FAQ route |
| `src/components/landing/SpecLogAccordion.tsx` | New | Client accordion |
| `src/components/landing/MacHeader.tsx` | Modified | Adds 3 props |
| `src/styles/spec-log-info.css` | New | Layout + heading |
| `src/styles/spec-log-accordion.css` | New | Item + chevron |
| `src/app/page.tsx` | Unchanged | Landing uses defaults |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `MacHeader` prop change breaks landing | Low | All props optional; landing call site untouched |
| Brand tokens missing in `globals.css` | Low | Audit before apply; declare if absent |
| Empty answer strings ship to production | Med | Spec marks answers as `""` so user must author before merge |

## User Decisions Captured

1. **Answers**: left as empty strings for the user to author
2. **Route**: `/spec-log-info`
3. **Behavior**: classic — only one open at a time
4. **Heading**: "Descubre todo sobre Spec Log", "Spec Log" in brand orange, no terminal prompt

## Rollback Plan

All changes are additive: new route, new component, additive prop defaults. Revert with `git revert <commit>`. Landing call site is untouched.

## Success Criteria

- [ ] `/spec-log-info` renders MacHeader (no timer, `{ } landing` → `/`), heading, nine-question accordion, Footer
- [ ] Classic accordion: opening one item closes any other
- [ ] Landing page `/` is visually identical to pre-change
- [ ] `next build` succeeds with no new warnings
