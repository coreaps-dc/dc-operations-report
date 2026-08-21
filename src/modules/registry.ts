import type { ReportModuleDefinition } from './types'
import { slaCustomerModule } from './outbound/sla-customer'

export const moduleRegistry: ReportModuleDefinition[] = [slaCustomerModule]
