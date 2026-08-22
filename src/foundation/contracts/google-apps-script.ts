import type { DataScope, EntityId, ImportJobStatus } from '../types'
import type { Page, PageRequest } from '../data-access'

export type ApiValidationIssue = {
  field: string
  code: string
  message: string
}

export type ApiMeta = {
  requestId: string
  apiVersion: string
}

export type ApiSuccess<TData> = {
  ok: true
  data: TData
  meta: ApiMeta
}

export type ApiFailure = {
  ok: false
  error: {
    code: string
    message: string
    validation?: ApiValidationIssue[]
  }
  meta: ApiMeta
}

export type AppsScriptApiResponse<TData> = ApiSuccess<TData> | ApiFailure

export type FacilityRecord = {
  id: EntityId
  code: string
  name: string
  scope: DataScope
  isActive: boolean
}

/** A configuration record only. Spreadsheet IDs are returned by the API, never embedded in UI modules. */
export type FacilityStorageMapping = {
  facilityId: EntityId
  spreadsheetId: string
  masterDbSpreadsheetId: string
  configDbSpreadsheetId: string
  auditDbSpreadsheetId: string
  updatedAt: string
}

export const partitionStatuses = ['active', 'archived'] as const

export type PartitionStatus = (typeof partitionStatuses)[number]

export type PartitionDateRange = {
  startDate: string
  endDate?: string
}

export type PartitionLookup =
  | { kind: 'date'; date: string }
  | { kind: 'range'; range: PartitionDateRange }

/** Logical storage segment exposed to modules. Physical spreadsheet details stay in data access. */
export type FacilityPartition = {
  id: EntityId
  facilityId: EntityId
  status: PartitionStatus
  dateRange?: PartitionDateRange
  createdAt: string
  archivedAt?: string
}

/** Backend-only metadata used by the Apps Script adapter to access a physical spreadsheet. */
export type FacilityPartitionStorage = FacilityPartition & {
  spreadsheetId: string
}

export type PartitionResolution =
  | { kind: 'resolved'; partition: FacilityPartition }
  | { kind: 'not-found'; facilityId: EntityId; lookup: PartitionLookup }

export type ResolveFacilityPartitionRequest = {
  facilityId: EntityId
  lookup: PartitionLookup
}

export type GetActiveFacilityPartitionRequest = {
  facilityId: EntityId
}

export type ListFacilityPartitionsRequest = PageRequest & {
  facilityId: EntityId
  status?: PartitionStatus
}

export type ListFacilityPartitionsResponse = Page<FacilityPartition>

export type MasterResource =
  | 'territories'
  | 'business-units'
  | 'distribution-centers'
  | 'roles'
  | 'permissions'

export type ListFacilitiesRequest = PageRequest & {
  requestedScope?: DataScope
}

export type ListFacilitiesResponse = Page<FacilityRecord>

export type ListMasterDataRequest = PageRequest & {
  resource: MasterResource
  requestedScope?: DataScope
}

export type ListMasterDataResponse = Page<Record<string, unknown>>

export type GetModuleConfigurationRequest = {
  moduleId: string
  requestedScope?: DataScope
}

export type ModuleConfigurationRecord = {
  moduleId: string
  scope: DataScope
  values: Record<string, unknown>
  updatedAt: string
}

export type AuditLogRecord = {
  id: EntityId
  action: string
  actorId: EntityId
  entityType: string
  entityId?: EntityId
  scope: DataScope
  occurredAt: string
  requestId: string
}

export type ListAuditLogsRequest = PageRequest & {
  requestedScope?: DataScope
  from?: string
  to?: string
}

export type ListAuditLogsResponse = Page<AuditLogRecord>

export type CreateImportJobRequest = {
  source: 'file-import' | 'external-integration'
  requestedScope: DataScope
  fileId?: EntityId
  integrationReference?: string
}

export type ImportJobRecord = {
  id: EntityId
  source: CreateImportJobRequest['source']
  status: ImportJobStatus
  scope: DataScope
  createdAt: string
  updatedAt: string
}

export type CreateImportJobResponse = ImportJobRecord

export type GoogleAppsScriptEndpoint =
  | 'GET /v1/facilities'
  | 'GET /v1/facility-storage-mappings/:facilityId'
  | 'GET /v1/facility-partitions'
  | 'POST /v1/facility-partitions/resolve'
  | 'GET /v1/master/:resource'
  | 'GET /v1/module-configurations/:moduleId'
  | 'GET /v1/audit-logs'
  | 'POST /v1/import-jobs'
