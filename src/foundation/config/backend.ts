export type BackendFeatureFlags = {
  auditLog: boolean
  externalIntegrations: boolean
  fileImports: boolean
}

/** Runtime values are injected by deployment configuration, never hard-coded in UI modules. */
export type BackendEnvironment = {
  apiUrl: string
  apiVersion: string
  requestTimeoutMs: number
  featureFlags: BackendFeatureFlags
}

export type BackendEnvironmentInput = Partial<BackendEnvironment>
