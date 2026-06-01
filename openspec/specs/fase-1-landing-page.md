# Landing Page Specification - Fase 1

## Purpose

This specification defines the requirements and scenarios for the Spec Log landing page (Phase 1), including visual identity, responsive behavior, and subscription form functionality.

## Functional Requirements

### Requirement: Header Section

The system MUST display a header section at the top of the landing page that:
- MUST contain only the `Header.png` image without any additional text or navigation elements
- MUST span the full width of the viewport
- MUST maintain its aspect ratio across all device sizes
- MUST be the first visible element when the page loads

#### Scenario: Header Display on Page Load

- GIVEN the user navigates to the root path (`/`)
- WHEN the page finishes loading
- THEN the header section with `Header.png` MUST be visible at the top
- AND the header MUST occupy the full width of the viewport

#### Scenario: Header Responsive Behavior

- GIVEN the page is viewed on different screen sizes (mobile, tablet, desktop)
- WHEN the viewport width changes
- THEN the `Header.png` image MUST maintain its aspect ratio
- AND the image MUST NOT overflow its container

### Requirement: Hero Section

The system MUST display a hero section below the header that:
- MUST contain the `Miniatura.png` image
- MUST include descriptive text about Spec Log's value proposition
- MUST use sans-serif typography for the description text
- MUST maintain proper spacing between the image and text

#### Scenario: Hero Section Content Display

- GIVEN the page has loaded successfully
- WHEN the user scrolls to the hero section
- THEN the `Miniatura.png` image MUST be visible
- AND the descriptive text MUST be clearly readable
- AND the text MUST use sans-serif font family

#### Scenario: Hero Section Responsive Layout

- GIVEN the page is viewed on mobile devices
- WHEN the viewport width is less than 768px
- THEN the hero image and text MUST stack vertically
- AND the text MUST remain readable without horizontal scrolling

### Requirement: Subscription Form

