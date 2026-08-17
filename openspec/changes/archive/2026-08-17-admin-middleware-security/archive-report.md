# Archive Report: admin-middleware-security

## Change

**Name**: admin-middleware-security
**Archived**: 2026-08-17
**Mode**: openspec
**Archived to**: `openspec/changes/archive/2026-08-17-admin-middleware-security/`

## Final State (at close)

- **Verify**: PASSED — native envelope accepted (7/7 requirements, 18/18 scenarios, verdict pass, validador `gentle-ai sdd-verify-validate` valid:true)
- **Tasks**: 10/10 complete (all `[x]` in persisted `tasks.md`)
- **Tests**: change-scoped 31 passed (exit 0); full suite 44 passed / 1 failed (pre-existing `welcome-email.test.tsx` template drift, out of scope, identical to baseline)
- **Build**: `npx next build` PASS (Next.js 16.2.6, Turbopack); Proxy detected as `ƒ Proxy (Middleware)` on Node.js
- **Open follow-up**: `welcome-email.test.tsx` template drift (pre-existing, out of scope)

## Task Completion Gate

All 10 implementation tasks checked `[x]` in `openspec/changes/archive/2026-08-17-admin-middleware-security/tasks.md`. No stale checkboxes.

## Native Review Receipt Gate

`reviewGate` structurally absent in structured status. Receipt-driven development is off for this candidate. Proceeds under ordinary repository policy.

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `admin-auth` | Updated | 3 requirements modified (Login Authentication, Session Persistence, Middleware Route Protection), 2 requirements added (Middleware Authorization Allowlist, Session Route Hardening), all existing unrelated requirements preserved |
| `admin-newsletters-placeholder` | Updated | 1 requirement modified (Inherited Route Protection), 1 requirement added (No Client-Side Auth Listener), all existing requirements preserved |

## Archive Contents

- `proposal.md` — present
- `specs/admin-auth/spec.md` — present
- `specs/admin-newsletters-placeholder/spec.md` — present
- `design.md` — present
- `tasks.md` — present (10/10 tasks complete)
- `verify-report.md` — present

## Artifacts Read (for traceability)

- `openspec/changes/admin-middleware-security/proposal.md`
- `openspec/changes/admin-middleware-security/specs/admin-auth/spec.md`
- `openspec/changes/admin-middleware-security/specs/admin-newsletters-placeholder/spec.md`
- `openspec/changes/admin-middleware-security/design.md`
- `openspec/changes/admin-middleware-security/tasks.md`
- `openspec/changes/admin-middleware-security/verify-report.md`
- `openspec/specs/admin-auth/spec.md` (pre-existing main spec)
- `openspec/specs/admin-newsletters-placeholder/spec.md` (pre-existing main spec)

## Source of Truth Updated

The following main specs now reflect the new behavior:
- `openspec/specs/admin-auth/spec.md`
- `openspec/specs/admin-newsletters-placeholder/spec.md`

## Documented Deviation

Task 2.2: `runtime: "nodejs"` omitted from proxy config. Next.js 16.2.6 rejects route segment config in Proxy files. Proxy always runs on Node.js by default. Committed in `df3cdf1`.

## Final-State Authority Notes

- All test counts sourced from orchestrator launch prompt (highest-ranked explicit final-state facts)
- `verify-report` and `apply-progress` are intermediate snapshots; their stale claims do not override the final-state facts above
- The `welcome-email.test.tsx` failure is pre-existing and identical to baseline; recorded as open follow-up
