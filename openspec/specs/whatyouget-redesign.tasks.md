# Tasks: WhatYouGet Redesign — Mini Terminales Mac

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~200 (low risk) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | ask-on-risk |
| Decision needed before apply | No |

---

## Phase 1: Theme & Styles

### Task 1.1: Add `brand-yellow` to Theme

- **Description**: Agregar el color `#FFC653` al `@theme` en `globals.css` como `--color-brand-yellow`.
- **Files**: `src/styles/globals.css`
- **Acceptance Criteria**:
  - `--color-brand-yellow: #FFC653` existe en el bloque `@theme`
  - El build y lint pasan sin errores
- **Dependencies**: None

### Task 1.2: Rewrite `what-you-get.css` con nuevos estilos

- **Description**: Reescribir completamente los estilos de la sección WhatYouGet con:
  - Fondo de sección: `bg-brand-yellow`
  - Comentario `<! ---build.log --->` en brand-orange alineado izquierda
  - Título 36px + descripción 20px
  - Estructura de mini terminal Mac (header con dots + body)
  - Sombra 3D con `box-shadow` múltiple
  - Animación `@keyframes dotHoverGlow` para hover en dots
  - Checkmarks verdes en card light
  - Responsive: apilado en mobile
- **Files**: `src/styles/what-you-get.css`
- **Acceptance Criteria**:
  - Todas las clases usan prefijo `.wyg-*`
  - Usa `@reference "./globals.css"` y `@layer components`
  - Usa `@apply` con utilidades nativas de Tailwind (sin `@apply` de clases propias)
  - Build y lint pasan
- **Dependencies**: Task 1.1

---

## Phase 2: Component

### Task 2.1: Rewrite `WhatYouGet.tsx` con mini terminales

- **Description**: Reescribir el componente con:
  - Sección con fondo amarillo
  - Comentario `<! ---build.log --->`
  - Bloque "Esto NO es otro tutorial." + descripción
  - Dos `TerminalCard` (light/dark) con:
    - Header con dots rojo/amarillo/verde + hover glow
    - Comentario `// build.in.public` en brand-orange
    - Lista de items con ✓ verdes (light) o ✗ rojas (dark)
  - Responsive: cards side-by-side en desktop, apiladas en mobile
  - Ancho 750px, alto 317px por card
- **Files**: `src/components/landing/WhatYouGet.tsx`
- **Acceptance Criteria**:
  - Importa `@/styles/what-you-get.css`
  - Reutiliza colores del `@theme` (brand-orange, brand-carbon, brand-footer, brand-yellow)
  - Build y lint pasan
- **Dependencies**: Task 1.2

---

## Phase 3: Verification

### Task 3.1: Build & Lint

- **Description**: Verificar que `next build` y `next lint` pasan sin errores.
- **Files**: Todos los modificados
- **Acceptance Criteria**:
  - `npm run build` exitoso
  - `npm run lint` exitoso
- **Dependencies**: Tasks 2.1
