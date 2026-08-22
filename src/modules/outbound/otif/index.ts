import { OtifModule } from './Module'
import type { ReportModuleDefinition } from '../../types'

export const otifModule: ReportModuleDefinition = {
  Component: OtifModule,
  department: 'outbound',
  description: 'Facility-scoped OTIF import, evaluation, summary, and order review.',
  id: 'otif',
  owner: 'Outbound Operations',
  route: '#/modules/otif',
  status: 'active',
  title: 'OTIF',
}
