# Tasks: Fase 1 Landing Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~300-400 (high risk) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Infrastructure + Components; PR 2: Integration + Verification |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |
| Decision needed before apply | Yes |

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Infrastructure + Landing Components | PR 1 | Includes Tailwind config, component creation, and `subscribe.ts` stub. |
| 2 | Main Page Integration + Verification | PR 2 | Includes `page.tsx` updates, build/lint verification, and integration testing. |

---

## Phase 1: Project Setup & Infrastructure

### Task 1.1: Verify Project Build Baseline
- **Description**: Ensure the project builds without errors to establish a working baseline.
- **Files**: `src/app/page.tsx` (empty), `package.json`
- **Acceptance Criteria**: Run `npm run build` and verify no TypeScript or build errors.
- **Dependencies**: None

### Task 1.2: Create Tailwind CSS v4 Color Configuration
- **Description**: Extend the Tailwind CSS color palette with custom colors for the project.
- **Files**: `tailwind.config.js` (create)
- **Acceptance Criteria**: Custom colors `#F97316`, `#1F1F1F`, `#37302E`, and `#E5E5E5` are added to the `extend.colors` section.
- **Dependencies**: None

### Task 1.3: Create Landing Components Directory
- **Description**: Create the directory structure for landing page components.
- **Files**: `src/components/landing/` (directory)
- **Acceptance Criteria**: Directory exists and is empty.
- **Dependencies**: None

---

## Phase 2: Landing Components

### Task 2.1: Create `Header.tsx`
- **Description**: Renders the `Header.png` image full-width using Next.js `Image` component.
- **Files**: `src/components/landing/Header.tsx`
- **Acceptance Criteria**:
  - Component renders `Header.png` at full width.
  - Uses `next/image` with responsive layout.
  - Includes alt text for accessibility.
- **Dependencies**: Task 1.3

### Task 2.2: Create `Hero.tsx`
- **Description**: Renders `Miniatura.png` and description text.
- **Files**: `src/components/landing/Hero.tsx`
- **Acceptance Criteria**:
  - Component displays `Miniatura.png` and a description paragraph.
  - Uses sans-serif typography for the description.
  - Responsive layout (stacked on mobile, horizontal on desktop).
- **Dependencies**: Task 1.3

### Task 2.3: Create `SubscribeForm.tsx`
- **Description**: Email input + Suscríbete button with validation.
- **Files**: `src/components/landing/SubscribeForm.tsx`
- **Acceptance Criteria**:
  - Input field for email with monospace font.
  - Button with background `#F97316` and text `#1F1F1F`.
  - Validation for empty and invalid email formats.
  - Loading, error, and success states.
  - Hover state for button (darkens background).
- **Dependencies**: Task 1.3

### Task 2.4: Create `Footer.tsx`
- **Description**: Footer with `#37302E` background, code-style comment, and bordered links.
- **Files**: `src/components/landing/Footer.tsx`
- **Acceptance Criteria**:
  - Background color `#37302E`.
  - Code-style comment: `/* Suscríbete a Spec Log — construyendo sistemas reales con IA como copiloto */`.
  - Links to GitHub and LinkedIn in a bordered container.
  - Links use white text and monospace font for the comment.
- **Dependencies**: Task 1.3

---

## Phase 3: Main Page Integration

### Task 3.1: Update `src/app/page.tsx`
- **Description**: Compose all landing components into the main page.
- **Files**: `src/app/page.tsx`
- **Acceptance Criteria**:
  - Imports and renders `Header`, `Hero`, `SubscribeForm`, and `Footer`.
  - Components are arranged in the correct order.
  - Uses `@/` path alias for imports.
- **Dependencies**: Tasks 2.1, 2.2, 2.3, 2.4

### Task 3.2: Create `lib/services/subscribe.ts`
- **Description**: Stub for Phase 2 backend integration.
- **Files**: `src/lib/services/subscribe.ts`
- **Acceptance Criteria**:
  - Exports an async `subscribe` function.
  - Stub implementation logs the email or simulates success.
- **Dependencies**: None

---

## Phase 4: Verification

### Task 4.1: Run Build and Verify No Errors
- **Description**: Ensure the project builds without TypeScript or build errors.
- **Files**: All created files
- **Acceptance Criteria**: `npm run build` completes without errors.
- **Dependencies**: Tasks 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2

### Task 4.2: Run Lint and Verify ESLint Passes
- **Description**: Ensure the project adheres to ESLint rules.
- **Files**: All created files
- **Acceptance Criteria**: `npm run lint` completes without errors.
- **Dependencies**: Tasks 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2