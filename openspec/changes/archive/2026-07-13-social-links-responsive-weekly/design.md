# Design: Social Links Responsive Weekly

## Technical Approach

Port the per-`<td>` social links pattern from `welcome-email.tsx` (lines 355–365) into `weekly-newsletter.tsx`'s footer, and add a mobile `@media` query to the existing `<Head>` `<style>` block. Three localised edits to a single file — no new components, no abstraction, no shared module. Desktop rendering is identical before and after.

The welcome-email pattern is already proven in production for this exact codebase: each social link becomes its own `<td>` with conditional `paddingRight` (12px between items, 0 on the last), the outer `<table>` switches from `width: 100%` to `margin: 0 auto`, and a `max-width: 92%` media query constrains the table on sub-600px viewports.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| **Social links structure** | Per-`<td>` map with `paddingRight: idx === 0 ? "12px" : "0"` | Shared CSS `gap`, flexbox, inline-block on container | Email clients (Gmail, Outlook) strip modern layout properties. Per-`<td>` with inline `paddingRight` is the only reliable cross-client spacing technique. |
| **Table centering** | `margin: 0 auto` on outer `<table>` | `align="center"` on `<table>`, wrapper `<center>` | `margin: 0 auto` is the idiomatic React Email approach (already used by `Container`). Consistent with welcome-email and the project's existing patterns. |
| **Mobile width constraint** | `@media (max-width: 600px)` in `<Head>` `<style>` | `max-width` on `<Container>`, `%` width on `<table>` | Container `maxWidth` is ignored by Gmail/Outlook on mobile. A `<style>` media query is the only universal override. Existing `<Head>` already has a `<style>` block — just append. |
| **Code reuse** | Copy pattern inline | Extract shared `SocialLinks` component | Two occurrences don't justify abstraction. Premature extraction adds indirection without benefit. If a third template needs social links, extract then. |

## Changes to weekly-newsletter.tsx

| # | Action | Lines | Detail |
|---|--------|-------|--------|
| 1 | **Modify** footer `<table>` style | 244 | `width: "100%"` → `margin: "0 auto"` — centers the social links table |
| 2 | **Modify** social links map | 247–258 | Single `<td align="center">` wrapping all `<Link>`s → per-`<td>` map where each `<Link>` sits in its own `<td>` with `paddingRight: idx === 0 ? "12px" : "0"` on the first item |
| 3 | **Modify** existing `<Head>` `<style>` | 119–138 | Append `@media (max-width: 600px) { table { max-width: 92% !important; } }` after the last rule |

No other lines touched. No imports change. No new files.

## Before / After (Footer Section)

### Before (line 241–259)
```tsx
<table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
  <tr>
    <td align="center">
      {SOCIAL_LINKS.map((link) => (
        <Link key={link.label} href={link.href} style={footerPillLink}>
          {link.label}
        </Link>
      ))}
    </td>
  </tr>
</table>
```

### After (matching welcome-email lines 355–365)
```tsx
<table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
  <tr>
    {SOCIAL_LINKS.map((link, idx) => (
      <td key={link.label} align="center" style={{ paddingRight: idx === 0 ? "12px" : "0" }}>
        <Link href={link.href} style={footerPillLink}>
          {link.label}
        </Link>
      </td>
    ))}
  </tr>
</table>
```

### Media query appended to `<style>` block
```css
@media (max-width: 600px) {
  table { max-width: 92% !important; }
}
```

## Data Flow

No data flow changes — this is purely a markup restructuring of the email template's footer section. The `SOCIAL_LINKS` constant, `WeeklyNewsletterProps` interface, and all data processing remain identical.

## Interfaces / Contracts

No new interfaces, types, or props. `WeeklyNewsletterProps` unchanged. No new exports.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Template compiles without errors | `next build` or `tsc --noEmit` |
| Visual (desktop) | Footer pills render identically at ≥600px | Visual diff against existing snapshot / manual check |
| HTML structure | Each social link is in its own `<td>` | Inspect rendered HTML output |
| Media query | `@media (max-width: 600px)` rule is present in `<head>` | Inspect rendered HTML `<style>` block |

*No automated test runner is configured in this project. Verification will rely on build check and manual HTML inspection.*

## Migration / Rollout

No migration required. Change is contained to one file, deployed with the next template render.

## Open Questions

None. All decisions resolved above. This is a mechanical pattern port with three unambiguous edits.
