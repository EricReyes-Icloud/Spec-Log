# Admin Editor Interface Specification

## Purpose

Split-pane editor at `/admin/editor` (and `/admin/editor/:id`) that provides a real-time markdown composition experience inside a glassmorphism container, with an email template preview pane that simulates the rendered newsletter look.

## Requirements

### Requirement: Split Pane Layout

The editor MUST render a vertical split pane: a textarea for markdown input on the left, and a live preview on the right. A light gray vertical divider MUST separate the two panes.

#### Scenario: Default two-pane render

- GIVEN an admin navigates to `/admin/editor`
- THEN the left pane contains a monospace textarea
- AND the right pane contains the rendered preview
- AND a light gray vertical divider separates both panes

#### Scenario: Pane fill behavior

- GIVEN the editor is rendered
- THEN both panes fill the full available height of the viewport
- AND both panes are equal width by default

### Requirement: Editor Container Styling

The editor wrapper MUST use glassmorphism styling: transparent background with `backdrop-filter: blur()`, rounded corners matching the admin login page, and light gray border.

#### Scenario: Glassmorphism matches login

- GIVEN the editor page loads
- THEN the container uses `backdrop-filter`, rounded `border-radius`, and light gray border
- AND the visual style is consistent with the admin login page design tokens

### Requirement: Real-time Preview

The preview pane MUST update on every keystroke without any server call. All transformation MUST happen client-side using react-markdown.

#### Scenario: Keystroke triggers preview update

- GIVEN an admin types markdown in the left textarea
- WHEN each new character is entered
- THEN the right pane re-renders the preview within the same animation frame
- AND no network request is made

#### Scenario: Large markdown content

- GIVEN the markdown exceeds 1000 characters
- WHEN the admin continues typing
- THEN preview updates are debounced to avoid jank
- AND the debounce delay SHALL NOT exceed 300ms

### Requirement: Email Template Preview

The preview pane MUST display the rendered markdown inside an email template mockup. The mockup MUST show a macOS-style header with red, yellow, and green traffic light dots (visual only — no animations). The template MUST have a white background, light gray border, and border radius. The template content MUST NOT fill the entire right pane — it MUST float inside the glass container.

#### Scenario: Template wrapper renders correctly

- GIVEN the preview pane has rendered content
- THEN the preview content is wrapped in a white-background container
- AND the container has a macOS header with three colored dots
- AND the container has a light gray border and border radius
- AND the container is centered within the right pane (does not fill it entirely)
- AND the macOS dots are static (no hover/click animations)

#### Scenario: Empty preview state

- GIVEN the textarea is empty
- WHEN no markdown has been typed
- THEN the preview pane shows the email template with empty content area
- AND the template header and footer are still visible

### Requirement: Preview Footer

The email template preview MUST include a footer with the text "construyendo sistemas reales con IA" inside an HTML comment wrapper, styled in the landing page style.

#### Scenario: Footer renders on load

- GIVEN the editor is loaded
- WHEN the preview pane renders
- THEN the footer is visible at the bottom of the template
- AND the footer text reads "construyendo sistemas reales con IA"
- AND the styling matches the landing page footer design

### Requirement: Save Button

The editor MUST include a save button that persists the current markdown and title as a draft newsletter to Firestore. The button SHALL show a loading state during save and a success indicator on completion.

#### Scenario: Save draft successfully

- GIVEN the admin has typed markdown and a title
- WHEN the admin clicks the save button
- THEN the newsletter is persisted to the `newsletters` Firestore collection
- AND the button shows a loading indicator during the save
- AND a success indicator is displayed on completion

#### Scenario: Save with empty title

- GIVEN the admin has typed markdown but no title
- WHEN the admin clicks the save button
- THEN the system SHALL show a validation error
- AND the newsletter is NOT saved

### Requirement: Route for Existing Newsletters

The system MUST support `/admin/editor/:id` to load an existing newsletter by its Firestore document ID. The loaded content MUST populate both the textarea and the preview.

#### Scenario: Load existing newsletter

- GIVEN a newsletter exists in Firestore with ID `abc123`
- WHEN an admin navigates to `/admin/editor/abc123`
- THEN the textarea is populated with the newsletter's markdown
- AND the preview renders the loaded markdown
- AND the save button updates the existing document instead of creating a new one

#### Scenario: Load non-existent newsletter

- GIVEN no newsletter exists with ID `nonexistent`
- WHEN an admin navigates to `/admin/editor/nonexistent`
- THEN the editor shows an error message
- AND the admin can still create new content (prevents blank page)
