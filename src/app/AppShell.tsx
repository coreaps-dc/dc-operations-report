import { departmentNavigation } from './navigation'
import { useRouteState } from './routes'
import { DepartmentPage } from '../pages/DepartmentPage'
import { HomePage } from '../pages/HomePage'
import { ModulePlaceholderPage } from '../pages/ModulePlaceholderPage'

export function AppShell() {
  const route = useRouteState()
  const currentDepartmentId = route.type === 'department' ? route.departmentId : undefined

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Department navigation">
        <a className="brand" href="#/">
          <span className="brand-mark">RDC</span>
          <span>
            <strong>SDC Ops Report</strong>
            <small>DC operations hub</small>
          </span>
        </a>

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
        {route.type === 'home' ? <HomePage /> : null}
        {route.type === 'department' ? (
          <DepartmentPage departmentId={route.departmentId} />
        ) : null}
        {route.type === 'module' ? (
          <ModulePlaceholderPage moduleId={route.moduleId} />
        ) : null}
      </main>
    </div>
  )
}
