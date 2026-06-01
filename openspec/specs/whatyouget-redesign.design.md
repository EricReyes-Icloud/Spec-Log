# Design: WhatYouGet Redesign — Mini Terminales Mac

## Technical Approach

Reemplazar el componente `WhatYouGet.tsx` plano por dos mini terminales Mac reutilizando el patrón visual del `MacHeader` (dots rojo/amarillo/verde). Los dots usarán una animación CSS `dotHoverGlow` controlada por `:hover` en lugar de la animación automática del header principal. Las cards se estructuran como un contenedor con header + body, aplicando `@layer components` con `@apply` de Tailwind v4.

## Architecture Decisions

| Decisión | Opciones | Elección | Razón |
|---|---|---|---|
| Hover glow en dots | JS + eventos vs CSS puro | **CSS `:hover` + `@keyframes`** | Sin JS, mismo patrón que dotGlow existente pero con `animation: dotHoverGlow 1.2s ease-out` activado por hover |
| Sombra 3D | box-shadow vs filter:drop-shadow vs pseudo-elemento | **`box-shadow` multilple** | Simple, performante, sin elementos extras. `box-shadow: 8px 10px 0px rgba(0,0,0,0.15), ...` |
| Estructura card | Componente anidado vs inline | **Componente `TerminalCard` interno** | Reutiliza la misma estructura para ambas cards (blanca y oscura), cambia solo props de estilo |
| Color #FFC653 | Hardcodeado vs @theme | **`@theme` en globals.css** | Consistente con el resto del proyecto, todas las variables de color están centralizadas |

## File Changes

| Archivo | Acción | Descripción |
|---|---|---|
| `src/styles/globals.css` | Modificar | Agregar `--color-brand-yellow: #FFC653` al `@theme` |
| `src/styles/what-you-get.css` | Reescribir | Nuevos estilos: fondo amarillo, mini terminales, sombra 3D, hover glow |
| `src/components/landing/WhatYouGet.tsx` | Reescribir | Nuevo componente con mini terminales Mac |

## Data Flow

```
WhatYouGet (section)
├── .wyg-comment     → <! ---build.log --->
├── .wyg-header-text → "Esto NO es otro tutorial." + descripción
└── .wyg-cards
    ├── TerminalCard (light)
    │   ├── .terminal-header (dots rojo/amarillo/verde con hover glow)
    │   └── .terminal-body
    │       ├── "// build.in.public"
    │       └── lista ✓ (verde)
    └── TerminalCard (dark)
        ├── .terminal-header (dots con hover glow)
        └── .terminal-body
            ├── "// build.in.public"
            └── lista ✗ (rojo)
```

## Hover Glow Strategy

Se crea un nuevo `@keyframes dotHoverGlow` simplificado (duración ~1.2s, más rápido que el ciclo automático de 9s del header). Se aplica con:

```css
.terminal-dot:hover {
  animation: dotHoverGlow 1.2s ease-out;
}
```

Cada dot (rojo/amarillo/verde) hereda su color de fondo y `currentColor` para el glow, igual que en `mac-header.css`.

## Interfaces

```typescript
interface TerminalCardProps {
  variant: "light" | "dark";
  heading: string;
  items: { label: string; icon: "check" | "cross" }[];
}
```

## Testing Strategy

No aplica — `strict_tdd: false`, sin test runner configurado. Verificación manual via `next build && next lint`.

## Migration

No migration required. Reemplazo directo del componente.
