# Spec: Spec Log Info Page

## MacHeader Extension

### [SPEC-LOG-INFO-MH-001] Configurable timer visibility
**Priority**: Must Have

`MacHeader` MUST accept optional `showTimer` (boolean, default `true`). When `false`, a `flex-1` spacer replaces the countdown to keep the three-column grid balanced.

#### Scenarios
- GIVEN `showTimer={false}` → THEN no timer, `flex-1` spacer in center
- GIVEN no `showTimer` prop → THEN countdown timer displays as before

### [SPEC-LOG-INFO-MH-002] Configurable button URL
**Priority**: Must Have

`MacHeader` MUST accept optional `buttonHref` (string, default `"https://github.com/ericreyes/spec-log"`). The anchor `href` MUST use this value.

#### Scenarios
- GIVEN `buttonHref="/"` → THEN `href` is `"/"`
- GIVEN no `buttonHref` → THEN `href` is the default GitHub URL

### [SPEC-LOG-INFO-MH-003] Configurable button text
**Priority**: Must Have

`MacHeader` MUST accept optional `buttonText` (string, default `"spec-log"`). The button renders `{ } <buttonText>`.

#### Scenario: Custom text
- GIVEN `buttonText="landing"`
- WHEN it renders
- THEN the button reads `{ } landing`

## Route & Layout

### [SPEC-LOG-INFO-RL-001] Info page composes five elements in order
**Priority**: Must Have

The route `/spec-log-info` SHALL render `MacHeader` (`showTimer=false`, `buttonHref="/"`, `buttonText="landing"`), centered heading, `SpecLogAccordion`, then `Footer` in that order.

#### Scenario: Full page render
- GIVEN user navigates to `/spec-log-info`
- WHEN the page loads
- THEN MacHeader (no timer, `{ } landing` → `/`) → heading → accordion → Footer in DOM order

## Heading

### [SPEC-LOG-INFO-HD-001] Heading with brand-orange highlight
**Priority**: Must Have

"Descubre todo sobre Spec Log" MUST be centered, 55px, `--color-brand-carbon`. "Spec Log" MUST use `--color-brand-orange` (#F95616).

#### Scenarios
- GIVEN page loaded → THEN "Descubre todo sobre " is #1F1F1F, "Spec Log" is #F95616, centered at 55px
- GIVEN viewport < 768px → THEN heading SHOULD scale down proportionally

## Accordion

### [SPEC-LOG-INFO-AC-001] Nine brand questions rendered
**Priority**: Must Have

`SpecLogAccordion` MUST be `"use client"` with `openIndex: number | null`. Nine questions render, each with a bold title and `▸` chevron. Answers are empty strings.

Questions in order: ¿Qué es Spec Log?, ¿Por qué nació?, ¿De dónde surgió la idea?, ¿Qué contenido comparte?, ¿Cómo se creó?, ¿Quién debería leerlo?, ¿Quién NO debería leerlo?, ¿Por qué se llama Spec Log?, ¿Cuál es el objetivo final?

#### Scenario: All nine items visible
- GIVEN accordion rendered
- THEN nine bold titles with `▸` chevrons, no answers visible, full-width

### [SPEC-LOG-INFO-AC-002] Classic one-at-a-time toggle
**Priority**: Must Have

Clicking chevron OR question text toggles an item. Opening one closes any other. Clicking the open item closes it.

#### Scenario: Open, switch, close
- GIVEN no item open → WHEN click item 1 chevron → THEN item 1 expands (chevron `▾`)
- WHEN click item 2 text → THEN item 1 collapses (`▸`) AND item 2 expands (`▾`)
- WHEN click item 2 again → THEN item 2 collapses

### [SPEC-LOG-INFO-AC-003] Chevron rotation
**Priority**: Should Have

The chevron MUST show `▸` collapsed, `▾` expanded, with a smooth rotation transition.

#### Scenario: Visual state
- GIVEN item collapsed (chevron `▸`)
- WHEN opened → chevron rotates to `▾`
- WHEN closed → reverts to `▸`

## Footer

### [SPEC-LOG-INFO-FT-001] Footer reused from landing
**Priority**: Must Have

`Footer` from `@/components/landing/Footer` MUST be imported and rendered as-is, identical to the landing page.

#### Scenario: Same footer
- GIVEN /spec-log-info loaded
- WHEN user scrolls to bottom
- THEN Footer renders with identical social links and comment text
