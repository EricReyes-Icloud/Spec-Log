# Proposal: Admin Authentication System

## Intent

Implement Fase 1: Firebase Auth login with protected admin routes.

## Scope

### In Scope
- Firebase Auth email/password login (single admin)
- `/admin/login` page per Template_email_instructions.md
- Middleware protecting `/admin/*` routes
- `/admin/newsletters` placeholder with logout
- Manual admin creation via Firebase Console

### Out of Scope
- Editor, preview, newsletter features (Fase 2+)
- Registration page
- Multiple admin accounts
- Role claims system

## Capabilities

### New Capabilities
- `admin-auth`: Firebase Auth login with route protection
- `admin-newsletters-placeholder`: Basic newsletter management placeholder

### Modified Capabilities
- None

## Approach

1. Implement Firebase Auth login using existing firebase-admin.ts
2. Create `/admin/login` page with specified design
3. Add Next.js middleware for `/admin/*` route protection
4. Create `/admin/newsletters` placeholder with logout button
5. Logout clears session and redirects to login

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/admin/login/page.tsx` | New | Login page with Firebase Auth |
| `app/admin/newsletters/page.tsx` | New | Placeholder page with logout |
| `middleware.ts` | New | Route protection for `/admin/*` |
| `src/lib/firebase-client.ts` | New | Firebase client for auth |
| `src/lib/firebase-admin.ts` | Existing | Already configured |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Firebase Auth configuration | Medium | Test with Console-created user |
| Middleware routing errors | Low | Test protected/public routes |
| Design implementation | Low | Follow Template_email_instructions.md |
| Session management | Low | Use Next.js/Firebase session handling |

## Rollback Plan

1. Remove `app/admin/login/page.tsx`
2. Remove `app/admin/newsletters/page.tsx`
3. Remove `middleware.ts` (if created)
4. Remove `src/lib/firebase-client.ts` (if created)
5. Revert changes to existing files
6. Admin user remains in Firebase Console

## Dependencies

- Firebase Admin SDK at `src/lib/firebase-admin.ts`
- Firebase project with Auth enabled (email/password)
- Next.js 13+ with app router

## Success Criteria

- [ ] Admin logs in with Console-created email/password
- [ ] Unauthenticated `/admin/*` access redirects to login
- [ ] Authenticated access to `/admin/newsletters` shows placeholder
- [ ] Logout clears session and redirects to `/admin/login`
- [ ] Login page matches Template_email_instructions.md design