# PR 1 — Infraestructura y Componentes de Landing Page

**Branch destino:** `feature/fase-1-landing-page` (tracker branch)

---

## Description

Este PR implementa la infraestructura base y todos los componentes visuales de la landing page de Spec Log:
- Header con imagen `Header.png`
- Hero con `Miniatura.png` y descripción del proyecto
- Formulario de suscripción con validación client-side
- Footer con identidad visual
- Configuración de estilos globales y Tailwind CSS v4

No incluye la integración final en `page.tsx` (se entrega en PR 2).

---

## Changes made

### Infraestructura
- `src/app/globals.css` — Tailwind CSS v4 con `@theme` para colores personalizados (#F97316, #1F1F1F, #37302E, #E5E5E5)
- `src/app/layout.tsx` — Root layout con metadatos, fuente sans-serif, color base `text-brand-carbon`
- `src/app/page.tsx` — Export mínimo (`return null`) para que el proyecto compile (placeholder, se reemplaza en PR 2)
- `src/components/landing/` — directorio para componentes de landing

### Componentes
- `src/components/landing/Header.tsx` — renderiza `Header.png` full-width con `next/image`, alt text accesible, `priority` para carga rápida
- `src/components/landing/Hero.tsx` — renderiza `Miniatura.png` + párrafo descriptivo, layout responsive (flex-col mobile, flex-row md+)
- `src/components/landing/SubscribeForm.tsx` — campo email (monospace) + botón "Suscríbete" (bg `#F97316`, text `#1F1F1F`). Validación: email vacío, formato inválido. Estados: idle, loading, error, success. ARIA attributes para accesibilidad.
- `src/components/landing/Footer.tsx` — fondo `#37302E`, comentario estilo código, enlaces GitHub/LinkedIn en contenedor con borde blanco

---

## Impact

- **+5 archivos nuevos** (globals.css, layout.tsx, 4 componentes)
- **+1 archivo modificado** (page.tsx — placeholder temporal)
- **Sin cambios en base de datos, APIs, o dependencias**
- **Build: ✅** — compila sin errores, TypeScript ok

---

## Notes

- Los componentes son Client Components (`"use client"`) donde se necesita interactividad (SubscribeForm)
- El botón usa `bg-brand-orange` con `text-brand-carbon` según especificación visual
- El formulario NO persiste datos aún — es frontend-only. El stub de servicio se agrega en PR 2
- Las imágenes `Header.png` y `Miniatura.png` deben existir en `public/`
