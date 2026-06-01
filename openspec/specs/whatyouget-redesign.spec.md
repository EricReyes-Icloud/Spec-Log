# Rediseño: Sección Qué Recibirás (WhatYouGet)

## Purpose

Rediseñar la sección "Qué Recibirás" de la Landing Page de Spec Log para transformar las cards planas actuales en dos mini terminales Mac con identidad técnica, animaciones hover y efecto 3D.

## Context

Actualmente la sección WhatYouGet tiene dos cards sin estructura de terminal, sin sombras, sin animaciones. El rediseño busca alinear esta sección con la identidad visual del proyecto (estilo terminal Mac, colores naranja #F95616, comentarios técnicos). El patrón de header Mac con dots animados ya existe en `mac-header.css` y será reutilizado y adaptado.

## Functional Requirements

### FR1: Fondo de sección

El fondo de la sección DEBE ser `#FFC653` (amarillo). Este color DEBE agregarse al `@theme` en `globals.css` como `--color-brand-yellow: #FFC653`.

### FR2: Comentario superior

Un comentario DEBE aparecer al inicio de la sección, alineado a la izquierda, en color naranja (`#F95616`), con el texto: `< !---build.log --->`.

### FR3: Bloque descriptivo

Debajo del comentario DEBE haber:

- Un título en `font-size: 36px` con el texto: **"Esto NO es otro tutorial."**
- Un párrafo en `font-size: 20px` con el texto: "Internet está lleno de personas explicando qué hacer. Spec Log documenta lo que ocurre cuando intentas hacerlo de verdad."

### FR4: Mini terminales Mac (cards)

Se DEBEN mostrar dos tarjetas una al lado de la otra (side-by-side en desktop, apiladas en mobile):

| Propiedad | Valor |
|---|---|
| Ancho | `750px` cada una |
| Alto | `317px` cada una |
| Borde redondeado | Sí (consistente con el diseño actual, `rounded-xl`) |

Cada tarjeta DEBE tener un **header estilo terminal Mac** con tres dots (rojo `#FF5457`, amarillo `#FFC653`, verde `#56E75D`) que repliquen visualmente el `MacHeader` de la landing.

### FR5: Cards — variantes de color

- **Card izquierda (Sí Recibirás)**: Fondo blanco (`#FFFFFF`), texto color carbon (`#1F1F1F`), checkmarks (`✓`) en **verde**.
- **Card derecha (No Recibirás)**: Fondo oscuro (`#37302E`), texto blanco, cruces (`✗`) en rojo.

### FR6: Contenido de las cards

Cada card DEBE mostrar:

1. Un comentario en naranja `// build.in.public` (idéntico en ambas cards)
2. La lista de items correspondiente:
   - **Sí Recibirás**: Reflexiones, Aprendizajes, Errores, Herramientas, Construcción real
   - **No Recibirás**: Humo tech, Tutoriales, 10 prompts

### FR7: Sombra 3D

Cada card DEBE tener una sombra con efecto 3D que las haga parecer tarjetas elevadas. La sombra DEBE ser consistente entre ambas cards.

### FR8: Hover glow en dots

Los tres dots del header de cada card DEBEN iluminarse (glow effect) al hacer **hover** sobre cada dot individualmente. El efecto DEBE ser similar a la animación `dotGlow` existente en `mac-header.css`, pero activado por interacción del usuario (`:hover`) en lugar de animación automática.

### FR9: Layout responsive

En mobile (pantallas menores a `md`), las cards DEBEN apilarse verticalmente una debajo de la otra.

## Non-Functional Requirements

- `next build` DEBE pasar sin errores
- `next lint` DEBE pasar sin errores
- Los estilos DEBEN usar `@layer components` con `@apply` de Tailwind v4, siguiendo el patrón establecido en `src/styles/`
- Las nuevas clases DEBEN mantener el prefijo `.wyg-*`
- El color `#FFC653` DEBE definirse en `@theme` de `globals.css`, no como valor fijo

## Out of Scope

- Modificar otras secciones de la landing
- Agregar lógica JavaScript nueva (todo debe ser CSS + HTML/JSX)
- Cambiar el contenido textual de los items (se mantienen los actuales)
