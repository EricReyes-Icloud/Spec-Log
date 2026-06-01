# Refactor Estilos Modulares — Design

## Architecture Overview

Refactor puramente estructural: extraer clases Tailwind inline → archivos CSS → `@apply`. No cambia el DOM, no cambia el comportamiento, no cambia el layout.

## File Structure

```
src/styles/
├── globals.css           ← MOVER desde src/app/
├── mac-header.css        ← CREAR
├── hero.css              ← CREAR
├── what-you-get.css      ← CREAR
├── about-section.css     ← CREAR
└── footer.css            ← CREAR
```

## Component → Stylesheet Mapping

| Stylesheet | Importado por | Clases a definir |
|---|---|---|
| `mac-header.css` | `MacHeader.tsx` | `.mac-header-bar`, `.mac-header-dot`, `.mac-header-title` |
| `hero.css` | `Hero.tsx` | `.hero-section`, `.hero-heading`, `.hero-desc`, `.hero-image-wrapper`, `.hero-image`, `.hero-form`, `.hero-input`, `.hero-btn`, `.hero-error`, `.hero-success` |
| `what-you-get.css` | `WhatYouGet.tsx` | `.wyg-section`, `.wyg-divider`, `.wyg-cards`, `.wyg-card-light`, `.wyg-card-dark`, `.wyg-card-heading`, `.wyg-item`, `.wyg-check`, `.wyg-cross` |
| `about-section.css` | `AboutSection.tsx` | `.about-section`, `.about-container`, `.about-photo`, `.about-heading`, `.about-desc` |
| `footer.css` | `Footer.tsx` | `.footer`, `.footer-container`, `.footer-link`, `.footer-comment` |

## Import Path Pattern

Cada componente importa su CSS directamente:

```tsx
// src/components/landing/Hero.tsx
import "@/styles/hero.css";
```

El `layout.tsx` actualiza el import de `globals.css`:

```tsx
// src/app/layout.tsx
import "@/styles/globals.css";
```

## Implementation Order

1. Mover `globals.css` → `src/styles/globals.css`, actualizar import en `layout.tsx`
2. Crear `mac-header.css` + refactor `MacHeader.tsx`
3. Crear `hero.css` + refactor `Hero.tsx`
4. Crear `what-you-get.css` + refactor `WhatYouGet.tsx`
5. Crear `about-section.css` + refactor `AboutSection.tsx`
6. Crear `footer.css` + refactor `Footer.tsx`
7. Build + lint verification

## Rollback Plan

1. Revertir `layout.tsx` import path
2. Eliminar archivos creados en `src/styles/*.css`
3. Restaurar clases inline en cada componente
