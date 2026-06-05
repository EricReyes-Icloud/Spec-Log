# endlog-terminal Specification

## Purpose

Defines the dark Mac-style terminal CTA's visual identity, IntersectionObserver-triggered typewriter animation, accessibility rules, and scroll-back-to-hero interaction for the EndLog closing section.

## Requirements

### Requirement: Terminal Visual Identity

The terminal MUST render as a dark Mac-style card: `bg-[#1E1E1E]`, `rounded-xl`, `overflow-hidden`, box-shadow `6px 8px 0px rgba(0,0,0,0.12), 12px 16px 0px rgba(0,0,0,0.06)`. Header bar `bg-[#2B2D30]` with three dots: red `#FF5457`, yellow `#FFC653`, green `#56E75D`, each with hover glow. Prompt per-character colors: "spec-log" green, ":" white, "~" light blue/gray, "$" light yellow, cursor "█" white, ">" lines brand-orange `#F95616`.

#### Scenario: Correct visual tokens render

- GIVEN the EndLog section renders
- WHEN the terminal mounts
- THEN it displays the dark card, colored header dots, and per-character colored prompt
- AND all colors match the specified palette

### Requirement: IntersectionObserver Trigger

The animation MUST trigger via IntersectionObserver at threshold 0.3. The observer MUST disconnect after first intersection. The animation MUST NOT replay when scrolling away and back.

#### Scenario: Triggers once on viewport entry

- GIVEN the terminal is below the viewport
- WHEN the user scrolls until ≥30% of the terminal is visible
- THEN the typewriter animation starts
- AND the observer disconnects immediately

#### Scenario: No replay on scroll return

- GIVEN the animation completed
- WHEN the user scrolls away and back
- THEN the terminal stays in its completed static state

### Requirement: Six-Phase Typewriter Sequence

Characters MUST appear at ~40ms with per-color prompt spans. ">" lines MUST render in brand-orange. The final line MUST NOT show the blinking cursor. Phases: (1) 0.5s delay → 1s cursor blink at `spec-log:~$ █` — (2) types line, 2s pause — (3) types paragraph, 3s pause — (4) types paragraph, 2.5s pause — (5) types paragraph, 2.5s pause — (6) types final line (no cursor), 1.5s + 1s delay → button.

#### Scenario: Full sequence executes in order

- GIVEN animation has triggered
- WHEN all six phases execute
- THEN phase 1 shows cursor at prompt, phases 2-5 type their texts with pauses, and phase 6 completes without cursor
- AND the button appears after the final delay

### Requirement: Scroll-Back CTA Button

After animation completes, a button MUST fade in: text "↑ Unirme a Spec Log", `bg-brand-orange`, `text-brand-carbon`, `font-mono`, `rounded-md`. Hover: `bg-[#F98016]`. Click MUST smooth-scroll to `#hero`.

#### Scenario: Button appears and scrolls to hero

- GIVEN animation completed
- THEN the button fades in below terminal text
- WHEN clicked
- THEN the page smooth-scrolls to `#hero`

### Requirement: Reduced Motion

The system MUST respect `prefers-reduced-motion: reduce`. When active, the terminal MUST appear fully typed with the CTA button immediately visible. No animation SHOULD play.

#### Scenario: Fully typed on reduced motion

- GIVEN `prefers-reduced-motion: reduce`
- WHEN the terminal enters viewport
- THEN all text appears fully typed with button visible immediately

### Requirement: Section Layout

The section MUST use `bg-[#FFE1A5]`. Comment `<!-- end.log -->` MUST appear at the top in brand-orange monospace. Terminal MUST be centered. On mobile, MUST use full width with horizontal padding (not edge-to-edge).

#### Scenario: Mobile padding

- GIVEN a mobile viewport
- WHEN the section renders
- THEN the terminal spans full width with side padding

#### Scenario: Desktop centering

- GIVEN a desktop viewport
- WHEN the section renders
- THEN the terminal is centered with appropriate max-width
