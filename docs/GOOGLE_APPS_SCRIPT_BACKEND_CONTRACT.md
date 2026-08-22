# Google Apps Script and Spreadsheet Backend Contract

## Boundary

Google Apps Script is the future REST API boundary. Google Spreadsheet is the
operational data store and Google Drive stores uploaded and exported files. No
Apps Script deployment, spreadsheet, Drive folder, OAuth flow, or API client is
implemented by this contract.

```text
UI -> Module Service -> GoogleAppsScriptApiPort -> Apps Script REST API -> Spreadsheet / Drive
```

## OIDC Verification Gateway

The frontend never calls an Apps Script deployment URL directly. It calls a
provider-neutral OIDC Verification Gateway. The gateway verifies the original
OIDC token and forwards an HMAC-signed identity envelope to Apps Script. Apps
Script verifies the signature, timestamp, and one-time nonce before any scope or
partition operation. Missing configuration fails closed.

The generic contract is `GatewayAuthenticationEnvelope`; the Apps Script adapter
is in `backend/apps-script/src/GatewayAuth.gs`. No identity provider, gateway
vendor, secret, or deployment URL is committed here.

## Spreadsheet Structure

Each database is a logical Spreadsheet. It may be split later for operational
capacity, while retaining the same API contract.

| Logical database | Required sheets | Purpose |
| --- | --- | --- |
| `MASTER_DB` | `organizations`, `territories`, `business_units`, `distribution_centers`, `facility_partitions`, `users`, `roles`, `permissions`, `user_data_scopes`, `modules` | Shared controlled master data and logical partition registry |
| `CONFIG_DB` | `module_configurations`, `feature_flags`, `retention_policies`, `facility_storage_mappings`, `environment_settings` | Runtime configuration and facility mapping |
| `AUDIT_DB` | `audit_logs`, `request_logs`, `security_events` | Immutable operational audit trail |
| `FACILITY_DB` | `files`, `import_jobs`, `import_job_rows`, `export_jobs`, `staging_*`, module canonical tables, module aggregates | Facility-scoped operational and historical data |

`FACILITY_DB` is scoped by `facility_id` and must retain the hierarchy:
Organization -> Territory -> Business Unit -> Distribution Center.

## Facility Partitions

A facility remains one logical business entity. A partition is a physical
storage segment selected by the backend for that facility, optionally by date or
date range. This lets a facility begin with one spreadsheet and later distribute
operational data over several spreadsheets without changing feature modules.

`MASTER_DB.facility_partitions` conceptually stores:

```text
partition_id | facility_id | spreadsheet_id | start_date | end_date | status |
created_at | archived_at
```

The registry supports one facility to one partition, one facility to many
partitions, and many facilities to many partitions. `spreadsheet_id` is backend
storage metadata; it must not be returned to feature modules.

Example: RDC Tallo can be kept as one facility while `TALLO-2026-H1` and
`TALLO-2026-H2` resolve to separate physical spreadsheets. It is only a
scalability example, never a special-case rule.

Resolution is lazy and request-scoped:

```text
Facility ID + date/range -> Partition Resolver -> logical FacilityPartition
-> internal Spreadsheet ID -> operational data query
```

The resolver is expected to resolve once per request and reuse the result during
the operational read. Automatic capacity rollover, migration, and partition
creation are intentionally future work.

## Facility Mapping

`CONFIG_DB.facility_storage_mappings` maps each `facility_id` to its facility
Spreadsheet ID and to the logical master/config/audit Spreadsheet IDs. IDs are
configuration data managed by the backend and must not be committed into the
frontend repository.

Minimum columns:

```text
facility_id | spreadsheet_id | master_db_spreadsheet_id | config_db_spreadsheet_id |
audit_db_spreadsheet_id | is_active | updated_at
```

## API Standard

All API responses use one envelope:

```text
Success: { ok: true, data, meta: { requestId, apiVersion } }
Failure: { ok: false, error: { code, message, validation? }, meta: { requestId, apiVersion } }
```

List responses return `data: { items, nextCursor?, total? }`. Validation errors
use `validation: [{ field, code, message }]`. The API assigns `requestId`; the
frontend may provide a correlation ID but does not make authorization decisions.

## Contract Endpoints

| Endpoint | Contract purpose |
| --- | --- |
| `GET /v1/facilities` | List facilities within backend-enforced scope |
| `GET /v1/facility-storage-mappings/:facilityId` | Read storage mapping for authorized administration only |
| `GET /v1/facility-partitions` | List logical partitions for an authorized facility |
| `POST /v1/facility-partitions/resolve` | Resolve a logical partition from Facility ID and date/range |
| `GET /v1/master/:resource` | Read controlled master resources |
| `GET /v1/module-configurations/:moduleId` | Read module configuration within scope |
| `GET /v1/audit-logs` | Read authorized audit history |
| `POST /v1/import-jobs` | Create a generic ingestion job; no report processing contract is included |

TypeScript request and response contracts are in
`src/foundation/contracts/google-apps-script.ts`.

## Environment Contract

The frontend uses deployment-injected values only:

```text
apiUrl
apiVersion
requestTimeoutMs
featureFlags.auditLog
featureFlags.externalIntegrations
featureFlags.fileImports
```

Values are defined by `src/foundation/config/backend.ts`; no URL, secret,
Spreadsheet ID, or provider credential is hard-coded.
