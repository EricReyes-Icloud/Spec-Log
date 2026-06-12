# Program: Newsletter System — Spec Log

## Vision

Sistema completo de creación, preview, y envío de newsletters personalizadas con identidad visual fija. El admin escribe en Markdown extendido con bloques custom, previsualiza en vivo, y publica a todos los subscriptores activos vía Resend.

## Data Flow

```
[Admin escribe en Markdown]
         │
         ▼
[Pre-parser: transforma bloques custom]
  • <Highlight> → span.naranja
  • <Comment>  → <!-- comment -->
  • :::tip    → div.callout-tip
  • :::cta $x → a.cta-btn href="/x"
         │
    ┌────┴────┐
    ▼         ▼
[Preview]  [Publish]
 (vivo)    react-markdown
           → HTML string
           → React Email template
           → Resend API
           → Subscriptores activos
```

## Extensiones Custom de Markdown

| Sintaxis | Output | CSS |
|----------|--------|-----|
| `<Highlight>texto</Highlight>` | `<span class="hl">texto</span>` | `color: var(--brand-orange)` |
| `<Comment>historia</Comment>` | `<!-- historia -->` | — |
| `:::tip Esta semana aprendí... :::` | `<div class="callout-tip"><p>...</p></div>` | Borde naranja, bg suave |
| `:::cta $join-spec-log :::` | `<a class="cta-btn" href="/join-spec-log">Unirme</a>` | Botón naranja |

Implementación: pre-parser de ~30 líneas vía regex antes de react-markdown.

## Modelo de Datos

```typescript
// Colección: newsletters/{id}
interface Newsletter {
  title: string;                    // Asunto del mail
  markdown: string;                 // Fuente original (~5-50 KB)
  status: "draft" | "scheduled" | "sent";
  scheduledAt: Timestamp | null;
  sentAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Colección: subscribers/{email} — ya existe
```

No se persiste HTML — es derivado, se regenera al vuelo.

## Arquitectura de Rutas

```
/admin/login              ← Login page
/admin/newsletters        ← Lista de drafts + enviados
/admin/editor/:id?        ← Split pane: editor | preview + publicar
```

Protegidas por middleware que checkea Firebase Auth + admin claim.

## Fases (SDD Changes)

### Fase 1 — Auth + Ruteo Protegido

**Cobertura:**
- Firebase Admin SDK ya configurado
- Firebase Auth email/password
- Página `/admin/login`
- Middleware de protección en `/admin/*`
- Ruta `/admin/newsletters` con lista vacía (placeholder)

**No incluye:** editor, preview, envío.

---

### Fase 2 — Editor Split Pane + Markdown + Preview

**Cobertura:**
- Ruta `/admin/editor/:id`
- Textarea Markdown a la izquierda
- Preview renderizado en vivo a la derecha
- Pre-parser de bloques custom
- Persistencia en Firestore (colección `newsletters`)
- Lista `/admin/newsletters` funcional (crear, listar drafts)

**No incluye:** template React Email, envío.

---

### Fase 3 — Template Spec Log + Envío

**Cobertura:**
- React Email template con header, footer, colores de marca
- Preview renderizado DENTRO del template
- Botón Publicar
- Markdown → HTML → Template → Resend
- Envío a subscriptores activos (status === "active")
- Envío de test al admin
- Actualización de `lastEmailSent`, `totalEmailsSent`

**No incluye:** agendamiento.

---

### Fase 4 — Agendamiento (post-MVP)

- Campo `scheduledAt` en `newsletters`
- Vercel Cron Job cada 10 minutos
- Envío automático cuando `scheduledAt <= now`

---

## Decisiones Técnicas

| Decisión | Alternativas | Por qué |
|----------|-------------|---------|
| **Pre-parser** vs plugin remark | Plugin remark más puro | Pre-parser no requiere conocer el AST de unified, 30 líneas, control total |
| **Firestore para drafts** | Archivos, SQLite | Firestore ya está en el proyecto, 1MiB por doc es suficiente |
| **React Email** para template | MJML, Handlebars | React Email ya es dependencia del proyecto, componentes reutilizables |
| **Resend** para envío | SendGrid, SES | Ya está en el proyecto, API simple |
| **No guardar HTML** | Cache de HTML | Es derivado, se regenera al vuelo del Markdown fuente — cero desincronización |

## Próximo Cambio

`/sdd-new admin-auth` — Fase 1: Auth + ruteo protegido.
