# Architecture

RDC SDC Ops Report uses an App Shell plus Modular Module architecture.

## Goals

- Centralize DC operational reporting in one frontend application.
- Keep Outbound, Inbound, Inventory, and Storing as first-class departments.
- Allow each future report to be added as an independent module.
- Keep the repository AI-friendly by making boundaries explicit and small.
- Support static hosting on GitHub Pages while the app does not require backend
  services.

## App Shell

The App Shell owns the shared application frame:

- brand and department navigation
- hash-based route selection for GitHub Pages compatibility
- shell-level pages
- rendering registered modules

Files:

- `src/app/AppShell.tsx`
- `src/app/navigation.ts`
- `src/app/routes.ts`

## Departments

Department metadata lives in `src/departments/index.ts`.

Departments are grouping domains, not report implementations. Changing a
department name or description should not require touching individual report
modules.

## Modules

Module metadata and contracts live in `src/modules`.

Current phase:

- `moduleRegistry` is empty.
- No old report is migrated.
- No report business logic is implemented.

Future phase:

- each report gets an independent folder
- each report exports metadata and a component
- the registry imports and exposes the module definition

## Routing

The app uses hash routes:

- `#/` for the home shell
- `#/outbound`
- `#/inbound`
- `#/inventory`
- `#/storing`
- `#/modules/:moduleId`

Hash routing avoids server rewrite requirements and is suitable for GitHub
Pages.

## Boundaries

App Shell files must not contain report-specific calculations, parsing,
transformations, or operational rules. Those belong in future module folders.
