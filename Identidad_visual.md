# Identidad visual para Spec Log

Este archivo contiene instrucciones sobre el estilo y la identidad visual que construiremos para Spec Log, isntrucciones las cuales los agentes de IA deben entender y seguir.

Algunas indicaciones a tener en cuenta:

1. Hay imagenes llamadas como "Ejemplo" las cuales sirven para ver el estilo de la estructura visual general que deben tener los correos electronicos, no debemos copiar la base visual sino etenderla y luego con base a ello aplicar las isntrucciones posteriores.

2. Hay tres imagenes ya realizadas las cuales se encuentran dentro de la carpeta `public`, las imagenes se llaman: "Header.png", "Logo.png" y "Miniatura.png".

## Instrucciones para la identidad visual:

### HEADER (Tomar como referencia la imagen "Ejemplo 1")

- Barra estilo terminal Mac, tomar la imagen de la carpeta `public`.
- Sin mascota, no la utilizaremos.

### Los comentarios (Tomar como referencia la imagen "Ejemplo 2")

- La referencia maneja los comentarios o divisores del correo electornico como: // Historia
- Nosotros manejaremos el estilo de los comentarios como HTML o JS visualmente hablando:

    <!---------------------- Historia ------------------------>
    /*---------------------- Historia -----------------------*/

### El Bloque “REPLY” (Tomar como referencia la imagen "Ejemplo 3")

- La referencia tiene el siguiente bloque:
``` ↳ reply   cuéntame qué te gustaria leer aquí. ```
- Dicho bloque tiene un fondo rosado y tipografia con color blanco.
- Nuestro diseño de bloques debe tener lo siguiente:
  - fondo naranja
  - texto color negro carbon
  - tipografía monoespaciada

### FOOTER (Tomar como referencia la imagen "Ejemplo 3")

- Nuestro footer debe incluir el siguiente comentario:

    <!-- construyendo sistemas reales con IA -->

- Y debajo:

    [ github.com/ericreyes ]
    [ linkedin.com/in/ericreyes ]

## Paletas de colores

Para el body de todos nuestros emails debemos tener los siguientes colores:

- Texto principal: #1F1F1F
- Comentarios: #E5E5E5
- Identidad (reemplazo del rosa de referencia): #F95616
- Header y Footer: #37302E
- Colores para los botones o circulos de la barra terminal: ° #FF5457 ° #FFC653 ° #56E75D

## Tipografia

- Headings: sans serif gigante y bold
- Comentarios: monospace
- Inputs: monospace
- Botones: monospace


## Diseño visual y estructural Landing Page

```                                                             
  ┌--------------------------------------------------------┐ 
  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                   │  ← barra superior tipo macOS
  │░░°░°░°░░░░ HEADER ──────────────────                   │ 
  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                   │ 
  ├--------------------------------------------------------┤ 
  │                                                        │ 
  │  Spec Log (heading)                 -----------------  │ 
  │  Una bitacora técnica y humana      | Miniatura.png |  │  ← Hero: texto der + formulario izq
  │  sobre construir software...        -----------------  │     (en mobile: apilado vertical)
  │                                     Formulario         │
  |                                                        |
  |                                    [ Tu nombre     ]   | 
  |                                                        | 
  |                                   [ correo@email.com ] |  
  |                                                        | 
  |                                   [ Unirme a Spec Log ]|  ← Boton del formulario
  |                                                        |   
  ├--------------------------------------------------------┤                                    
  │  <!----------------- Qué Recibiras ------------------> |  ← Sección “qué recibirás”
  |                                                        | 
  |        blanco #ffffff           oscuro #37302E         |  
  |  ┌-----------------------┐  ┌------------------------┐ | 
  |  |     Si Recibiras      |  |     No Recibiras       | | 
  |  | ✓ Reflexiones         |  |  x Humo tech           | |  ← Dos tarjetas principales
  |  | ✓ Aprendizajes        |  |  x Tutoriales          | | 
  |  | ✓ Errores             |  |  x 10 prompts          | | 
  |  | ✓ Herramientas        |  |                        | | 
  |  | ✓ Construccion real   |  |                        | |
  |  -------------------------  -------------------------- │ 
  ├--------------------------------------------------------┤ 
  │                                                        | 
  |   Contenedor redondo      Soy Eric Reyes (heading)     |  ← Seccion personal fondo #37302E
  |   para mi foto             Desarrollador full-stack    | 
  |                            especializado en...         │ 
  ├--------------------------------------------------------┤ 
  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                   │   ← Footer: fondo oscuro (#37302E)
  │░░░░░ [github.com/...] [linkedin] ░░░░                  │    links con borde blanco
  │░░░░░ /* Suscríbete a Spec Log...*/ ░░                  │    texto estilo comentario
  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                   │ 
  └--------------------------------------------------------┘ 

                   ↑
          Todo centrado en pantalla
    (flex items-center justify-center, min-h-screen)

```