The system MUST provide a subscription form that:
- MUST contain an email input field with monospace font
- MUST include a submit button labeled "Suscríbete"
- MUST use orange background color (#F97316) for the button
- MUST use carbon black text color (#1F1F1F) for the button text
- MUST be clearly visible and accessible on all viewport sizes

#### Scenario: Form Field Validation - Empty Email

- GIVEN the subscription form is visible
- WHEN the user submits the form with an empty email field
- THEN the system MUST prevent form submission
- AND the system MUST display a validation error message
- AND the error message MUST indicate that the email field is required

#### Scenario: Form Field Validation - Invalid Email Format

- GIVEN the subscription form is visible
- WHEN the user enters an invalid email format (e.g., "user@invalid")
- AND the user attempts to submit the form
- THEN the system MUST prevent form submission
- AND the system MUST display a validation error message
- AND the error message MUST indicate that a valid email format is required

#### Scenario: Form Submission (Frontend Only)

- GIVEN the user has entered a valid email address
- WHEN the user clicks the "Suscríbete" button
- THEN the form MUST capture the email value
- AND the system MUST provide visual feedback that the submission was received
- AND the email MUST be stored in memory (Phase 2 will implement backend storage)

### Requirement: Footer Section

The system MUST display a footer section at the bottom of the page that:
- MUST have a background color of #37302E
- MUST contain a comment in code style: `/* Suscríbete a Spec Log — construyendo sistemas reales con IA como copiloto */`
- MUST include links to `[ github.com/ericreyes ]` and `[ linkedin.com/in/ericreyes ]`
- MUST display links in a bordered container with white text
- MUST use monospace font for the comment text

#### Scenario: Footer Display on All Pages

- GIVEN the user is viewing the landing page
- WHEN the user scrolls to the bottom
- THEN the footer section MUST be visible
- AND the background color MUST be #37302E
- AND the comment text MUST be displayed in code style

#### Scenario: Footer Links Functionality

- GIVEN the footer is visible
- WHEN the user clicks on the GitHub link
- THEN the system MUST open the URL `https://github.com/ericreyes` in a new tab
- AND the link MUST be clearly identifiable as clickable

### Requirement: Responsive Design

The system MUST implement mobile-first responsive design that:
- MUST adapt layout for viewport widths from 320px to 1920px
- MUST ensure all content remains readable without horizontal scrolling
- MUST maintain proper spacing and padding on all devices
- MUST use appropriate font sizes for different screen sizes

#### Scenario: Mobile Viewport Adaptation

- GIVEN the page is viewed on a mobile device with 375px width
- WHEN the page loads
- THEN all content MUST be visible without horizontal scrolling
- AND font sizes MUST be legible
- AND interactive elements MUST be large enough for touch input

#### Scenario: Desktop Viewport Adaptation

- GIVEN the page is viewed on a desktop with 1440px width
- WHEN the page loads
- THEN the layout MUST utilize available space appropriately
- AND the hero section MUST display image and text in optimal arrangement
- AND the subscription form MUST be centered and prominent

## Non-Functional Requirements

### Performance Requirements

- The landing page MUST load within 2 seconds on a 3G connection
- All images MUST be optimized for web (compressed, proper format)
- The bundle size MUST not exceed 500KB for the landing page
- The system MUST minimize render-blocking resources

### Accessibility Requirements

- The system MUST maintain a minimum contrast ratio of 4.5:1 for normal text
- The system MUST use semantic HTML5 elements appropriately
- All interactive elements MUST be keyboard navigable
- The system MUST provide appropriate ARIA attributes where needed
- Focus states MUST be clearly visible for keyboard navigation

### Technical Requirements

- The system MUST use TypeScript with strict mode enabled
- The system MUST follow Next.js 16.2.6 conventions
- The system MUST use Tailwind CSS v4 for styling
- The system MUST NOT introduce external runtime dependencies beyond package.json
- The system MUST implement the landing page as a server component in `src/app/page.tsx`

### Visual Identity Requirements

- The system MUST use the color palette: #1F1F1F (text), #E5E5E5 (comments), #F97316 (identity/button), #37302E (footer)
- The system MUST use sans-serif font for body text and monospace font for technical elements
- The system MUST maintain consistent spacing and typography throughout
- The system MUST reflect the technical/developer aesthetic in all design elements

## Scenarios

### Scenario: Complete Page Load on Mobile Device

- GIVEN a user on a mobile device with 375px viewport width
- WHEN the user navigates to the root URL
- THEN the page MUST load completely within 2 seconds
- AND the header image MUST be visible at full width
- AND the hero section MUST display image and text stacked vertically
- AND the subscription form MUST be clearly visible above the fold
- AND the footer MUST be accessible via scrolling

### Scenario: Form Interaction and Validation

- GIVEN the subscription form is visible
- WHEN the user focuses on the email input field
- THEN the input MUST show a monospace font
- AND the placeholder text MUST be clearly visible
- WHEN the user enters an invalid email and submits
- THEN the system MUST display an appropriate error message
- AND the form MUST NOT submit

### Scenario: Visual Consistency Across Viewports

- GIVEN the user resizes the browser window
- WHEN the viewport changes from mobile to desktop
- THEN the layout MUST adapt smoothly
- AND all colors MUST remain consistent
- AND typography MUST maintain readability
- AND interactive elements MUST remain usable

### Scenario: Footer Content and Styling

- GIVEN the user has scrolled to the footer
- WHEN the footer is visible
- THEN the background MUST be #37302E
- AND the comment text MUST use monospace font
- AND the comment color MUST be #E5E5E5
- AND the links MUST be clearly visible with white text
- AND the links container MUST have a white border

### Scenario: Image Loading and Display

- GIVEN the page is loading
- WHEN the `Header.png` and `Miniatura.png` images are requested
- THEN the images MUST load from the `public/` directory
- AND the images MUST display without distortion
- AND the images MUST maintain their aspect ratios
- AND the images MUST be properly sized for their containers

## File Structure

The implementation MUST create/modify the following files:

### New Files
- `src/app/page.tsx` - Main landing page component
- `src/components/landing/Header.tsx` - Header component
- `src/components/landing/Hero.tsx` - Hero section component
- `src/components/landing/SubscribeForm.tsx` - Subscription form component
- `src/components/landing/Footer.tsx` - Footer component

### Modified Files
- `src/app/layout.tsx` - May need adjustments for global styles if required

### Asset Files (Must Exist)
- `public/Header.png` - Header image
- `public/Miniatura.png` - Hero image

## Visual Specification

### Header Section
- Full width `Header.png` image
- No additional text or navigation
- Image maintains aspect ratio on all devices

### Hero Section
- `Miniatura.png` image aligned appropriately
- Sans-serif description text
- Proper spacing between image and text

### Subscription Form
- Email input with monospace font
- Submit button with background #F97316
- Button text color #1F1F1F
- Clear visual hierarchy

### Footer Section
- Background color #37302E
- Code-style comment: `/* Suscríbete a Spec Log — construyendo sistemas reales con IA como copiloto */`
- Links in bordered container with white text
- Monospace font for comment text

### Typography
- Body text: sans-serif font family
- Technical elements: monospace font family

### Color Palette
- Primary text: #1F1F1F
- Comments: #E5E5E5  
- Identity/Buttons: #F97316
- Footer background: #37302E