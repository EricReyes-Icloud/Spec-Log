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

#### Autenticación
- Firebase Auth (client SDK)
- Firebase Admin SDK

#### Markdown Processing
- react-markdown
- remark-parse / remark-rehype
- rehype-raw / rehype-stringify
- unified

#### Testing
- Vitest
- Testing Library (jest-dom, react)

#### Hosting
- Vercel

#### Diseño
- Figma

---

### Arquitectura

El proyecto sigue una arquitectura modular enfocada en reutilización de componentes y separación clara de responsabilidades. Todo el código fuente vive dentro de `src/`.

```txt
/spec-log
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── subscribe/
│   │   ├── spec-log-info/
│   │   └── admin/
│   │       ├── login/
│   │       ├── editor/[id]/
│   │       └── newsletters/
│   │
│   ├── app/api/
│   │   ├── auth/session/
│   │   ├── newsletter/send/
│   │   └── subscribe/
│   │
│   ├── components/
│   │   ├── email/
│   │   │   └── NewsletterPreview.tsx
│   │   └── landing/
│   │       ├── Hero.tsx
│   │       ├── AboutSection.tsx
│   │       ├── MacHeader.tsx
│   │       ├── Footer.tsx
│   │       ├── EndLog.tsx
│   │       ├── TechnicalLog.tsx
│   │       ├── WhatYouGet.tsx
│   │       ├── WhySpecLog.tsx
│   │       └── SpecLogAccordion.tsx
│   │
│   ├── emails/
│   │   ├── welcome-email.tsx
│   │   └── templates/
│   │       └── weekly-newsletter.tsx
│   │
│   ├── lib/
│   │   ├── firebase-admin.ts
│   │   ├── firebase-client.ts
│   │   ├── markdown-preparser.ts
│   │   └── services/
│   │       ├── email.ts
│   │       └── subscribe.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── hero.css
│   │   ├── footer.css
│   │   ├── mac-header.css
│   │   ├── about-section.css
│   │   ├── tech-log.css
│   │   ├── end-log.css
│   │   ├── what-you-get.css
│   │   ├── why-spec-log.css
│   │   ├── spec-log-info.css
│   │   ├── spec-log-accordion.css
│   │   ├── admin-login.css
│   │   ├── admin-editor.css
│   │   ├── newsletter-template.css
│   │   └── post-registro.css
│   │
│   ├── types/
│   │   └── css.d.ts
│   │
│   ├── utils/
│   │   └── mailto.ts
│   │
│   └── proxy.ts
│
├── openspec/
│   ├── changes/
│   ├── specs/
│   ├── program/
│   └── PR-* files
│
├── imgs/
│
└── public/
```

### Principales responsabilidades

- `src/app/` → Páginas y flujo principal del sistema (landing, suscripción, admin login, editor de newsletters, listado)
- `src/app/api/` → API routes (autenticación Firebase, envío de newsletters, suscripción)
- `src/components/landing/` → Componentes reutilizables de la landing page
- `src/components/email/` → Componentes reutilizables de diseño editorial para emails
- `src/emails/` → Templates de newsletters (welcome email + weekly newsletter)
- `src/lib/` → Configuración de servicios externos (Firebase client + admin, Resend)
- `src/lib/services/` → Lógica de negocio (suscripción, envío de emails)
- `src/styles/` → Sistema visual global (15 archivos CSS)
- `src/utils/` → Utilidades generales
- `src/types/` → Declaraciones de tipos globales
- `openspec/` → Documentación SDD, PRs, cambios planificados y archivados

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

- Profundidad sobre volumen
- Criterio sobre automatización excesiva
- Identidad sobre plantillas genéricas
- Evolución real sobre contenido superficial

La intención es construir una experiencia que refleje cómo piensa y evoluciona un desarrollador mientras diseña sistemas reales utilizando IA como herramienta estratégica y no como reemplazo del razonamiento técnico.

### Estado del Proyecto

En desarrollo activo — fase de consolidación y optimización.

Actualmente el sistema cuenta con:

- Landing page completa con identidad visual propia
- Panel de administración con autenticación Firebase (login, editor de newsletters)
- Flujo de suscripción funcional con persistencia en Firestore
- Sistema de envío de newsletters (welcome email + weekly newsletter) vía Resend
- Templates de email con diseño responsive (compatible con Apple Mail, Gmail)
- Dominio personalizado (speclog.dpdns.org) y deploy en Vercel
- Múltiples ciclos de SDD completados con PRs deployadas a producción
- Pruebas unitarias con Vitest + Testing Library

---

## Autor

Desarrollado por <strong>Eric Reyes</strong>.
