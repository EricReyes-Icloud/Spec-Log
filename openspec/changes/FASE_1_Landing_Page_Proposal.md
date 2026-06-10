# FASE 1 — Landing Page Proposal

## Status
Proposed (updated with feedback)

## Intent
Estamos construyendo la landing page pública de Spec Log en la ruta raíz (`/`). La página presentará el proyecto Spec Log, comunicará su propuesta de valor (newsletters técnicas personalizadas) y proporcionará un formulario de suscripción con campo de email y botón Suscríbete, preparando el terreno para la fase de almacenamiento de correos.

## Scope

### IN
- Header con la imagen `Header.png` únicamente (sin texto, sin navegación)
- Hero section con la imagen `Miniatura.png` y la descripción del proyecto
- Formulario de suscripción: campo email + botón "Suscríbete" con fondo naranja (#F97316) y texto negro carbón (#1F1F1F)
- Footer como rectángulo con fondo #37302E que incluye:
  - Comentario: `/* Suscríbete a Spec Log — construyendo sistemas reales con IA como copiloto */`
  - Enlaces: `[ github.com/ericreyes ]` y `[ linkedin.com/in/ericreyes ]` en contenedor con borde blanco, sin fondo, tipografía blanca
- Diseño mobile-first y responsive

### OUT
- Procesamiento de suscripción (se hará en Fase 2)
- Autenticación, admin dashboard, analytics
- Dark mode o theme switching
- Integración con servicios externos (Resend, Supabase) para la suscripción

## Approach
1. **Next.js App Router**: Usar `src/app/page.tsx` como server component
2. **Visual Identity**: 
   - Header.png ocupando el ancho completo en la parte superior
   - Colores: #1F1F1F (texto), #E5E5E5 (comentarios), #F97316 (identidad/botón), #37302E (footer)
   - Tipografía: sans-serif para cuerpo, monoespaciada para detalles técnicos
3. **Tailwind CSS v4**: Utility classes para todo el styling
4. **Imágenes**: `Header.png` y `Miniatura.png` ubicadas en `public/`
5. **Footer**: Fondo #37302E, comentario en estilo código, enlaces en contenedor con borde blanco

## User Stories
1. Como visitante, quiero entender qué es Spec Log apenas llego a la página.
2. Como visitante, quiero poder suscribirme con mi email de forma rápida y visible.
3. Como visitante, quiero que la página cargue rápido y se vea bien en móvil.
4. Como visitante, quiero ver el estilo técnico/desarrollador reflejado en el diseño.

## Risks and Unknowns
- El formulario de suscripción es frontend-only por ahora; la lógica de almacenamiento vendrá en Fase 2
- Las imágenes Header.png y Miniatura.png deben existir en `public/` y tener buen aspecto en todos los tamaños
- Contraste del naranja (#F97316) sobre el footer (#37302E) y en el botón

## Rollback Plan
Revertir cambios en `src/app/page.tsx` y cualquier archivo nuevo creado para la landing page. Sin cambios de base de datos ni API, el rollback es trivial.

---

*Propuesta actualizada siguiendo feedback — 25 Mayo 2026*
