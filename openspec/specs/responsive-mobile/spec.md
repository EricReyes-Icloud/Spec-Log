# Responsive Mobile Specification

## Purpose

Mobile-first responsive layout for Spec Log landing page across 3 breakpoints. All 8 sections MUST render without horizontal scrolling on >=375px viewports and MUST preserve all existing content.

| Breakpoint | Range | Behavior |
|------------|-------|----------|
| Default | <640px | Mobile baseline, stacked, compact |
| sm | 640–1023px | Intermediate, more spacing |
| lg | 1024px+ | Current desktop layout restored |

### Requirement: MacHeader — Compact Bar

- GIVEN a viewport of 375px
- WHEN MacHeader renders
- THEN dots, timer, and CTA MUST fit without overflow
- AND all touch targets MUST be >=44px
- GIVEN a viewport of 1024px
- THEN desktop spacing/sizing MUST be restored

### Requirement: Hero — Stack Image → Form → Text

- GIVEN a viewport of 375px
- WHEN Hero renders
- THEN elements MUST display image, form, text (top to bottom)
- AND h1 MUST be ~32px, form MUST be full-width
- GIVEN a viewport of 1024px
- THEN the 2-column layout MUST be restored
- AND all existing content MUST be present

### Requirement: WhatYouGet — Full-Width Cards

- GIVEN a viewport of 375px
- WHEN WhatYouGet renders
- THEN both terminal-style cards MUST be full-width and stacked vertically
- AND padding MUST be p-8, title ~28px
- GIVEN a viewport of 1024px
- THEN side-by-side card layout MUST be restored

### Requirement: WhySpecLog — Text Above Terminal

- GIVEN a viewport of 375px
- WHEN WhySpecLog renders
- THEN text MUST appear above the terminal
- AND the terminal's 2 code panels MUST stack vertically
- GIVEN a viewport of 1024px
- THEN text/terminal SHALL return to side-by-side
- AND panels SHALL be side-by-side
- AND no content SHALL be truncated at any breakpoint

### Requirement: AboutSection — Flex Column + CSS Module

- GIVEN a viewport of 375px
- WHEN AboutSection renders
- THEN photo (~180–200px) MUST be above biography
- AND padding MUST be ~20px, layout flex-col
- AND inline CSS (`padding: 95px 80px`, grid) MUST NOT remain on JSX
- AND all styles SHALL be in the CSS module with media queries
- GIVEN a viewport of 640px
- THEN photo SHALL be ~250px
- GIVEN a viewport of 1024px
- THEN grid layout MUST be restored

### Requirement: TechnicalLog — Full-Width Cards

- GIVEN a viewport of 375px
- WHEN TechnicalLog renders
- THEN each card MUST be full-width
- AND title ~24px, horizontal padding px-4
- AND no card content SHALL overflow
- GIVEN a viewport of 1024px
- THEN current desktop sizing MUST be restored

### Requirement: EndLog — Pre-Wrap + Full-Width CTA

- GIVEN a viewport of 375px
- WHEN EndLog renders
- THEN terminal text MUST use `white-space: pre-wrap` (wraps long lines)
- AND the CTA button MUST be full-width
- AND the scroll-to-top touch target MUST be >=44px

### Requirement: Footer — Column Center, Row at sm

- GIVEN a viewport of 375px
- WHEN Footer renders
- THEN social links MUST display in a centered column
- GIVEN a viewport of 640px
- THEN links MUST return to horizontal row layout

### Requirement: Global — No Overflow, Content Preserved

- GIVEN a viewport of 375px
- WHEN the full page renders
- THEN there MUST be no horizontal scrollbar
- AND all text, images, buttons, and code MUST be present as on desktop
- GIVEN a viewport below 320px
- THEN a `min-width: 320px` guard SHOULD prevent collapse
