# Tasks: Rediseño Landing Page V2

## Review Workload Forecast

- Estimated changed lines: ~320
- 400-line budget risk: Low
- Decision needed before apply: No

## Task List

### Task 1: MacHeader — Barra estilo terminal macOS

**File:** `src/components/landing/MacHeader.tsx` (CREATE)

**Description:** Crear el componente de la barra superior estilo terminal macOS con los tres círculos de colores y el texto "Spec Log" centrado.

**Acceptance Criteria:**
- Fondo `#37302E`
- Tres círculos a la izquierda: rojo `#FF5457`, amarillo `#FFC653`, verde `#56E75D`
- Texto "Spec Log" centrado con fuente monospace
- Bordes superiores redondeados
- Altura fija y proporcional

**Dependencies:** None

---

### Task 2: Hero — Heading, miniatura y formulario integrado

**File:** `src/components/landing/Hero.tsx` (MODIFY)

**Description:** Rediseñar el Hero con heading "Spec Log" + descripción a la izquierda, `Miniatura.png` a la derecha, y formulario con nombre + email + botón "Unirme a Spec Log" debajo.

**Acceptance Criteria:**
- Layout desktop: texto izq (50%), imagen der (50%)
- Layout mobile: apilado vertical, imagen primero
- Formulario con campo nombre (`"Tu nombre"`), email (`"correo@email.com"`), y botón `"Unirme a Spec Log"`
- Validación de nombre (requerido) y email (formato)
- Estados: submitting, success, error
- Fuente monospace en inputs y botón
- Botón con bg `#F97316` y texto `#1F1F1F`

**Dependencies:** None

---

### Task 3: WhatYouGet — Sección "Qué Recibirás"

**File:** `src/components/landing/WhatYouGet.tsx` (CREATE)

**Description:** Crear la sección con divider estilo comentario y dos tarjetas: "Sí Recibirás" (blanco) y "No Recibirás" (oscuro).

**Acceptance Criteria:**
- Divider: `<!---------------------- Qué Recibiras ------------------>` en `#E5E5E5` monospace
- Tarjeta blanca `#FFFFFF` con items ✓ (Reflexiones, Aprendizajes, Errores, Herramientas, Construcción real)
- Tarjeta oscura `#37302E` con items ✗ (Humo tech, Tutoriales, 10 prompts)
- Desktop: side by side. Mobile: stacked.
- Monospace font para items

**Dependencies:** None

---

### Task 4: AboutSection — Sección personal

**File:** `src/components/landing/AboutSection.tsx` (CREATE)

**Description:** Crear la sección de presentación personal con foto circular y texto.

**Acceptance Criteria:**
- Fondo `#37302E`
- Contenedor circular para foto (placeholder con `bg-gray-400` o similar)
- Heading "Soy Eric Reyes" en bold grande
- Texto descriptivo: "Desarrollador full-stack especializado en..."
- Texto blanco `#FFFFFF`
- Centrado horizontalmente

**Dependencies:** None

---

### Task 5: Footer — Ajuste de comentario

**File:** `src/components/landing/Footer.tsx` (MODIFY)

**Description:** Verificar y ajustar el texto del comentario en el footer para que coincida con el diseño.

**Acceptance Criteria:**
- Comentario en monospace
- Links `[github.com/ericreyes]` y `[linkedin.com/in/ericreyes]` con borde blanco
- Fondo `#37302E`

**Dependencies:** None

---

### Task 6: page.tsx — Integración final

**File:** `src/app/page.tsx` (MODIFY)

**Description:** Reestructurar la página principal para incluir todos los nuevos componentes y eliminar los viejos.

**Acceptance Criteria:**
- Importar: MacHeader, Hero, WhatYouGet, AboutSection, Footer (en ese orden)
- No importar: Header (viejo), SubscribeForm
- Layout: `min-h-screen flex items-center justify-center`
- Contenedor principal con `max-w-4xl` y bordes redondeados
- Todo centrado

**Dependencies:** Tasks 1-5 must be complete

---

### Task 7: Limpiar archivos obsoletos

**Description:** Eliminar los componentes que ya no se usan.

**Acceptance Criteria:**
- `src/components/landing/Header.tsx` eliminado
- `src/components/landing/SubscribeForm.tsx` eliminado

**Dependencies:** Task 6 complete

## Rollback Plan

If the redesign needs to be rolled back:
1. Revert `src/app/page.tsx` to the previous version
2. Restore `Header.tsx` and `SubscribeForm.tsx` from git
3. Remove new components: MacHeader, WhatYouGet, AboutSection
4. Revert Footer.tsx and Hero.tsx changes
