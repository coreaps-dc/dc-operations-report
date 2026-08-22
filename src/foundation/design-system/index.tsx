import type {
  ButtonHTMLAttributes,
  DialogHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
type Size = 'sm' | 'md' | 'lg'

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: Size
}

export function Button({
  className,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={classes('ds-button', `ds-button--${variant}`, `ds-button--${size}`, className)}
      type={type}
      {...props}
    />
  )
}

export type IconButtonProps = ButtonProps & {
  label: string
}

export function IconButton({ children, label, ...props }: IconButtonProps) {
  return (
    <Button aria-label={label} className="ds-icon-button" {...props}>
      {children}
    </Button>
  )
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ className, id, label, ...props }: InputProps) {
  const input = <input className={classes('ds-input', className)} id={id} {...props} />

  if (!label) {
    return input
  }

  return (
    <label className="ds-field" htmlFor={id}>
      <span>{label}</span>
      {input}
    </label>
  )
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

export function Select({ children, className, id, label, ...props }: SelectProps) {
  const select = (
    <select className={classes('ds-select', className)} id={id} {...props}>
      {children}
    </select>
  )

  if (!label) {
    return select
  }

  return (
    <label className="ds-field" htmlFor={id}>
      <span>{label}</span>
      {select}
    </label>
  )
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return <span className={classes('ds-badge', `ds-badge--${tone}`, className)} {...props} />
}

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'section'
}

export function Card({ as: Element = 'article', className, ...props }: CardProps) {
  return <Element className={classes('ds-card', className)} {...props} />
}

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  tabs: Array<{ id: string; label: string; content: ReactNode }>
  activeId: string
  onChange?: (id: string) => void
}

export function Tabs({ activeId, className, onChange, tabs, ...props }: TabsProps) {
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <div className={classes('ds-tabs', className)} {...props}>
      <div aria-label="Tabs" className="ds-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab?.id === tab.id}
            className="ds-tabs__tab"
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ds-tabs__panel" role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  )
}

export type TooltipProps = LabelHTMLAttributes<HTMLSpanElement> & {
  content: ReactNode
}

export function Tooltip({ children, className, content, ...props }: TooltipProps) {
  return (
    <span className={classes('ds-tooltip', className)} {...props}>
      {children}
      <span className="ds-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  )
}

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={classes('ds-divider', className)} {...props} />
}

export type DropdownProps = HTMLAttributes<HTMLDetailsElement> & {
  label: ReactNode
}

export function Dropdown({ children, className, label, ...props }: DropdownProps) {
  return (
    <details className={classes('ds-dropdown', className)} {...props}>
      <summary>{label}</summary>
      <div className="ds-dropdown__menu">{children}</div>
    </details>
  )
}

export type ModalProps = DialogHTMLAttributes<HTMLDialogElement> & {
  title: string
  actions?: ReactNode
}

export function Modal({ actions, children, className, title, ...props }: ModalProps) {
  return (
    <dialog className={classes('ds-modal', className)} {...props}>
      <div className="ds-modal__header">
        <h2>{title}</h2>
      </div>
      <div className="ds-modal__body">{children}</div>
      {actions ? <div className="ds-modal__actions">{actions}</div> : null}
    </dialog>
  )
}

export type DrawerProps = HTMLAttributes<HTMLElement> & {
  title: string
  position?: 'left' | 'right'
  open?: boolean
}

export function Drawer({
  children,
  className,
  open = true,
  position = 'right',
  title,
  ...props
}: DrawerProps) {
  return (
    <aside aria-hidden={!open} className={classes('ds-drawer', `ds-drawer--${position}`, !open && 'ds-drawer--closed', className)} {...props}>
      <header className="ds-drawer__header">
        <h2>{title}</h2>
      </header>
      <div className="ds-drawer__body">{children}</div>
    </aside>
  )
}
