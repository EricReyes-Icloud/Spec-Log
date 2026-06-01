# Sección: ¿Por qué existe Spec Log?

## Purpose

Nueva sección en la Landing Page que explica el propósito y la filosofía detrás de Spec Log, contrastando la cultura de "mostrar resultados" con la realidad de documentar el proceso.

## Context

La landing actual tiene: MacHeader → Hero → WhatYouGet → AboutSection → Footer. Esta sección se inserta entre WhatYouGet y AboutSection.

## Visual Reference

Ver `Identidad_visual.md` sección "Seccion ¿Por qué existe Spec Log?".

## Functional Requirements

### FR1: Fondo
El fondo DEBE ser blanco (`bg-white`).

### FR2: Comentario superior
Un comentario DEBE aparecer al inicio: `< !--- why.spec-log --- >` alineado a la izquierda en color comentario.

### FR3: Heading
Heading "¿Por qué existe Spec Log?" con "Spec Log" en color naranja (`#F95616`).

### FR4: Párrafos descriptivos
- "La mayoría muestra resultados."
- "Pocos documentan el proceso."
- "LinkedIn muestra el empleo conseguido."
- "GitHub muestra el proyecto terminado."
- "El CV muestra los logros alcanzados."
- "Pero casi nadie documenta:"
Todas las apariciones de "Spec Log" DEBEN estar en naranja principal.

### FR5: Lista con flechas verdes
- → Cómo aprendió
- → Qué errores cometió
- → Qué decisiones tomó
- → Qué tuvo que replantear
- → Qué descubrió durante el camino
Las flechas → DEBEN ser verdes (`#56E75D`) mismo color que los ✓ de WhatYouGet.

### FR6: Frase final
"¡Spec Log existe para registrar esa parte!" DEBE tener el mismo font-size que el heading de la sección. "Spec Log" en naranja.

## Non-Functional Requirements
- `next build` DEBE pasar sin errores
- `next lint` DEBE pasar sin errores
- Clases con prefijo `.why-*`

## File Changes
| Archivo | Acción |
|---------|--------|
| `src/styles/why-spec-log.css` | Crear |
| `src/components/landing/WhySpecLog.tsx` | Crear |
| `src/app/page.tsx` | Modificar (importar e insertar) |
