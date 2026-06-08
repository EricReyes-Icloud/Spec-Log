# Subscription Confirmation Specification

## Purpose

Visual confirmation flow displayed after successful newsletter subscription. Shows an animated terminal-style sequence of verification checks (email verified, subscription created, next edition scheduled) that plays once per session, then transitions to a persistent SUCCESS state.

## Requirements

### Requirement: Page Layout

The page MUST render the MacHeader (showTimer=false, buttonHref="/", buttonText="landing"), display the comment `spec-log://onboarding` in brand orange (#F95616) above a dark terminal card, show the heading "Acabas de entrar a Spec Log." and an explanatory paragraph outside the card, and render the Footer component at the bottom.

#### Scenario: Full page renders on subscription redirect

- GIVEN a user is redirected to `/subscribe` after a successful subscription
- WHEN the page loads
- THEN the MacHeader is rendered with showTimer=false, buttonHref="/", buttonText="landing"
- AND the comment `spec-log://onboarding` appears in #F95616 above the card
- AND the heading "Acabas de entrar a Spec Log." appears outside the card
- AND a text paragraph explaining what they'll receive appears outside the card
- AND the Footer component is rendered at the bottom

### Requirement: Animation Sequence

The card MUST display a terminal-style animation on first mount: start with "STATUS: In progress..." (animated dots, text in #FFD700, label in #FFFFFF), then show three sequential checkmarks in #50C878 at ~1.5s intervals — [✓] Email verificado, [✓] Suscripción creada, [✓] Próxima edición programada — and finally change status to "STATUS: SUCCESS" (SUCCESS in #50C878) when all three are visible.

#### Scenario: Full animation plays on first visit

- GIVEN the user visits `/subscribe` for the first time with no `animationShown` flag
- WHEN the component mounts
- THEN "STATUS: In progress..." appears with animated dots
- AND after ~1.5s, [✓] Email verificado appears in #50C878
- AND after ~1.5s more, [✓] Suscripción creada appears in #50C878
- AND after ~1.5s more, [✓] Próxima edición programada appears in #50C878
- AND when all three checks are visible, the status changes to "STATUS: SUCCESS" with SUCCESS in #50C878

#### Scenario: Dark terminal card styling

- GIVEN the animation card is rendered
- THEN the card background MUST be #000000
- AND all regular text inside the card MUST be #FFFFFF

### Requirement: Animation Persistence

The system MUST store an `animationShown` flag in localStorage when the animation completes. On page refresh at any point, the animation MUST skip directly to the SUCCESS state. On subsequent visits where the flag is set, the SUCCESS state MUST be displayed immediately.

#### Scenario: Refresh during animation skips to SUCCESS

- GIVEN the user is viewing the animation and the `animationShown` flag is NOT set
- WHEN they refresh the page
- THEN all three checkmarks appear immediately
- AND the status reads "STATUS: SUCCESS"
- AND the `animationShown` flag is set in localStorage

#### Scenario: Subsequent visit shows SUCCESS directly

- GIVEN the user has previously completed the animation and `animationShown` is set
- WHEN they visit `/subscribe` again
- THEN the SUCCESS state is displayed immediately with no animation

### Requirement: Reduced Motion Support

The system MUST respect the `prefers-reduced-motion` media query. When enabled, all three checkmarks MUST appear immediately and the status MUST transition directly to SUCCESS.

#### Scenario: Reduced motion skips animation

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page loads
- THEN all three checkmarks appear simultaneously
- AND the status immediately shows "STATUS: SUCCESS"
- AND `animationShown` is set in localStorage

### Requirement: File Structure

The implementation MUST create `src/app/subscribe/page.tsx` as a client component and `src/styles/post-registro.css` for co-located styles. The page MUST NOT have standalone navigation — it serves only as a redirect target after subscription.

#### Scenario: New files created at correct paths

- GIVEN the spec is implemented
- WHEN the codebase is inspected
- THEN `src/app/subscribe/page.tsx` exists as a client component
- AND `src/styles/post-registro.css` exists with component styles
