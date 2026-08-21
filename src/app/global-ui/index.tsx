import { departments } from '../../departments'
import type { RouteState } from '../routing'
export {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  AppSkeleton,
  AppSuccessState,
  OfflineState,
  ToastRegion,
} from './state'

type BreadcrumbProps = {
  route: RouteState
}

export function Breadcrumb({ route }: BreadcrumbProps) {
  const department =
    route.type === 'department'
      ? departments.find((item) => item.id === route.departmentId)
      : undefined

  const currentLabel =
    route.type === 'home'
      ? 'Overview'
      : route.type === 'module'
        ? 'Module'
        : department?.name

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <a href="#/">RDC SDC Ops Report</a>
      <span aria-hidden="true">/</span>
      <span>{currentLabel}</span>
    </nav>
  )
}
