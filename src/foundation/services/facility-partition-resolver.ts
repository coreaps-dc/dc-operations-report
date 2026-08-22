import type {
  FacilityPartition,
  ListFacilityPartitionsRequest,
  PartitionResolution,
  ResolveFacilityPartitionRequest,
} from '../contracts/google-apps-script'
import type { Page } from '../data-access'
import type { EntityId } from '../types'
import type { ServiceContext, ServiceResult } from '.'

/**
 * Logical partition resolver. Implementations may cache resolutions for the
 * lifetime of ServiceContext.requestId, but feature modules never receive a Spreadsheet ID.
 */
export interface FacilityPartitionResolver {
  resolvePartition(
    request: ResolveFacilityPartitionRequest,
    context?: ServiceContext,
  ): Promise<ServiceResult<PartitionResolution>>
  getActivePartition(
    facilityId: EntityId,
    context?: ServiceContext,
  ): Promise<ServiceResult<FacilityPartition | undefined>>
  listPartitions(
    request: ListFacilityPartitionsRequest,
    context?: ServiceContext,
  ): Promise<ServiceResult<Page<FacilityPartition>>>
}
