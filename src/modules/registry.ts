import type { ReportModuleDefinition } from './types'
import { slaCustomerModule } from './outbound/sla-customer'
import { otifModule } from './outbound/otif'

export const moduleRegistry: ReportModuleDefinition[] = [slaCustomerModule, otifModule]
