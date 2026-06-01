# Rediseño Landing Page - V2

## Purpose

This specification defines the requirements and scenarios for redesigning the Spec Log landing page with a new visual structure, additional sections, and a custom macOS-style header bar. This spec replaces and extends the previous `fase-1-landing-page` spec.

## Context

The landing page transitions from a compact card layout to a full-page layout with five distinct sections: Header (macOS terminal), Hero with integrated form, "Qué Recibirás" card section, personal/about section, and Footer.

## Functional Requirements

### Requirement: macOS Terminal Header

The system MUST display a custom macOS-style terminal bar at the top of the page that:

- MUST have a background color of `#37302E`
- MUST contain three circular buttons on the left side with the following colors (left to right):
  - Close button: `#FF5457`
  - Minimize button: `#FFC653`
  - Maximize button: `#56E75D`
- MUST display the text "Spec Log" centered in the bar
- MUST use monospace font for the "Spec Log" text
- MUST have a fixed height appropriate for a terminal title bar
- MUST span the full width of its container
- MUST use rounded top corners to match the card container
- MUST NOT rely on any external image for the header bar

#### Scenario: Header Display on Page Load

- GIVEN the user navigates to the root path (`/`)
- WHEN the page finishes loading
- THEN the macOS terminal bar MUST be visible at the top
- AND three colored circles (red, yellow, green) MUST be visible on the left
- AND the text "Spec Log" MUST be centered in the bar
- AND the bar MUST use `#37302E` background

#### Scenario: Header on Mobile

- GIVEN the page is viewed on a mobile device
- WHEN the header renders
- THEN the colored circles MUST remain visible
- AND the "Spec Log" text MUST remain centered and readable
- AND the header MUST NOT overflow horizontally

### Requirement: Hero Section with Integrated Form

The system MUST display a hero section below the header that:

- MUST show a heading "Spec Log" in large bold sans-serif text on the left
- MUST show descriptive text below the heading on the left
- MUST display `Miniatura.png` image on the right side
- MUST include a subscription form below the text and image
- MUST stack vertically on mobile (image above text, form below)
- MUST use `max-w-4xl` or similar constraint for the content area

#### Form Fields

The subscription form MUST contain:

- A **name** input field (`"Tu nombre"` placeholder) with monospace font
- An **email** input field (`"correo@email.com"` placeholder) with monospace font
- A **submit button** labeled `"Unirme a Spec Log"` with:
  - Background color: `#F97316` (brand-orange)
  - Text color: `#1F1F1F` (brand-carbon)
  - Monospace font
  - Rounded corners

#### Form Validation

- Name field MUST be required (non-empty)
- Email field MUST be required and MUST contain a valid email format
- On validation error, the system MUST display a clear error message in monospace
- On success, the system MUST show a confirmation message

#### Scenario: Hero Layout on Desktop

- GIVEN the viewport width is 768px or wider
- WHEN the hero section renders
- THEN the heading and description MUST be on the left side
- AND the `Miniatura.png` MUST be on the right side
- AND the form MUST appear below both elements
- AND the layout MUST use approximately 50/50 split between text and image

#### Scenario: Hero Layout on Mobile

- GIVEN the viewport width is less than 768px
- WHEN the hero section renders
- THEN the image MUST appear at the top
- AND the heading and description MUST appear below the image
- AND the form MUST appear below the text
- AND everything MUST be center-aligned

#### Scenario: Form Submission - Empty Fields

- GIVEN the subscription form is visible
- WHEN the user submits with empty name or email
- THEN the system MUST prevent submission
- AND display a validation error indicating the required field

#### Scenario: Form Submission - Invalid Email

- GIVEN the subscription form is visible
- WHEN the user enters an invalid email format
- AND clicks "Unirme a Spec Log"
- THEN the system MUST prevent submission
- AND display a validation error for the email format

#### Scenario: Form Submission - Valid Data

- GIVEN the user has entered a valid name and email
- WHEN the user clicks "Unirme a Spec Log"
- THEN the form MUST show a submitting state
- AND after simulated submission, show a success message
- AND reset the form fields

### Requirement: "Qué Recibirás" Section

The system MUST display a "Qué Recibirás" section below the hero that:

- MUST start with a code-style divider: `<!---------------------- Qué Recibiras ------------------>`
  - Color: `#E5E5E5` (brand-comment)
  - Monospace font
- MUST display two cards side by side on desktop, stacked on mobile

#### Left Card: "Sí Recibirás"

