import { SlaCustomerModule } from './Module'
import type { ReportModuleDefinition } from '../../types'

export const slaCustomerModule: ReportModuleDefinition = {
  Component: SlaCustomerModule,
  department: 'outbound',
  description: 'Customer SLA summary by DC with on time, delay, and SLA backup export.',
  id: 'sla-customer',
  owner: 'Outbound Operations',
  route: '#/modules/sla-customer',
  status: 'active',
  title: 'SLA Customer',
}
