# Architecture

RDC SDC Ops Report uses an App Shell plus Modular Module architecture.

The current foundation is intentionally limited to architecture, routing,
department grouping, and module contracts. It does not include report business
logic or migrated legacy reports.

## Goals

- Centralize DC operational reporting in one frontend application.
- Keep Outbound, Inbound, Inventory, and Transport as first-class departments.
- Allow each future report to be added as an independent module.
- Keep the repository AI-friendly by making boundaries explicit and small.
- Support static hosting on GitHub Pages while the app does not require backend
  services.

## Source Layers

```text
src/
  app/
    layout/
    navigation/
    routing/
    global-ui/
  foundation/
    design-system/
    shared-components/
    utilities/
    types/
    services/
    data-access/
  departments/
  modules/
    inventory/
    inbound/
    outbound/
    transport/
  pages/
```

## App Shell

The App Shell owns application composition only:

- `src/app/layout` owns shell layout and main page placement.
- `src/app/navigation` owns navigation models.
- `src/app/routing` owns hash route parsing and route state.
- `src/app/global-ui` is reserved for app-level UI such as future headers,
  breadcrumbs, toasts, overlays, and mobile navigation.
- `src/app/global-ui/state.tsx` exposes reusable loading, empty, error,
  success, skeleton, toast, and offline states.

App Shell files must not contain report-specific calculations, parsing,
transformations, operational rules, or module business logic.

## Foundation

The foundation layer owns reusable, cross-application building blocks:

- `src/foundation/design-system`: design tokens and primitive UI components
- `src/foundation/shared-components`: reusable composed UI components
- `src/foundation/utilities`: generic helper functions
- `src/foundation/types`: cross-cutting application types
- `src/foundation/services`: shared service adapters
- `src/foundation/data-access`: backend-facing repository ports and pagination contracts

Foundation code must stay domain-neutral. It may be used by App Shell and future
modules, but it must not import from specific modules.

## Data Access Boundary

All future data flows follow this direction:

```text
UI component -> module service -> data-access port -> API/backend -> database
```

- React components call a module service contract only.
- Module services translate UI intent into data-access calls.
- `foundation/data-access` defines ports only; it contains no production API client,
  database SDK, credentials, or vendor choice.
- Concrete transport implementations belong outside component folders and are
  injected into module services when a backend decision is approved.
- `docs/DATA_BACKEND_ARCHITECTURE.md` is the locked, vendor-neutral data and
  backend decision record.
- `docs/GOOGLE_APPS_SCRIPT_BACKEND_CONTRACT.md` defines the future Apps Script,
  Spreadsheet, and Drive contract without an implementation.

## Backend Lock

The platform starts with one organization while retaining organization scope in
its contracts for a future multi-organization deployment. The backend enforces
Organization -> Territory -> Business Unit -> Distribution Center access scope;
the frontend is never a security boundary. The system of record will be a
relational database behind a stateless API, with OAuth/OIDC-ready SSO and no
selected provider. Manual import and future API/WMS integration use the same
raw -> validation -> staging -> canonical -> aggregation pipeline.

For Google Spreadsheet storage, a facility is logical while partitions are
physical storage segments. Feature modules request Facility ID and optional
date/range only; the Apps Script data-access adapter resolves the partition and
Spreadsheet internally. See `docs/GOOGLE_APPS_SCRIPT_BACKEND_CONTRACT.md`.

### Design System

The design system defines enterprise command-center UI primitives:

- colors, typography, spacing, radius, shadows, borders, breakpoints,
  transitions, and z-index tokens
- Button
- Input
- Select
- Badge
- Card
- Tabs
- Tooltip
- Divider
- IconButton
- Dropdown
- Modal
- Drawer

### Shared Components

Shared components are reusable application-level building blocks:

- DataTable
- KPI Card
- Page Header
- Section Header
- Filter Bar
- Date Picker
- Search
- Pagination
- Status Badge
- Progress Indicator
- Chart Container
- Empty State
- Loading State
- Error State
- Skeleton
- Confirmation Dialog
- Detail Drawer

These components must not include report-specific assumptions.

## Departments

Department metadata lives in `src/departments/index.ts`.

Departments are grouping domains, not report implementations. Changing a
department name or description should not require touching individual report
modules.

Current departments:

- Outbound
- Inbound
- Inventory
- Transport

## Modules

Module metadata and contracts live in `src/modules`.

Current phase:

- `moduleRegistry` is empty.
- Department namespace folders exist only as architecture boundaries.
- No old report is migrated.
- No report business logic is implemented.

Future phase:

- each report gets an independent folder under its department namespace
- each report exports metadata and a component
- the registry imports and exposes the module definition

## Routing

The app uses hash routes:

- `#/` for the home shell
- `#/outbound`
- `#/inbound`
- `#/inventory`
- `#/transport`
- `#/modules/:moduleId`

Hash routing avoids server rewrite requirements and is suitable for GitHub
Pages.

## Dependency Boundaries

Allowed dependency direction:

```text
app -> pages -> departments
app -> modules registry
pages -> modules registry
modules -> foundation
modules -> departments
app -> foundation
pages -> foundation
modules -> foundation/services -> foundation/data-access
```

Rules:

- `foundation` must not import from `app`, `pages`, or concrete modules.
- Concrete modules must not import from each other.
- React components must not import API clients, database SDKs, or data-access implementations.
- Modules must not access a database directly; they use module services and the shared ports.
- Concrete modules must integrate through `src/modules/registry.ts`.
- App Shell must not import implementation details from a concrete module.
- Business logic must not live in shared UI or App Shell files.
- Circular dependencies are not allowed.
- Report modules should use design system and shared components instead of
  creating one-off UI patterns.
- Future modules must use global state components instead of creating local
  loading, empty, error, success, skeleton, toast, or offline state systems.

These boundaries keep future AI work focused on the requested module instead of
requiring a full repository scan.

## Architecture Lock

The foundation is ready for first-module planning when `npm run lint`,
`npm run build`, `git status`, and `git diff` have been reviewed and the module
registry remains the only App Shell integration point.
