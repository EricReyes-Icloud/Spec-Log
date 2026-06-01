# Propuesta: Rediseño de la sección Qué Recibirás (WhatYouGet)

## Intent

Transformar la sección "Qué Recibirás" de la Landing Page de Spec Log de un par de cards planas a una experiencia visual con dos mini terminales Mac (una blanca y una negra) que reflejen la identidad técnica del proyecto.

## Scope

- **Incluye**: Rediseño completo del componente `WhatYouGet.tsx`, reescritura total de `what-you-get.css`, nueva paleta de colores
- **No incluye**: Cambios en otras secciones, lógica de negocio, funcionalidad nueva

## Approach

1. Fondo de sección amarillo `#FFC653` que contraste con el resto de la landing
2. Comentario estilo log `< !---build.log --->` en naranja alineado a la izquierda
3. Bloque de texto con título "Esto NO es otro tutorial." + párrafo descriptivo
4. Dos mini terminales Mac de 750×317px con su propio header de dots (rojo/amarillo/verde)
   - Card blanca (fondo claro): items "Sí Recibirás" con checkmarks verdes
   - Card negra (fondo oscuro `#37302E`): items "No Recibirás" con cruces
5. Comentario `// build.in.public` en naranja sobre el contenido de cada card
6. Sombra 3D en cada card para efecto de profundidad
7. Dots del header con glow animado al hacer hover (reutilizando patrón `dotGlow` adaptado)

## Rollback Plan

- El componente actual `WhatYouGet.tsx` y `what-you-get.css` serán respaldados por git
- Si algo sale mal, `git checkout HEAD -- src/components/landing/WhatYouGet.tsx src/styles/what-you-get.css` restaura los originales

## Risks

- El color `#FFC653` no está en el `@theme` actual — hay que agregarlo
- La animación hover glow necesita una variante separada de `dotGlow` (la actual es automática, no por interacción)
- No hay patrón de sombra 3D en el proyecto — implementación nueva
