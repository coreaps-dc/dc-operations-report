import type { ComponentType } from 'react'
import type { DepartmentId } from '../departments'

export type ModuleStatus = 'planned' | 'active' | 'deprecated'

export type ReportModuleDefinition = {
  id: string
  title: string
  department: DepartmentId
  description: string
  route: string
  status: ModuleStatus
  owner?: string
  Component?: ComponentType
}
