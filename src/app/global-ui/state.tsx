import type { ReactNode } from 'react'
import { Button } from '../../foundation/design-system'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Skeleton,
  StatusBadge,
} from '../../foundation/shared-components'

export function AppLoadingState({ label = 'Loading workspace' }: { label?: string }) {
  return <LoadingState label={label} />
}

export function AppEmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description?: ReactNode
  title: string
}) {
  return <EmptyState action={action} description={description} title={title} />
}

export function AppErrorState({
  description,
  onRetry,
  title,
}: {
  description?: ReactNode
  onRetry?: () => void
  title: string
}) {
  return (
    <ErrorState
      action={onRetry ? <Button onClick={onRetry}>Retry</Button> : undefined}
      description={description}
      title={title}
    />
  )
}

export function AppSuccessState({ message }: { message: ReactNode }) {
  return <StatusBadge tone="success">{message}</StatusBadge>
}

export function AppSkeleton({ lines = 4 }: { lines?: number }) {
  return <Skeleton lines={lines} />
}

export function OfflineState() {
  return (
    <ErrorState
      description="Check the network connection and try again."
      title="Connection unavailable"
    />
  )
}

export function ToastRegion({ children }: { children?: ReactNode }) {
  return (
    <section aria-label="Notifications" aria-live="polite" className="toast-region">
      {children}
    </section>
  )
}
