# Data and Backend Architecture

## Locked Decisions

- The platform starts with one organization and remains multi-organization ready.
- Enterprise OAuth/OIDC SSO is the identity direction; no identity provider is selected.
- The enforced scope hierarchy is Organization -> Territory -> Business Unit -> Distribution Center.
- A relational database is the system of record. No database vendor is selected.
- Historical reporting starts from the operational database. A future analytical store is optional.
- Retention is policy-driven and configurable; no final periods are hard-coded.
- Data sources support manual file import and future API/WMS integration.
- Backend services and APIs are stateless and provider-agnostic.

## Enforced Data Flow

```text
UI -> Module Service -> Data Access Port -> HTTPS API -> Backend Domain Service -> Database
```

The frontend can submit a requested scope for filtering, but it is never an
authorization decision. Backend authorization validates the authenticated user,
role, permission, and permitted hierarchy scope for every request.

## Core Platform Concepts

The relational model reserves conceptual entities for:

- organizations, territories, business_units, distribution_centers
- users, roles, permissions, user_data_scopes
- modules, module_configurations
- audit_logs
- files, import_jobs, import_job_rows, export_jobs

These are concepts only. No schema or production database is created by this
foundation.

## Data Ingestion and Retention

```text
Raw File or Integration Payload -> Validation -> Staging -> Canonical Data -> Reporting/Aggregation
```

Raw files and external payloads remain traceable to import jobs. Canonical data
uses explicit module domain tables, while reusable platform entities remain
shared. Retention policies are configuration references applied by the backend
to raw files, staging data, canonical data, exports, and audit logs.

## Frontend Contracts

- `foundation/types` defines provider-neutral scope, source, import lifecycle,
  and retention concepts.
- `foundation/services` is the only dependency UI components use for queries and
  commands.
- `foundation/data-access` defines a generic repository port plus an API
  transport boundary for a future authenticated API adapter.
- No UI component, module, or foundation primitive may implement database access,
  authentication provider logic, or production API calls.