- Background color: `#FFFFFF`
- Text color: `#1F1F1F`
- Heading: "Sí Recibirás" in bold
- List items with checkmark (✓):
  - ✓ Reflexiones
  - ✓ Aprendizajes
  - ✓ Errores
  - ✓ Herramientas
  - ✓ Construcción real
- Monospace font for list items

#### Right Card: "No Recibirás"

- Background color: `#37302E`
- Text color: `#FFFFFF`
- Heading: "No Recibirás" in bold
- List items with cross (✗):
  - ✗ Humo tech
  - ✗ Tutoriales
  - ✗ 10 prompts
- Monospace font for list items

#### Scenario: Cards Layout on Desktop

- GIVEN the viewport width is 768px or wider
- WHEN the "Qué Recibirás" section renders
- THEN both cards MUST appear side by side
- AND the white card MUST be on the left
- AND the dark card MUST be on the right
- AND the comment divider MUST appear above both cards

#### Scenario: Cards Layout on Mobile

- GIVEN the viewport width is less than 768px
- WHEN the "Qué Recibirás" section renders
- THEN the cards MUST stack vertically
- AND the white card MUST appear first
- AND the dark card MUST appear second

### Requirement: Personal/About Section

The system MUST display an "About" section below "Qué Recibirás" that:

- MUST have a background color of `#37302E`
- MUST contain a circular container for a profile photo (placeholder)
- MUST display a heading: "Soy Eric Reyes" in large bold text
- MUST display a description: "Desarrollador full-stack especializado en..."
- MUST use white text color (`#FFFFFF`) for all text
- MUST be full-width

#### Scenario: About Section Display

- GIVEN the user scrolls to the about section
- WHEN the section renders
- THEN the background color MUST be `#37302E`
- AND a circular photo container MUST be visible
- AND the heading "Soy Eric Reyes" MUST be displayed
- AND the description text MUST be readable in white

### Requirement: Footer

The system MUST display a footer that:

- MUST have a background color of `#37302E`
- MUST include social links with white borders:
  - `[ github.com/ericreyes ]`
  - `[ linkedin.com/in/ericreyes ]`
- MUST include a comment-style text: `/* Suscríbete a Spec Log... */`
- MUST use monospace font for all text

#### Scenario: Footer Display

- GIVEN the user scrolls to the bottom of the page
- WHEN the footer renders
- THEN the background MUST be `#37302E`
- AND both social links MUST be visible with white bordered containers
- AND the comment text MUST be visible in monospace

### Requirement: Responsive Design

The system MUST implement responsive design that:

- MUST adapt layout for viewport widths from 320px to 1920px
- MUST ensure all content remains readable without horizontal scrolling
- MUST stack sections vertically on mobile where appropriate
- MUST maintain proper spacing and padding on all devices
- MUST center all content horizontally

## Non-Functional Requirements

### Visual Identity

- The system MUST use the existing color palette:
  - Primary text: `#1F1F1F`
  - Comments: `#E5E5E5`
  - Identity/Buttons: `#F97316`
  - Header/Footer/About bg: `#37302E`
  - macOS buttons: `#FF5457`, `#FFC653`, `#56E75D`
- Sans-serif font for headings and body text
- Monospace font for: comments, inputs, buttons, code-style elements, header text
- All content MUST be centered horizontally using `flex items-center justify-center`

### Architecture Requirements

- All component styles MUST use Tailwind CSS v4
- The page MUST remain a Server Component (`src/app/page.tsx`)
- Individual component files in `src/components/landing/`
- The system MUST use Next.js `<Image>` component for `Miniatura.png`

### Accessibility Requirements

- Maintain minimum contrast ratio of 4.5:1 for normal text
- Use semantic HTML5 elements
- All interactive elements MUST be keyboard navigable
- Provide appropriate ARIA attributes
- Clear focus states for keyboard navigation

## File Structure

### Modified Files
- `src/app/page.tsx` - Restructure with new sections
- `src/components/landing/Hero.tsx` - Redesign with integrated form
- `src/components/landing/Footer.tsx` - Update comment text

### New Files
- `src/components/landing/MacHeader.tsx` - macOS terminal bar
- `src/components/landing/WhatYouGet.tsx` - "Qué Recibirás" section
- `src/components/landing/AboutSection.tsx` - Personal/about section

### Removed Files
- `src/components/landing/Header.tsx` - Replaced by MacHeader
- `src/components/landing/SubscribeForm.tsx` - Integrated into Hero

### Asset Files
- `public/Header.png` - NO LONGER USED (removed from components)
- `public/Miniatura.png` - Still used in Hero
- `public/Logo.png` - Available for future use