## Seccion ¿Por qué existe Spec Log?


```
┌──────────────────────────────────────────────────────────---------------------------------------─┐
│                                                                                                  |
│  < !--- why.spec-log --- >                                                                       |
|                                                                                                  |
|  ¿Por qué existe Spec Log? (Heading)                                                             |
│                                                                                                  |
│  La mayoría muestra resultados.                                                                  |
│  Pocos documentan el proceso.                                                                    |
│                                                           ┌────────────────────────────────────┐ |
│  LinkedIn muestra el empleo conseguido.                   |        Header MacOs                | |
|                                                           ├------------------------------------┤| 
|                                                           |                 |                  ||
│  GitHub muestra el proyecto terminado.                    |const profile = {|const proceso {   ||
│  El CV muestra los logros alcanzados.                     |  empleo: true,  |como_llego: null, ||
│                                                           |  proyecto:"fin."|errores: [],      ||
│  Pero casi nadie documenta:                               |logros:["ascenso"|aprendizajes: [], ||
│                                                           |,"certificación]"|cambios: []       ||
│     → Cómo aprendió                                       |resultados:visi..| };               ||
│     → Qué errores cometió                                 |};               |                  ||
│     → Qué decisiones tomó                                 └------------------------------------┘ |
│     → Qué tuvo que replantear                                                                    |
│     → Qué descubrió durante el camino                                                            |
│                                                                                                  |
│  ¡Spec Log existe para registrar esa parte!                                                      |
│                                                                                                  |
└─────────────────────────────────────────────────────────----------------------------------------─┘

```

## Bitacora Tecnica diseño

```
┌─────────────────────────────────────────────┐
│                                             │
│  [LOG-014]                         5 min    │ → [LOG-014] en naranja principal
│                                             │
│  La IA tenía razón.                         │ → Heading en color negro carbon ya establecido
│  Y eso me preocupó.                         │
│                                             │
│  Durante semanas pensé que conocía la       │ → Tipografia Inter font-size: 15px;
│  respuesta correcta. La IA insistía en      │
│  otra dirección...                          │
│                                             │
│  leer registro →                            │ → Negro carbon y la flecha en naranja
│                                             │
└─────────────────────────────────────────────┘

```

## Bitacora Tecnica contenido

