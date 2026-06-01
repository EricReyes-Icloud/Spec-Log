# Refactor: Estilos Modulares en `src/styles/`

## Purpose

Migrar todos los estilos inline de los componentes de la Landing Page desde clases Tailwind directamente en JSX hacia archivos CSS dedicados dentro de `src/styles/`, y mover `globals.css` a esa misma carpeta.

## Context

Actualmente cada componente de landing (`MacHeader`, `Hero`, `WhatYouGet`, `AboutSection`, `Footer`) tiene entre 5 y 15 clases Tailwind inline. Esto dificulta la consistencia y escalabilidad del diseño. La carpeta `src/styles/` ya existe pero está vacía.

## Functional Requirements

### FR1: Estructura de archivos

Se DEBE crear la siguiente estructura:

```
src/styles/
├── globals.css           (movido desde src/app/globals.css)
├── mac-header.css        (estilos de MacHeader)
├── hero.css              (estilos de Hero)
├── what-you-get.css      (estilos de WhatYouGet)
├── about-section.css     (estilos de AboutSection)
└── footer.css            (estilos de Footer)
```

### FR2: Uso de @apply

Cada archivo CSS DEBE usar `@apply` de Tailwind v4 dentro de `@layer components` para definir clases semánticas. Ejemplo:

```css
@layer components {
  .hero-heading {
    @apply text-4xl md:text-5xl font-bold text-brand-carbon mb-4;
  }
}
```

### FR3: Variables del tema

Todos los archivos DEBEN referenciar las variables `@theme` definidas en `globals.css` (`--color-brand-*`) en lugar de valores fijos.

### FR4: Importación

Cada componente DEBE importar su archivo CSS correspondiente. NO se DEBE importar un CSS global de landing desde `layout.tsx`.

### FR5: Nombres de clases semánticos

Las clases DEBEN tener nombres que describan su propósito, no su apariencia. Prefijo del nombre del componente.

| Componente | Prefijo de clase |
|---|---|
| MacHeader | `.mac-header-*` |
| Hero | `.hero-*` |
| WhatYouGet | `.wyg-*` |
| AboutSection | `.about-*` |
| Footer | `.footer-*` |

### FR6: Sin cambios visuales

El diseño visible NO DEBE cambiar. Es un refactor puramente estructural.

## Non-Functional Requirements

- Build (`next build`) DEBE pasar sin errores
- Lint (`next lint`) DEBE pasar sin errores
- La paleta de colores se DEBE mantener idéntica
- No se DEBEN agregar dependencias nuevas

## Out of Scope

- Refactor de estilos del admin o emails
- Cambios en la lógica de componentes
- Nuevos componentes
