import type { ApiRequest } from '.'
import type {
  AppsScriptApiResponse,
  GatewayAuthenticationEnvelope,
  PartitionLookup,
} from '../contracts/google-apps-script'
import type { EntityId } from '../types'
import type { ServiceContext, ServiceResult } from '../services'

/**
 * Contract for the future Google Apps Script REST adapter.
 * This interface intentionally has no fetch, OAuth, or deployment implementation.
 */
export interface GoogleAppsScriptApiPort {
  request<TData, TBody = unknown>(
    request: ApiRequest<TBody>,
    context?: ServiceContext,
  ): Promise<AppsScriptApiResponse<TData>>
}

/**
 * The frontend targets an OIDC Verification Gateway, never an Apps Script URL
 * directly. The gateway owns token verification and creates this envelope for
 * the downstream Apps Script adapter.
 */
export type GatewayForwardedRequest<TBody = unknown> = ApiRequest<TBody> & {
  gatewayAuthentication: GatewayAuthenticationEnvelope
}

/** Feature-facing request shape: physical Spreadsheet IDs and sheet names are intentionally absent. */
export type FacilityScopedQuery<TQuery> = {
  facilityId: EntityId
  partitionLookup?: PartitionLookup
  query: TQuery
}

/**
 * A future Apps Script adapter resolves one partition per request and reuses it
 * while reading operational data. It does not expose physical storage to modules.
 */
export interface FacilityOperationalDataAccessPort {
  query<TQuery, TResult>(
    request: FacilityScopedQuery<TQuery>,
    context?: ServiceContext,
  ): Promise<ServiceResult<TResult>>
}
