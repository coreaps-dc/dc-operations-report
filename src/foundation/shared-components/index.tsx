import type { ReactNode } from 'react'
import {
  Badge,
  Button,
  Card,
  Drawer,
  Input,
  Modal,
  Select,
} from '../design-system'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

export type DataTableColumn<Row> = {
  key: string
  header: ReactNode
  render: (row: Row) => ReactNode
  align?: 'left' | 'center' | 'right'
}

export type DataTableProps<Row> = {
  columns: Array<DataTableColumn<Row>>
  rows: Row[]
  getRowKey: (row: Row, index: number) => string
  emptyMessage?: string
}

export function DataTable<Row>({
  columns,
  emptyMessage = 'No data available.',
  getRowKey,
  rows,
}: DataTableProps<Row>) {
  return (
    <div className="sc-table-wrap">
      <table className="sc-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th data-align={column.align ?? 'left'} key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowKey(row, index)}>
                {columns.map((column) => (
                  <td data-align={column.align ?? 'left'} key={column.key}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export type KpiCardProps = {
  label: string
  value: ReactNode
  description?: ReactNode
  tone?: Tone
}

export function KpiCard({ description, label, tone = 'brand', value }: KpiCardProps) {
  return (
    <Card className="sc-kpi-card">
      <span className={`sc-kpi-card__value sc-kpi-card__value--${tone}`}>{value}</span>
      <strong>{label}</strong>
      {description ? <p>{description}</p> : null}
    </Card>
  )
}

export type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export function SectionHeader({ actions, description, eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="sc-section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="sc-section-header__actions">{actions}</div> : null}
    </div>
  )
}

export type FilterBarProps = {
  children: ReactNode
  actions?: ReactNode
}

export function FilterBar({ actions, children }: FilterBarProps) {
  return (
    <div className="sc-filter-bar">
      <div className="sc-filter-bar__fields">{children}</div>
      {actions ? <div className="sc-filter-bar__actions">{actions}</div> : null}
    </div>
  )
}

export type DatePickerProps = {
  id: string
  label?: string
  value?: string
  onChange?: (value: string) => void
}

export function DatePicker({ id, label, onChange, value }: DatePickerProps) {
  return (
    <Input
      id={id}
      label={label}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      type="date"
      value={value}
    />
  )
}

export type SearchProps = {
  id: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function Search({
  id,
  label = 'Search',
  onChange,
  placeholder = 'Search',
  value,
}: SearchProps) {
  return (
    <Input
      id={id}
      label={label}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      placeholder={placeholder}
      type="search"
      value={value}
    />
  )
}

export type PaginationProps = {
  page: number
  pageCount: number
  onPrevious?: () => void
  onNext?: () => void
}

export function Pagination({ onNext, onPrevious, page, pageCount }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="sc-pagination">
      <Button disabled={page <= 1} onClick={onPrevious} size="sm" variant="secondary">
        Previous
      </Button>
      <span>
        Page {page} of {pageCount}
      </span>
      <Button disabled={page >= pageCount} onClick={onNext} size="sm" variant="secondary">
        Next
      </Button>
    </nav>
  )
}

export type StatusBadgeProps = {
  children: ReactNode
  tone?: Tone
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <Badge tone={tone}>{children}</Badge>
}

export type ProgressIndicatorProps = {
  label: string
  value: number
  max?: number
}

export function ProgressIndicator({ label, max = 100, value }: ProgressIndicatorProps) {
  const normalizedValue = Math.max(0, Math.min(value, max))
  const percentage = max === 0 ? 0 : Math.round((normalizedValue / max) * 100)

  return (
    <div className="sc-progress">
      <div className="sc-progress__meta">
        <span>{label}</span>
        <strong>{percentage}%</strong>
      </div>
      <div aria-label={label} aria-valuemax={max} aria-valuemin={0} aria-valuenow={normalizedValue} className="sc-progress__track" role="progressbar">
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export type ChartContainerProps = {
  title: string
  description?: ReactNode
  children: ReactNode
}

export function ChartContainer({ children, description, title }: ChartContainerProps) {
  return (
    <Card as="section" className="sc-chart-container">
      <SectionHeader description={description} title={title} />
      <div className="sc-chart-container__body">{children}</div>
    </Card>
  )
}

export type EmptyStateProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="sc-empty-state">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </Card>
  )
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div aria-live="polite" className="sc-loading-state">
      <span />
      <strong>{label}</strong>
    </div>
  )
}

export type ErrorStateProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
}

export function ErrorState({ action, description, title }: ErrorStateProps) {
  return (
    <Card className="sc-error-state">
      <StatusBadge tone="danger">Error</StatusBadge>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </Card>
  )
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div aria-hidden="true" className="sc-skeleton">
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

export type ConfirmationDialogProps = {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmationDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmationDialogProps) {
  return (
    <Modal
      actions={
        <>
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} variant="primary">
            {confirmLabel}
          </Button>
        </>
      }
      open={open}
      title={title}
    >
      {description ? <p>{description}</p> : null}
    </Modal>
  )
}

export type DetailDrawerProps = {
  title: string
  children: ReactNode
  position?: 'left' | 'right'
}

export function DetailDrawer({ children, position, title }: DetailDrawerProps) {
  return (
    <Drawer position={position} title={title}>
      {children}
    </Drawer>
  )
}

export const NativeSelect = Select
