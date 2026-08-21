import { useState } from 'react'
import { Badge, Dropdown } from '../../foundation/design-system'
import { Breadcrumb, ToastRegion } from '../global-ui'
import { departmentNavigation } from '../navigation'
import { useRouteState } from '../routing'
import { DepartmentPage } from '../../pages/DepartmentPage'
import { HomePage } from '../../pages/HomePage'
import { ModulePlaceholderPage } from '../../pages/ModulePlaceholderPage'

export function AppShell() {
  const route = useRouteState()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const currentDepartmentId = route.type === 'department' ? route.departmentId : undefined

  return (
    <div className="app-shell" data-theme={isDarkMode ? 'dark' : 'light'}>
      <header className="app-header">
        <div className="window-controls" aria-hidden="true">
          <span className="window-dot window-dot--red" />
          <span className="window-dot window-dot--orange" />
          <span className="window-dot window-dot--green" />
        </div>
        <a className="brand brand--compact" href="#/">
          <span className="brand-mark">RDC</span>
          <span>
            <strong>SDC Ops Report</strong>
            <small>Command center</small>
          </span>
        </a>

        <div className="app-header__center">
          <Breadcrumb route={route} />
        </div>

        <div className="app-header__actions">
          <Dropdown className="mobile-department-menu" label="Departments">
            {departmentNavigation.map((item) => (
              <a href={`#/${item.id}`} key={item.id}>
                {item.label}
              </a>
            ))}
          </Dropdown>
          <Badge tone="brand">Foundation</Badge>
          <button
            aria-pressed={isDarkMode}
            className="theme-toggle"
            onClick={() => setIsDarkMode((value) => !value)}
            type="button"
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <div aria-label="User profile" className="user-profile">
            <span>SDC</span>
            <strong>Ops Team</strong>
          </div>
        </div>
      </header>

      <aside className="sidebar" aria-label="Department navigation">
        <a className="brand" href="#/">
          <span className="brand-mark">RDC</span>
          <span>
            <strong>SDC Ops Report</strong>
            <small>DC operations hub</small>
          </span>
        </a>

        <div className="sidebar-section-label">Departments</div>
        <nav className="nav-list">
          {departmentNavigation.map((item) => (
            <a
              aria-current={currentDepartmentId === item.id ? 'page' : undefined}
              href={`#/${item.id}`}
              key={item.id}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </a>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <div className="content-area">
          {route.type === 'home' ? <HomePage /> : null}
          {route.type === 'department' ? (
            <DepartmentPage departmentId={route.departmentId} />
          ) : null}
          {route.type === 'module' ? (
            <ModulePlaceholderPage moduleId={route.moduleId} />
          ) : null}
        </div>
      </main>
      <ToastRegion />
    </div>
  )
}
