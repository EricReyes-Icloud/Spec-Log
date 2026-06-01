# Technical Design Document – Phase 1 Landing Page

## 1. Overview

This document specifies the technical implementation of the public landing page for Spec Log (Phase 1).  The landing page is the first touchpoint for all visitors and must communicate our value proposition while providing a clean subscription form.  The design follows the Visual Identity guidelines (see *Identidad_visual.md*) and the functional expectations defined in *Fase‑1‑Landing‑Page.md*.

> **Scope** – Only the front‑end page and supporting components are covered.  Backend integration will be addressed in Phase 2.

## 2. Component Tree

```text
src/app/page.tsx (Server Component)
│
├─ components/landing/Header.tsx            ← full‑width header image
├─ components/landing/Hero.tsx             ← hero image + description
├─ components/landing/SubscribeForm.tsx   ← client‑side form with validation
└─ components/landing/Footer.tsx           ← footer container with code‑style comment
```

All child components are **Client Components** (`"use client"`), except `page.tsx`, which is a **Server Component** that stitches them together.

## 3. Data Flow

1. **User Interaction** – The user types an e‑mail address into `SubscribeForm`.
2. **Client‑Side Validation** – The form validates the address using a regular‑expression and shows inline error messages.
3. **State Management** – `SubscribeForm` keeps `email`, `isSubmitting`, `error`, and `success` in local state.  No global store is required at this phase.
4. **Preparation for Phase 2** – Upon successful validation the component dispatches a *custom event* (or calls an API client stub) that emits the email value.  This event is a placeholder for the Phase 2 backend call.

## 4. Component Specifications

| Component | Props (TS) | State | Behavior | Accessibility | Responsive |
|----------|-------------|-------|----------|----------------|------------|
| `Header` | `alt: string` | none | Renders `<Image src="/Header.png" alt={alt} layout="responsive" />` | Alt text provided. | Image keeps aspect ratio via `object‑fit: cover`.
| `Hero`   | `description: string` | none | Image + paragraph. | `role="region" aria‑label="Hero section"`. | Uses flex‑column on mobile, flex‑row on ≥768px. |
| `SubscribeForm` | none | `{ email, isSubmitting, error, success }` | Validates input, shows loading spinner, displays success or error message. | `label` for input, `aria‑alert` for error, focus on error. | Button padded 12 px, large enough for touch.
| `Footer` | none | none | Displays code‑style comment and icon‑links. | Links have `title`. | Stack links vertically on mobile.

### Props Interfaces

```ts
// Header
export interface HeaderProps {
  alt?: string;
}

// Hero
export interface HeroProps {
  description: string;
}
```

### State Shapes

```ts
type SubscribeState = {
  email: string;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
};
```

### Validation Logic

```ts
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
```

If `!emailRegex.test(email)` → set `error = "Invalid email format"`.

### Error/Success UI

- **No input** → `"Email is required"`.
- **Invalid** → `"Please enter a valid email"`.
- **Submitted** → `"Thank you! Your email has been recorded."` (still in memory; backend to be wired later).

## 5. Styling Strategy (Tailwind CSS v4)

| Element | Class Usage | Notes |
|---------|-------------|-------|
| Header image | `w-full h-auto` | Responsive width, keeps ratio. |
| Hero container | `flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6` | Mobile‑first stack. |
| Description paragraph | `text-base md:text-lg font-sans text-gray-800` | Max contrast 4.5:1. |
| Subscribe input | `w-full p-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-orange-500` | Monospace font for technical feel. |
| Subscribe button | `mt-2 py-2 px-4 bg-orange-600 text-white font-medium rounded hover:bg-orange-700` | Orange identity color. |
| Footer container | `bg-[#37302E] text-[color:#E5E5E5] p-4` | Background color per spec. |
| Comment text | `font-mono text-[color:#E5E5E5]` | Code‑style styling. |
| Links container | `border border-white rounded-md px-2 py-1 flex space-x-4 text-white hover:text-gray-200` | Bordered, white links. |

#### Color Palette

```css
/* Tailwind config extends: */
{
  "orange-600": "#F97316";
  "text-primary": "#1F1F1F";
  "footer-bg": "#37302E";
}
```

Add custom colors to `tailwind.config.ts` under `extend.colors`.

#### Typography

- Base fonts: `sans: ui-sans-serif, system-ui` in `tailwind.config.ts`.
- Technical detail monospaced fonts: add `mono: ui-monospace` at the same level.

#### Responsive Patterns

- Default mobile (≤ 767 px) stack vertically.
- At `md` breakpoint (≥ 768 px) switch to horizontal hero layout.
- Footer links become inline items on desktop.

## 6. File Structure & Import Paths

```
/src/app/page.tsx            ← main page server component
/src/components/landing/
    Header.tsx
    Hero.tsx
    SubscribeForm.tsx
    Footer.tsx
/tailwind.config.ts           ← custom palette addition
/public/Header.png
/public/Miniatura.png
```

**Imports** – All components are referenced with relative imports from `page.tsx`:

```ts
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import SubscribeForm from "../components/landing/SubscribeForm";
import Footer from "../components/landing/Footer";
```

## 7. Implementation Notes

1. **Next.js Image** – Use `<Image>` component from `next/image` for `Header` and `Hero` images; set `width`/`height` via layout properties for optimisation.
2. **Client‑Side Form** – Use `"use client"` at top of `SubscribeForm.tsx`.  Local `useState` for form values and status.
3. **Semantic HTML** – Wrap hero section in `<section aria-label="Hero Section">`.  Use `<label>` for input.
4. **Keyboard Navigation** – All interactive elements (`input`, `button`, `links`) are naturally focusable.  Add `tabIndex` if required and focus ring classes for visiblity.
5. **ARIA** – Use `aria-invalid` on input when `error` state is set; use `aria-live="polite"` on the error or success message container.
6. **Testing** – Basic unit tests (React Testing Library) should cover validation logic and rendering structure.
7. **Future Hook for Backend** – Create a utility file `lib/services/subscribe.ts` that exports an async `subscribe(email: string)`; stub it currently to simulate successful recording.

---

**Deliverables** – File creation:
- `/home/eric_reyes/projects/spec-log/openspec/specs/fase-1-landing-page.design.md` (this document)
- All component files referenced above will be implemented in subsequent tasks.

---

*Prepared by the SDD Design Executor – Spec Log*