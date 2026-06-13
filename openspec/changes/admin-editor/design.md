# Design: Admin Editor Split Pane + Markdown + Preview

## Technical Approach

Client-side React component at `/admin/editor` and `/admin/editor/:id` with a CSS Grid split pane inside a glassmorphism container matching the existing admin login. Markdown flows through a pure-function pre-parser (regex transform for `<coment>` and `<heading>` tags) then into `react-markdown` for rendering inside a floating email template mockup. Firestore persistence extends the existing `firebase-client.ts` singleton pattern for newsletter CRUD. No server calls for preview — all client-side.

## Architecture Decisions

### Decision: Split Pane via CSS Grid

| Option | Tradeoff |
|--------|----------|
| CSS Grid `grid-template-columns: 1fr 1fr` | Equal height panes natively, no JS height calculation |
| Flexbox | Needs `height: 100%` on both children, stretch behavior can be unpredictable |
| Absolute positioning | Requires manual height calc on resize |

**Choice**: CSS Grid — the light gray divider lives as a `border-r` on the left pane or a dedicated `<div>` in the grid track. Zero JS needed for layout.

### Decision: Regex Pre-parser (no AST)

**Choice**: Two `String.replace()` calls with regex — one for `<coment>` → `<span class="coment-line">`, one for `<heading>` → `<h2>`. Pure function, no side effects, no DOM access.

**Rationale**: Only two custom tags with simple open/close structure. Regex handles this in ~15 lines. A remark plugin would require understanding unified/remark AST and adds an import chain for no benefit. Falls back to original text when tags are unclosed by leaving unmatched patterns unmodified.

### Decision: Conditional Debounce (inline setTimeout)

| Char count | Behavior |
|------------|----------|
| ≤ 1000 | No debounce — immediate setState on each keystroke |
| > 1000 | Debounce via `setTimeout` / `clearTimeout`, max 300ms |

**Choice**: Inline `useRef<Timeout>` + conditional logic in the onChange handler. No library import needed. The threshold avoids jank on large documents while keeping the <1000-char happy path snappy.

### Decision: Extend firebase-client.ts (same singleton pattern)

**Choice**: Add `getFirestore()` import, cache a Firestore instance alongside the existing auth cache, and export three functions: `createNewsletter`, `updateNewsletter`, `getNewsletter`. Follows the exact cached-singleton pattern already used for `auth`.

**Rationale**: Keeps all Firebase client access in one file. No separate service file needed at this scale — the three operations are thin wrappers around `addDoc`, `updateDoc`, `getDoc`.

### Decision: NewsletterPreview as a dedicated component

**Choice**: `components/email/NewsletterPreview.tsx` wraps the react-markdown output in a white-background container with a static macOS header (red/yellow/green dots only — no timer, no button, no animation), light gray border + border-radius, and a footer with `<!-- construyendo sistemas reales con IA -->`. The component floats centered in the right pane (does NOT fill full height/width).

**Rationale**: Matches the visual spec exactly. Separate CSS file (`newsletter-template.css`) keeps styles isolated from the editor layout styles. Reuses the same visual language as the existing landing page components but simplified for the preview context.

## Data Flow

```
User types in <textarea>
        │
        ▼
onChange → setState(markdown)
        │
        ├─ length > 1000? ─→ debounce 300ms (useRef timeout)
        │                     └→ runPreparser()
        │
        └─ length ≤ 1000? ─→ runPreparser() immediately
        
        ▼
preparseMarkdown(input: string): string
  .replace(/<coment>(.*?)<\/coment>/gs, '<span class="coment-line">$1</span>')
  .replace(/<heading>(.*?)<\/heading>/gs, '<h2>$1</h2>')
        │
        ▼
<ReactMarkdown>{transformed}</ReactMarkdown>
        │
        ▼
<NewsletterPreview>
  ← static macOS header (dots only)
  ← white bg, border, radius
  ← rendered markdown content
  ← footer "construyendo sistemas reales con IA"
</NewsletterPreview>
```

**Save flow:**
```
Click [Save] → validate title non-empty
  → if new (no ID) → createNewsletter(title, markdown) → returns ID
  → if editing (has ID) → updateNewsletter(id, title, markdown)
  → show success indicator
  → on error → show inline error message, preserve textarea content
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/admin/editor/page.tsx` | Create | New newsletter editor route (no ID) — renders `<Editor />` |
| `src/app/admin/editor/[id]/page.tsx` | Create | Edit existing newsletter route — loads by ID, renders `<Editor />` |
| `src/lib/markdown-preparser.ts` | Create | Pure function: regex transform for `<coment>` and `<heading>` |
| `src/components/email/NewsletterPreview.tsx` | Create | Email template wrapper: static macOS header, white bg, border, footer |
| `src/lib/firebase-client.ts` | Modify | Add `getFirestore()`, export `createNewsletter`, `updateNewsletter`, `getNewsletter` |
| `src/styles/admin-editor.css` | Create | Editor layout: glassmorphism container, CSS Grid split pane, divider |
| `src/styles/newsletter-template.css` | Create | Email preview: macOS dots, white template, footer styles |
| `package.json` | Modify | Add `react-markdown` dependency |

## Interfaces / Contracts

```typescript
// lib/firebase-client.ts additions
import { Timestamp } from "firebase/firestore";

interface Newsletter {
  title: string;
  markdown: string;
  status: "draft" | "scheduled" | "sent";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function createNewsletter(title: string, markdown: string): Promise<string>;
function updateNewsletter(id: string, title: string, markdown: string): Promise<void>;
function getNewsletter(id: string): Promise<Newsletter | null>;

// lib/markdown-preparser.ts
function preparseMarkdown(input: string): string;

// components/email/NewsletterPreview.tsx
interface NewsletterPreviewProps {
  content: string;  // already pre-parsed, ready for react-markdown
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Pre-parser | Tag transforms, edge cases (unclosed, nested, empty) | Manual — call `preparseMarkdown()` from browser console with test payloads |
| Persistence | Create/update/get, error handling | Manual — type and save in editor, inspect Firestore console |
| Editor UI | Split pane, preview update, save states | Manual — navigate routes, type, verify preview updates, save |
| Build | Compilation, type checking | `next build` — TypeScript strict mode catches type errors |

## Migration / Rollout

No migration required. This is additive — new routes and new Firestore collection. The `newsletters` collection will be created on first write via Firestore's automatic collection creation.

## Open Questions

None — design is well-defined by specs and codebase patterns.

**Note**: `react-markdown` is NOT currently in `package.json` — must be installed as a dependency during apply.
