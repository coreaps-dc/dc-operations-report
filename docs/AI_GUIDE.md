# AI Guide

Use this file to work efficiently in the repository without reading everything.

## When Editing App Shell

Read:

- `src/app/layout/AppShell.tsx`
- `src/app/global-ui/index.tsx`
- `src/app/global-ui/state.tsx`
- `src/app/navigation/index.ts`
- `src/app/routing/index.ts`
- `src/App.css`

Avoid reading future report module folders unless the task mentions a specific
module.

## When Adding a Future Report Module

Read:

- `docs/MODULE_GUIDE.md`
- `src/modules/types.ts`
- `src/modules/registry.ts`
- the target module folder only, if it already exists

Do not modify unrelated modules.

## When Editing Departments

Read:

- `src/departments/index.ts`
- `src/app/navigation/index.ts`

Department metadata should stay separate from report logic.

## When Editing Foundation

Read only the relevant foundation area:

- `src/foundation/design-system`
- `src/foundation/shared-components`
- `src/foundation/utilities`
- `src/foundation/types`
- `src/foundation/services`
- `src/foundation/data-access`

Foundation code must not import from concrete modules.

When changing primitive styling, read:

- `src/foundation/design-system/tokens.css`
- `src/foundation/design-system/components.css`

When changing composed reusable components, read:

- `src/foundation/shared-components/index.tsx`
- `src/foundation/shared-components/components.css`

When changing global UX state, read `src/app/global-ui/state.tsx`.

When adding a backend later, read `src/foundation/services/index.ts` and
`src/foundation/data-access/index.ts` first. Do not put network or database
access in React components.

Read `docs/DATA_BACKEND_ARCHITECTURE.md` before making backend, authentication,
data scope, import, retention, or integration decisions.

Read `docs/GOOGLE_APPS_SCRIPT_BACKEND_CONTRACT.md` before changing Apps Script,
Google Spreadsheet, Google Drive, API response, or facility mapping contracts.

## Foundation Phase Constraints

At this stage, do not migrate legacy reports and do not implement operational
calculations. Keep changes limited to architecture, shell, routing, docs, and
module contracts.
