# Roadmap

## Phase 1: Foundation

- Create Vite React TypeScript application.
- Add App Shell layout and department navigation.
- Define module contract and registry.
- Keep registry empty.
- Lock architecture boundaries for App Shell, Foundation, and Modules.
- Add official design system primitives.
- Add shared UI components for future reports.
- Add responsive App Shell with header, sidebar, breadcrumb, profile area, and
  mobile department navigation.
- Add reusable global UX states for loading, empty, error, success, skeleton,
  toast, and offline handling.
- Add architecture and AI guidance documentation.
- Prepare GitHub Pages deployment workflow.

## Phase 2: First Module

- Select one report candidate.
- Create one isolated module folder.
- Validate module integration through the registry.
- Add tests around module-specific behavior.

## Phase 3: Report Migration

- Migrate legacy reports one at a time.
- Keep each report isolated.
- Document data assumptions per module.

## Phase 4: Platform Capabilities

- Evaluate authentication needs.
- Evaluate data source integrations.
- Add shared upload, export, or scheduling capabilities only when multiple
  modules require them.
