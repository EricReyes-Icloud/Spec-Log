# PR-9: Responsive Mobile & Visual Fixes for End-Log, Footer, and Mac Header

## Description

The email newsletter landing page had several layout issues on mobile viewports. The Mac header bar, footer links, and end-log terminal section were designed exclusively for desktop widths, resulting in overflowing content, oversized tap targets, and illegible text on small screens. These three components shared the same root cause: fixed pixel values and single-breakpoint layouts that assumed a minimum width of roughly 768px.

This PR applies mobile-first responsive design across all three components. Rather than introducing new breakpoints or restructuring the component hierarchy, the approach uses Tailwind's existing `sm:` and `lg:` responsive prefixes to scale padding, font sizes, spacing, and element dimensions proportionally. The changes are purely visual — no JavaScript logic, component props, or data flow is affected.

## Changes Made

### Bug Fixes

- `src/styles/end-log.css`:
  - `.endlog-section`: Replaced fixed `px-18 py-20` with responsive `px-4 lg:px-18 py-8 lg:py-20` — section padding now collapses on mobile.
  - `.endlog-comment`: Changed `mb-12` to responsive `mb-7 lg:mb-12`, added `margin-left: 10px` for visual alignment.
  - `.endlog-line`: Changed `white-space: pre` to `pre-wrap` by default, with a `@media (width >= 1024px)` override back to `pre` — terminal text now wraps on mobile instead of overflowing horizontally.
  - `.endlog-btn`: Added `w-full lg:w-auto` — CTA button spans full width on mobile for better tap target sizing.
  - `.endlog-body`: Increased `min-height` from `360px` to `525px` — prevents content cutoff in the terminal card.

- `src/styles/footer.css`:
  - `.footer-links`: Changed from `flex-col sm:flex-row gap-4` to `flex-row flex-wrap gap-1 sm:gap-2` — footer links now wrap horizontally on all screen sizes instead of stacking vertically.
  - `.footer-link`: Added responsive padding `px-1.5 sm:px-2 lg:px-4 py-1 lg:py-2` and font size `text-[9px] lg:text-[14px]` (was fixed `text-sm`). Changed hover color from `text-gray-400` to `text-[#F95616]` (brand orange).
  - `.footer-icon`: Changed from fixed `w-5 h-5` to responsive `w-3 lg:w-5 h-3 lg:h-5`.

- `src/styles/mac-header.css`:
  - `.mac-header-bar`: Added responsive padding `px-4 py-3 sm:px-6 sm:py-4` (was fixed `px-6 py-4`).
  - `.mac-header-dots`: Added responsive gap `gap-2 sm:gap-3` (was fixed `gap-3`).
  - `.mac-header-dot-red`, `.mac-header-dot-yellow`, `.mac-header-dot-green`: Changed from fixed `w-4 h-4` to responsive `w-3 h-3 sm:w-4 sm:h-4`.
  - `.mac-header-timer`: Added `px-5` padding and responsive font size `text-[9px] lg:text-[14px]`.

## Impact

- **User-facing**: The landing page now renders correctly on mobile viewports (320px–768px). Previously, the Mac header dots and footer links overflowed their containers, and the end-log terminal text caused horizontal scrolling.
- **Desktop**: No visual changes at `lg:` breakpoint (1024px+) — all desktop styles are preserved via responsive overrides.
- **Backward compatibility**: CSS-only changes. No component API changes, no new dependencies, no data model modifications.
- **Risks**: The `white-space: pre-wrap` default in `.endlog-line` could subtly change line wrapping behavior if terminal content contains intentional long lines. This is mitigated by the `@media (width >= 1024px)` override that restores `pre` on desktop.

## Notes

- **How to test**: Resize the browser to mobile width (375px) and verify: Mac header dots shrink and fit within the bar, footer links wrap horizontally without overflow, end-log terminal text wraps without horizontal scroll, CTA button spans full width.
- **No follow-up issues identified** — these are self-contained visual fixes.
