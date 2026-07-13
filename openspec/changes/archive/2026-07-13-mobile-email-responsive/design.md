# Design: Mobile Email Responsive

## Technical Approach

Apply the **Fluid Wrapper Table** pattern to both email templates: wrap the existing `<Container>` in an outer `<table>` at 100% width with `role="presentation"` and an inner `<td>` with `padding: 24px 4%`. Remove the ineffective `.email-container` media query from both files.

The `<Container>`'s inline `maxWidth: 600px` remains unchanged — it caps desktop width. On mobile (<600px), the 4% side padding constrains the content to ~92% of viewport. This works without `<style>` blocks, making it compatible with Gmail, Apple Mail, Yahoo, and Outlook.

```tsx
{/* Fluid Wrapper Table — replaces className-based media query */}
<table
  cellPadding="0"
  cellSpacing="0"
  role="presentation"
  style={{ width: "100%", borderCollapse: "collapse" }}
>
  <tr>
    <td style={{ padding: "24px 4%" }}>
      <Container style={container}>
        {/* … existing inner content unchanged … */}
      </Container>
    </td>
  </tr>
</table>
```

## Architecture Decisions

### Decision: Fluid Wrapper Table vs CSS Media Query

| Option | Tradeoff | Decision |
|---|---|---|
| **Fluid Wrapper Table** (chosen) | Works everywhere — Gmail strips `<style>`, Outlook ignores media queries. Table-based layout is the most widely supported email HTML pattern. | ✅ **Chosen** — zero CSS dependency for layout |
| CSS Media Query | Gmail strips `<style>` blocks entirely. Outlook (Word rendering engine) ignores `@media`. Falls back to full-width with no gap. | ❌ Rejected — already proven ineffective in production (`email-container` class never worked) |

### Decision: Remove vs Keep Non-Functional Media Query

| Option | Tradeoff | Decision |
|---|---|---|
| **Remove** (chosen) | Eliminates dead code that suggests responsive behavior exists when it doesn't. Reduces confusion for future maintainers. | ✅ **Chosen** — cleaner codebase, no behavioral change |
| Keep as comment | Leaves misleading dead code that could be interpreted as "this should work on mobile" | ❌ Rejected — dead CSS with no effect is technical debt |

### Decision: Same Wrapper Pattern in Both Files

| Option | Tradeoff | Decision |
|---|---|---|
| **Identical wrapper** (chosen) | Consistent rendering behavior. Single pattern to understand and maintain. Both files use the same `<Container>` component from `@react-email/components`. | ✅ **Chosen** — consistency across templates |
| Different approaches per file | Unnecessary divergence for the same problem. Maintenance burden. | ❌ Rejected — no justification for asymmetry |

## Data Flow

No data flow changes. The wrapper `<table>` is purely structural — it does not receive props, modify children, or interact with data at any layer. `WelcomeEmailProps` and `WeeklyNewsletterProps` remain unchanged.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/emails/welcome-email.tsx` | Modify | Wrap `<Container>` in fluid wrapper `<table>`; remove `.email-container` className from `<Container>`; remove `@media` query from `<Head>` `<style>` block entirely (the `<style>` block becomes empty, so remove the `<style>` element and close `<Head />` as self-closing) |
| `src/emails/templates/weekly-newsletter.tsx` | Modify | Same fluid wrapper around `<Container>`; remove `.email-container` className from `<Container>`; remove only the `@media` block from the `<style>` block (keep all content-area CSS classes) |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | No new tests | Existing structural tests (`welcome-email.test.tsx`) verify token rendering, preview text, and no `dangerouslySetInnerHTML` — none assert on wrapper structure. The change is purely structural (adds a wrapper `<table>`), not behavioral. |

**Why no new tests**: The test suite uses `renderToStaticMarkup` which produces flat HTML. Adding assertions for `<table>` nesting tests React Email's rendering, not our logic. Existing tests serve as regression guards.

## Migration / Rollout

No migration, data changes, or feature flags required. This is a structural change to two email templates. Rollback:

```bash
git checkout HEAD -- src/emails/welcome-email.tsx src/emails/templates/weekly-newsletter.tsx
```

Verify rollback with `npm run build`.
