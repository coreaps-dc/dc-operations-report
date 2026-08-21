# Module Guide

This guide defines how future report modules should be added.

## Module Contract

Every report module should provide:

- `id`
- `title`
- `department`
- `description`
- `route`
- `status`
- optional `owner`
- optional React entry component

See `src/modules/types.ts`.

## Recommended Folder Shape

Future modules should use this pattern:

```text
src/modules/<department>/<module-id>/
  index.ts
  Module.tsx
  README.md
  types.ts
  utils.ts
```

Valid department namespaces are:

- `inventory`
- `inbound`
- `outbound`
- `transport`

Do not place module-specific business logic in `src/app`, `src/pages`, or
`src/departments`. Do not place module-specific business logic in
`src/foundation`, because foundation code must stay reusable and domain-neutral.

## UI Usage

Future modules should use:

- primitive UI from `src/foundation/design-system`
- composed UI from `src/foundation/shared-components`

Do not create module-local versions of common controls such as tables, filter
bars, status badges, pagination, loading states, empty states, dialogs, or
drawers unless the foundation layer is missing a required reusable capability.

Use `src/app/global-ui/state.tsx` for loading, empty, error, success, skeleton,
toast, and offline states.

## Registration

After creating a module folder, add the module definition to
`src/modules/registry.ts`.

The registry is the only App Shell integration point for reports.

Modules must not import directly from other modules. If future shared behavior
is needed by more than one module, move it into the appropriate
`src/foundation` area first.

## Current Phase Rule

Do not add real report modules in the foundation phase. This repository is
currently prepared for modules, but contains none.
