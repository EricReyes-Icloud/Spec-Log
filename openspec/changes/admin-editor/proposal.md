# Proposal: Admin Editor Split Pane + Markdown + Preview

## Intent

Implement Fase 2 of the Newsletter System: a split-pane editor at `/admin/editor` (and `/admin/editor/:id` for editing existing newsletters) with real-time markdown preview, custom markdown extensions, and Firestore persistence for drafts. This addresses the need for admins to compose, preview, and save newsletter content before sending.

## Scope

### In Scope
- Split pane editor interface with markdown textarea (left) and live preview (right)
- Glassmorphism container styling matching admin login page design
- Real-time preview updating on every keystroke (client-side only)
- Custom markdown pre-parser for `<coment>` and `<heading>` tags
- Email template preview inside right pane with macOS-style header, white background, light gray border, and landing page footer
- Firestore persistence for newsletters collection with schema: `{title, markdown, status, createdAt, updatedAt}`
- Save button to persist newsletters as draft
- Load existing newsletter by ID for editing

### Out of Scope
- Functional newsletter list at `/admin/newsletters` (remains placeholder)
- Email sending functionality (Fase 3)
- Scheduling functionality (Fase 4)
- Multiple admin accounts
- User registration page

## Capabilities

### New Capabilities
- `admin-editor-interface`: Split pane UI with glassmorphism styling and real-time preview
- `markdown-preparser`: Custom tag transformation for `<coment>` and `<heading>` before react-markdown processing
- `newsletter-persistence`: Firestore CRUD operations for newsletter drafts

### Modified Capabilities
- None

## Approach

Create a React route at `/admin/editor/:id?` with a vertical split layout. Left side contains a monospace textarea for markdown input. Right side renders the email template preview using react-markdown after processing through a custom pre-parser that transforms `<coment>` and `<heading>` tags. The preview is wrapped in a React Email template component matching the specified design. Firestore operations use the existing Firebase client pattern for saving/loading newsletters. All preview updates happen client-side with zero server calls.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/admin/editor/[id]/page.tsx` | New | Split pane editor route |
| `src/lib/markdown-preparser.ts` | New | Custom markdown tag transformation |
| `src/components/email/NewsletterPreview.tsx` | New | Email template wrapper for preview |
| `src/lib/firebase-client.ts` | Modified | Add newsletter persistence functions |
| `src/styles/admin-login.css` | Extended | Glassmorphism styling for editor container |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance lag on large markdown files | Medium | Debounce preview updates, optimize pre-parser regex |
| Firestore security rules blocking writes | Low | Extend existing admin rules to newsletters collection |
| CSS conflicts with glassmorphism implementation | Low | Use specific class names, extend existing patterns |
| Custom tag parsing edge cases | Medium | Comprehensive regex testing, fallback to original text |

## Rollback Plan

1. Delete `src/app/admin/editor/[id]/page.tsx`
2. Delete `src/lib/markdown-preparser.ts`
3. Delete `src/components/email/NewsletterPreview.tsx`
4. Revert newsletter persistence additions to `src/lib/firebase-client.ts`
5. Remove glassmorphism extensions from `src/styles/admin-login.css`
6. The change is additive; no existing functionality is modified or removed

## Dependencies

- Existing Firebase client SDK configuration
- Existing react-markdown dependency
- Existing React Email dependency
- Existing Tailwind CSS v4 setup

## Success Criteria

- [ ] Editor loads at `/admin/editor` with split pane layout
- [ ] Markdown input updates preview in real-time without button
- [ ] Custom `<coment>` and `<heading>` tags render correctly in preview
- [ ] Preview displays email template with macOS header, white background, gray border, and landing footer
- [ ] Glassmorphism container matches admin login page design
- [ ] Newsletter saves to Firestore as draft with correct schema
- [ ] Existing newsletter loads by ID for editing
- [ ] No server calls for preview updates (purely client-side)