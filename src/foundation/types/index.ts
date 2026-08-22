export type EntityId = string

/** A requested data scope. The backend remains the only authority that enforces it. */
export type DataScope = {
  organizationId: EntityId
  territoryId?: EntityId
  businessUnitId?: EntityId
  distributionCenterId?: EntityId
}

export type DataSourceKind = 'file-import' | 'external-integration'

export type ImportJobStatus =
  | 'queued'
  | 'validating'
  | 'staging'
  | 'canonicalizing'
  | 'aggregating'
  | 'completed'
  | 'failed'

export type RetentionPolicyReference = {
  policyKey: string
  appliesTo: 'raw-file' | 'staging-data' | 'canonical-data' | 'audit-log' | 'export-file'
}