```
---------------------------------------------------------------------------------------------------
La IA tenía razón. Y eso me preocupó.

Durante semanas pensé que conocía la respuesta correcta. La IA insistía en otra dirección. Al principio asumí que estaba equivocada. Después entendí que el problema no era la calidad de la respuesta. Era mi resistencia a cuestionar mis propias ideas.
---------------------------------------------------------------------------------------------------
Mi backend funcionaba… hasta que entendí el negocio.

Las APIs respondían. La base de datos estaba bien diseñada. Las pruebas pasaban. Técnicamente todo funcionaba. El problema era que había construido exactamente lo que me pidieron, no lo que realmente necesitaban.   
---------------------------------------------------------------------------------------------------
Firestore casi rompe mi arquitectura.

Elegí Firestore porque quería avanzar rápido. Durante un tiempo fue una decisión perfecta. Hasta que aparecieron nuevos requerimientos y descubrí que algunas decisiones tomadas por comodidad se convierten después en restricciones muy costosas.
---------------------------------------------------------------------------------------------------
La IA aceleró mi código. También mis errores.

Nunca había desarrollado tan rápido. Componentes completos en minutos. Funcionalidades enteras en una tarde. El problema es que los errores también llegaron más rápido. Aprendí que aumentar la velocidad sin aumentar el criterio tiene consecuencias.
---------------------------------------------------------------------------------------------------
El proyecto falló antes de escribir una sola línea.

No hubo bugs. No hubo errores de despliegue. No hubo problemas de infraestructura. El proyecto estaba condenado mucho antes de abrir el editor. El verdadero problema estaba en algo que casi nadie quiere hacer: definir correctamente qué se está construyendo.
---------------------------------------------------------------------------------------------------
Intenté automatizar algo que debía entender primero.

Creía que podía ahorrar tiempo automatizando un proceso repetitivo. Después descubrí que ni siquiera comprendía completamente cómo funcionaba ese proceso. La automatización amplificó la confusión en lugar de resolverla.
---------------------------------------------------------------------------------------------------
Subestimé el poder de una buena especificación.

Pensaba que las especificaciones eran burocracia. Documentos que retrasaban el trabajo real. Cambié de opinión cuando un proyecto dejó de avanzar por falta de claridad. A veces una hora definiendo el problema ahorra días enteros de desarrollo.
---------------------------------------------------------------------------------------------------
Documentar cambió mi forma de desarrollar.

Comencé a escribir notas para no olvidar detalles importantes. Con el tiempo descubrí algo inesperado: documentar no solo sirve para recordar. También sirve para pensar mejor. Muchas de mis mejores decisiones aparecieron mientras intentaba explicarme el problema a mí mismo.
---------------------------------------------------------------------------------------------------
```

## Ultima seccion Terminal final

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ █                                                          │ ← spec-log en verde
│                                                                        │   : en blanco
│                                                                        │   ~ azul claro grisaceo
│                                                                        │   $ amarillo claro
│                                                                        │   █ en blanco
│                                                                        │
│                                                                        │
│                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```

### Flujo de animación:

01. INICIO

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ █                                                          │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```
02. Escribiendo...

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ Gracias por llegar hasta aqui.█                            │ ← Tipografia
│                                                                        │   monoespaciada en color
│                                                                        │   blanco
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```
03. Continua...

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ Gracias por llegar hasta aqui.                             │ ← > debe ser en naranja 
│ > Si llegaste hasta este punto,                                        │     principal
│   probablemente te interesa algo más                                   │
│   que acumular tutoriales.█                                            │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```
04. Casi termina...

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ Gracias por llegar hasta aqui.                             │
│ > Si llegaste hasta este punto,                                        │
│   probablemente te interesa algo más                                   │
│   que acumular tutoriales.                                             │
│                                                                        │
│ > Quizás te interesa construir,                                        │
│   aprender y documentar el proceso.█                                   │
│                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```
05. Mensaje completo...

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ Gracias por llegar hasta aqui.                             │
│ > Si llegaste hasta este punto,                                        │
│   probablemente te interesa algo más                                   │
│   que acumular tutoriales.                                             │
│                                                                        │
│ > Quizás te interesa construir,                                        │
│   aprender y documentar el proceso.                                    │
│                                                                        |
| > Eso es exactamente lo que                                            |
|   encontrarás en Spec Log. █                                           |
|                                                                        |
|                                                                        │
└------------------------------------------------------------------------┘

```
06. Cita final...

```
┌------------------------------------------------------------------------┐
│                                                                        │
│  ° ° °                                                                 │
│------------------------------------------------------------------------│
│                                                                        │
│ spec-log:~$ Gracias por llegar hasta aqui.                             │
│ > Si llegaste hasta este punto,                                        │
│   probablemente te interesa algo más                                   │
│   que acumular tutoriales.                                             │
│                                                                        │
│ > Quizás te interesa construir,                                        │
│   aprender y documentar el proceso.                                    │
│                                                                        |
| > Eso es exactamente lo que                                            |
|   encontrarás en Spec Log.                                             |
|                                                                        |
| > Solo se trata de tomar una pequeña desición:                         | ← No colocamos el █ en
|                                                                        │   esta ultima cita
└------------------------------------------------------------------------┘

                         [ ↑ Unirme a Spec Log  ]                          ← Mismo botón del Hero 
                                                                             pero con ↑
```
