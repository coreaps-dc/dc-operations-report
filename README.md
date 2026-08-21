# RDC SDC Ops Report

Centralized App Shell for Distribution Center operational reports.

This repository contains the foundation for a modular reporting application. The
first phase intentionally does not migrate old reports, implement report
business logic, or create production report modules.

## Departments

- Outbound
- Inbound
- Inventory
- Transport

## Architecture

The application uses an App Shell plus modular report architecture:

- `src/app` owns layout, navigation, and route selection.
- `src/foundation` owns reusable design, utilities, types, and services.
- `src/departments` owns department metadata.
- `src/modules` owns the report module contract and central registry.
- `src/pages` owns shell-level screens.
- Future report modules should live in independent module folders and register
  only their metadata and entry component.

The foundation includes reusable design system primitives and shared application
components, but still contains no report business logic.

Read the full architecture notes in `docs/ARCHITECTURE.md`.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
```

## Deployment

The project is configured for GitHub Pages through `.github/workflows/pages.yml`.
The Vite base path is set to `/dc-operations-report/`.
