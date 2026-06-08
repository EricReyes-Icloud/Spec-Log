# Proposal: Post-Registro Page (post-registro-page)

## Intent

Create a visual confirmation page shown after successful subscription to Spec Log newsletter. The page displays an animated terminal-style sequence showing verification steps (email verified, subscription created, next edition scheduled) that plays once per session. On refresh, it skips to the final SUCCESS state immediately. This provides user feedback and closes the subscription loop without requiring backend integration.

## Scope

### In Scope
- New `/subscribe` route with client-side animation
- Reuse existing MacHeader and Footer components from spec-log-info
- Dark terminal card with animated dots and sequential checkmarks
- localStorage flag (`animationShown`) to prevent re-animation on refresh
- prefers-reduced-motion media query support
- Comment `spec-log://onboarding` in orange above the card
- Specific text content and color scheme as specified

### Out of Scope
- Backend API integration or real verification
- Standalone entry point (only accessible via post-registration redirect)
- Additional CTAs or navigation beyond the header button
- Persistent storage beyond the animation flag
- Accessibility enhancements beyond basic prefers-reduced-motion

## Capabilities

### New Capabilities
- `subscription-confirmation`: Visual confirmation flow for successful subscription

### Modified Capabilities
- None (reusing existing MacHeader and Footer components without spec changes)

## Approach

Create a new Next.js page at `/app/subscribe/page.tsx` that:
1. Checks localStorage for `animationShown` flag on mount
2. If not shown, runs an animation sequence using useState/useEffect:
   - Initial state: "STATUS: In progress..." with animating dots
   - Sequential appearance of three checkmarks with timed delays
   - Final state: "STATUS: SUCCESS" when all checks complete
3. If shown or prefers-reduced-motion, skips to final SUCCESS state immediately
4. Styles the terminal card using CSS in `/app/styles/post-registro.css` referencing globals.css and using @layer components
5. Reuses MacHeader (with button config) and Footer from existing patterns

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/subscribe/page.tsx` | New | New page component with animation logic |
| `src/styles/post-registro.css` | New | Component-scoped styles for terminal card |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Animation may cause motion sensitivity issues | Low | Implements prefers-reduced-motion check |
| localStorage flag persistence assumptions | Low | Simple boolean flag, acceptable for visual effect |

## Rollback Plan

1. Delete `src/app/subscribe/page.tsx`
2. Delete `src/styles/post-registro.css`
3. No database or backend changes to revert

## Dependencies

- None (purely client-side, uses existing Next.js/React/Tailwind setup)

## Success Criteria

- [ ] Animation plays correctly on first visit after subscription
- [ ] Refresh skips to SUCCESS state immediately
- [ ] prefers-reduced-motion shows all checks instantly
- [ ] Colors and layout match specification exactly
- [ ] Header button navigates to landing page with correct text
- [ ] Comment appears in correct color and position