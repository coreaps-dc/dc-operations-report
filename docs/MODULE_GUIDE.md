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

Do not place module-specific business logic in `src/app`, `src/pages`, or
`src/departments`.

## Registration

After creating a module folder, add the module definition to
`src/modules/registry.ts`.

The registry is the only App Shell integration point for reports.

## Current Phase Rule

Do not add real report modules in the foundation phase. This repository is
currently prepared for modules, but contains none.
