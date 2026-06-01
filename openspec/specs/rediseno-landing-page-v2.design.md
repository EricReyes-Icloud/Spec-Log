# Rediseño Landing Page - Design

## Architecture Overview

The redesigned landing page follows a linear composition pattern with 5 stacked sections, all centered horizontally. The page acts as a pure Server Component; all interactive behavior is handled by client-side sub-components.

## Component Tree

```
HomePage (Server Component — src/app/page.tsx)
├── MacHeader                   (Client Component — macOS terminal bar)
├── Hero                        (Client Component — heading + image + form)
│   └── (form state managed internally via useState)
├── WhatYouGet                  (Server Component — static cards)
├── AboutSection                (Server Component — static personal section)
└── Footer                      (Server Component — social links + comment)
```

### Component Responsibilities

| Component | Type | State | Purpose |
|---|---|---|---|
| `MacHeader` | Client | None | macOS-style terminal bar with colored circles |
| `Hero` | Client | form state | Heading, description, Miniatura.png, integrated form |
| `WhatYouGet` | Server | None | Two static cards showing what subscribers get/don't get |
| `AboutSection` | Server | None | Personal intro with photo placeholder |
| `Footer` | Server | None | Social links and comment |

## Data Flow

### Form Data Flow (Hero — Client Component)

```
User Input → useState (name, email) → validate() → onSubmit()
  → simulated async submission → success/error state → UI feedback
```

No external API calls in this phase. Form submission is simulated (same as current behavior).

## Page Layout Structure

```html
<div class="min-h-screen flex items-center justify-center px-4 py-8">
  <main class="w-full max-w-4xl ... rounded-xl overflow-hidden">
    
    <!-- 1. macOS Terminal Header -->
    <MacHeader />
    
    <!-- 2. Hero + Form -->
    <Hero />
    
    <!-- 3. Qué Recibirás -->
    <WhatYouGet />
    
    <!-- 4. About Section -->
    <AboutSection />
    
    <!-- 5. Footer -->
    <Footer />
    
  </main>
</div>
```

## Responsive Behavior

```
Desktop (≥768px):
┌─────────────────────────────────────────────┐
│ ● ● ●  Spec Log                             │  ← MacHeader
├─────────────────────────────────────────────┤
│ Heading     │               │                │
│ Description │  Miniatura    │                │  ← Hero
│             │               │                │
│ [Nombre] [Email] [Unirme]  │                │
├─────────────────────────────────────────────┤
│  <!---------- Qué Recibiras ---------->      │
│  ┌──────────┐  ┌──────────┐                 │  ← WhatYouGet
│  │ Sí       │  │ No       │                 │
│  │ ✓ item   │  │ ✗ item   │                 │
│  └──────────┘  └──────────┘                 │
├─────────────────────────────────────────────┤
│   (foto)   Soy Eric Reyes                    │  ← AboutSection
│   circular  Desarrollador...                 │
├─────────────────────────────────────────────┤
│ [github] [linkedin]                          │  ← Footer
│ /* Suscríbete... */                          │
└─────────────────────────────────────────────┘

Mobile (<768px):
┌─────────────────────┐
│ ● ● ●  Spec Log     │
├─────────────────────┤
│     Miniatura       │
│ Heading             │
│ Description         │
│ [Nombre]            │
│ [Email]             │
│ [Unirme]            │
├─────────────────────┤
│  <!---- Qué ---->   │
│  ┌───────────────┐  │
│  │ Sí Recibirás   │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ No Recibirás   │  │
│  └───────────────┘  │
├─────────────────────┤
│ (foto) Soy Eric...  │
├─────────────────────┤
│ [github] [linkedin] │
└─────────────────────┘
```

## Tailwind Theme Additions

No new theme tokens needed — all colors already exist in `globals.css`:
- `brand-orange: #F97316`
- `brand-carbon: #1F1F1F`
- `brand-footer: #37302E`
- `brand-comment: #E5E5E5`

The macOS button colors are one-offs used only in MacHeader, so they can be inline hex values (no need to add to the theme).

## File Operations

### Create
1. `src/components/landing/MacHeader.tsx` — macOS terminal bar
2. `src/components/landing/WhatYouGet.tsx` — "Qué Recibirás" cards
3. `src/components/landing/AboutSection.tsx` — Personal about section

### Modify
1. `src/components/landing/Hero.tsx` — Add heading, restructure layout, integrate form
2. `src/components/landing/Footer.tsx` — Update comment text if needed
3. `src/app/page.tsx` — Restructure to include new sections, remove old ones

### Remove (no longer used)
1. `src/components/landing/Header.tsx` — Replaced by MacHeader
2. `src/components/landing/SubscribeForm.tsx` — Merged into Hero

## Implementation Order

1. **MacHeader** — Simple component, no dependencies
2. **Hero** — Refactor existing: add heading, two-column layout, integrated form
3. **WhatYouGet** — New static component with two cards
4. **AboutSection** — New static component
5. **Footer** — Verify comment text matches spec
6. **page.tsx** — Wire everything together, remove old Header and SubscribeForm imports
