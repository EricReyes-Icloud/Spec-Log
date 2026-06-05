<div align="center">

<img src="./imgs/Miniatura oficial Spec Log.png" />

## Spec Log

<p>
Sistema editorial técnico orientado al envío de newsletters personalizadas, diseñado para documentar procesos reales de desarrollo, arquitectura de software y evolución profesional utilizando IA como copiloto bajo un enfoque de Spec-Driven Development.
</p>

</div>

---

### Descripción

Spec Log es una plataforma minimalista de newsletters desarrollada con una filosofía centrada en producto, claridad técnica y control total sobre la experiencia visual y editorial.

El proyecto nace como una alternativa a plataformas tradicionales de newsletters que limitan significativamente la personalización visual y estructural del contenido. En lugar de depender de editores cerrados, Spec Log busca construir un sistema propio capaz de generar y enviar correos con identidad visual consistente y componentes reutilizables desarrollados directamente con React.

Más que una newsletter tradicional, Spec Log funciona como una bitácora técnica personal enfocada en:

- Decisiones de arquitectura
- Problemas reales de desarrollo
- Errores y aprendizajes
- Integración de IA en flujos de trabajo
- Evolución profesional como desarrollador Full-Stack

El proyecto prioriza simplicidad operativa, escalabilidad progresiva y una experiencia editorial limpia inspirada en documentación técnica moderna.

---

### Objetivo

Diseñar un sistema ligero y escalable para la creación y envío de newsletters personalizadas con identidad visual propia, permitiendo documentar procesos reales de ingeniería de software sin depender de plataformas externas limitadas a nivel de diseño y experiencia editorial.

---

### Stack Tecnológico

#### Frontend
- React
- Next.js
- Tailwind CSS

#### Email Rendering
- React Email

#### Envío de correos
- Resend

#### Persistencia
- Firebase Firestore

#### Hosting
- Vercel

#### Diseño
- Figma / Canva

---

### Arquitectura

El proyecto sigue una arquitectura modular enfocada en reutilización de componentes y separación clara de responsabilidades.

```txt
/spec-log
│
├── app/
│   ├── page.tsx
│   ├── subscribe/
│   └── admin/
│
├── components/
│   └── email/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ReplyBox.tsx
│       └── CodeComment.tsx
│   
│  
│
├── emails/
│   └── templates/
│       └── weekly-newsletter.tsx
│
├── lib/
│   ├── resend/
│   ├── supabase/
│   └── services/
│
└── styles/
│
└── data/
```

### Principales responsabilidades

- app/ → páginas y flujo principal del sistema
- components/email/ → componentes reutilizables del diseño editorial
- emails/templates/ → estructura de newsletters
- lib/services/ → lógica de negocio y servicios
- styles/ → sistema visual global
- data/ → Persistencia simple

### Principios Utilizados

- Componentización
- Reutilización de interfaces
- Arquitectura modular
- Spec-Driven Development
- Mobile First
- Diseño editorial minimalista
- Escalabilidad progresiva
- Separación de responsabilidades
- Consistencia visual


### Desarrollo Asistido por IA

El proyecto incorpora IA como copiloto de desarrollo bajo un enfoque supervisado y dirigido por especificaciones.

La IA es utilizada para:

- Acelerar implementación
- Generación inicial de componentes
- Exploración de soluciones
- Refactorización
- Validación estructural
- Optimización de flujos

Todas las decisiones arquitectónicas y validaciones finales son supervisadas y controladas manualmente.

### Filosofía del Proyecto

Spec Log no busca convertirse en una plataforma masiva de newsletters, sino en un sistema editorial técnico cuidadosamente diseñado alrededor de una idea simple:

> documentar procesos reales de construcción de software con claridad, criterio técnico y consistencia visual.

#### El proyecto prioriza:

profundidad sobre volumen
criterio sobre automatización excesiva
identidad sobre plantillas genéricas
evolución real sobre contenido superficial

La intención es construir una experiencia que refleje cómo piensa y evoluciona un desarrollador mientras diseña sistemas reales utilizando IA como herramienta estratégica y no como reemplazo del razonamiento técnico.

### Estado del Proyecto

En desarrollo activo.

Actualmente se encuentra en fase de:

- Definición arquitectónica
- Diseño visual del sistema editorial
- Construcción de componentes base
- Integración del flujo de suscripción y envío de correos

---

## Autor

Desarrollado por <strong>Eric Reyes</strong>.