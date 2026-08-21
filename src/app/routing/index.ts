import { useSyncExternalStore } from 'react'
import { isDepartmentId } from '../../departments'
import type { DepartmentId } from '../../departments'
import { moduleRegistry } from '../../modules/registry'

export type RouteState =
  | { type: 'home' }
  | { type: 'department'; departmentId: DepartmentId }
  | { type: 'module'; moduleId: string }

export function getRouteState(): RouteState {
  const hashPath = window.location.hash.replace(/^#\/?/, '')
  const [firstSegment, secondSegment] = hashPath.split('/').filter(Boolean)

  if (!firstSegment) {
    return { type: 'home' }
  }

  if (firstSegment === 'modules' && secondSegment) {
    const moduleExists = moduleRegistry.some((module) => module.id === secondSegment)
    return moduleExists ? { type: 'module', moduleId: secondSegment } : { type: 'home' }
  }

  if (isDepartmentId(firstSegment)) {
    return { type: 'department', departmentId: firstSegment }
  }

  return { type: 'home' }
}

function subscribeToHashChange(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

function getHashSnapshot() {
  return window.location.hash
}

export function useRouteState() {
  useSyncExternalStore(subscribeToHashChange, getHashSnapshot)
  return getRouteState()
}
