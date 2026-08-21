# AI Guide

Use this file to work efficiently in the repository without reading everything.

## When Editing App Shell

Read:

- `src/app/AppShell.tsx`
- `src/app/navigation.ts`
- `src/app/routes.ts`
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
- `src/app/navigation.ts`

Department metadata should stay separate from report logic.

## Foundation Phase Constraints

At this stage, do not migrate legacy reports and do not implement operational
calculations. Keep changes limited to architecture, shell, routing, docs, and
module contracts.
