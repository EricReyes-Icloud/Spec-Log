# Tasks: Refactor Estilos Modulares

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Decision needed before apply | No |

---

### Task 1: Mover globals.css

**Files:**
- `src/app/globals.css` → `src/styles/globals.css` (MOVER)
- `src/app/layout.tsx` (MODIFICAR)

**Description:** Mover `globals.css` de `src/app/` a `src/styles/` y actualizar el import en `layout.tsx`.

**Acceptance Criteria:**
- `src/styles/globals.css` existe con el contenido original
- `src/app/globals.css` ya no existe
- `layout.tsx` importa `@/styles/globals.css`

**Dependencies:** None

---

### Task 2: MacHeader — extraer estilos

**Files:**
- `src/styles/mac-header.css` (CREAR)
- `src/components/landing/MacHeader.tsx` (MODIFICAR)

**CSS Classes to create:**
- `.mac-header-bar` — contenedor del header
- `.mac-header-dot` — círculos de colores
- `.mac-header-title` — texto "Spec Log" centrado

**Acceptance Criteria:**
- CSS archivo creado con `@layer components` y `@apply`
- Componente importa el CSS y usa clases semánticas
- Visualmente idéntico al original

**Dependencies:** Task 1

---

### Task 3: Hero — extraer estilos

**Files:**
- `src/styles/hero.css` (CREAR)
- `src/components/landing/Hero.tsx` (MODIFICAR)

**CSS Classes to create:**
- `.hero-section` — contenedor del section
- `.hero-heading` — h1 "Spec Log"
- `.hero-desc` — párrafo descriptivo
- `.hero-image-wrapper` — contenedor de la imagen
- `.hero-image` — la imagen Miniatura
- `.hero-form` — el form
- `.hero-input` — inputs (name + email)
- `.hero-btn` — botón "Unirme a Spec Log"
- `.hero-error` — mensaje de error
- `.hero-success` — mensaje de éxito

**Note:** Mantener la lógica del estado del formulario intacta. Solo cambiar className strings.

**Acceptance Criteria:**
- CSS archivo creado con `@layer components` y `@apply`
- Componente importa el CSS y usa clases semánticas
- Estados (submitting, success, error, hover) preservados
- Visualmente idéntico al original

**Dependencies:** Task 1

---

### Task 4: WhatYouGet — extraer estilos

**Files:**
- `src/styles/what-you-get.css` (CREAR)
- `src/components/landing/WhatYouGet.tsx` (MODIFICAR)

**CSS Classes to create:**
- `.wyg-section` — contenedor
- `.wyg-divider` — divisor estilo comentario
- `.wyg-cards` — contenedor flex de las dos cards
- `.wyg-card-light` — card blanca "Sí Recibirás"
- `.wyg-card-dark` — card oscura "No Recibirás"
- `.wyg-card-heading` — heading de cada card
- `.wyg-item` — cada ítem de la lista
- `.wyg-check` — checkmark ✓
- `.wyg-cross` — cross ✗

**Acceptance Criteria:**
- CSS archivo creado con `@layer components` y `@apply`
- Componente importa el CSS y usa clases semánticas
- Visualmente idéntico al original

**Dependencies:** Task 1

---

### Task 5: AboutSection — extraer estilos

**Files:**
- `src/styles/about-section.css` (CREAR)
- `src/components/landing/AboutSection.tsx` (MODIFICAR)

**CSS Classes to create:**
- `.about-section` — contenedor del section
- `.about-container` — wrapper flex del contenido
- `.about-photo` — contenedor circular de la foto
- `.about-heading` — heading "Soy Eric Reyes"
- `.about-desc` — párrafo descriptivo

**Acceptance Criteria:**
- CSS archivo creado con `@layer components` y `@apply`
- Componente importa el CSS y usa clases semánticas
- Visualmente idéntico al original

**Dependencies:** Task 1

---

### Task 6: Footer — extraer estilos

**Files:**
- `src/styles/footer.css` (CREAR)
- `src/components/landing/Footer.tsx` (MODIFICAR)

**CSS Classes to create:**
- `.footer` — contenedor del footer
- `.footer-container` — wrapper interno
- `.footer-link` — anchor de cada red social
- `.footer-comment` — texto de comentario

**Acceptance Criteria:**
- CSS archivo creado con `@layer components` y `@apply`
- Componente importa el CSS y usa clases semánticas
- Visualmente idéntico al original

**Dependencies:** Task 1

---

### Task 7: Verificación — build + lint

**Files:** Todos los modificados

**Description:** Ejecutar build y lint para verificar que no hay errores.

**Acceptance Criteria:**
- `npm run build` pasa sin errores
- `npm run lint` pasa sin errores

**Dependencies:** Tasks 2, 3, 4, 5, 6
