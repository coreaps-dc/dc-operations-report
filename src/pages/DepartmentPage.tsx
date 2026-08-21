import { departments } from '../departments'
import { moduleRegistry } from '../modules/registry'

type DepartmentPageProps = {
  departmentId: string
}

export function DepartmentPage({ departmentId }: DepartmentPageProps) {
  const department = departments.find((item) => item.id === departmentId)
  const modules = moduleRegistry.filter((module) => module.department === departmentId)

  if (!department) {
    return null
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">{department.owner}</p>
        <h1>{department.name}</h1>
        <p>{department.description}</p>
      </header>

      <section className="module-list" aria-label={`${department.name} modules`}>
        <div className="section-heading">
          <h2>Report Modules</h2>
          <span>{modules.length} registered</span>
        </div>

        {modules.length === 0 ? (
          <div className="empty-state">
            <strong>No modules registered yet</strong>
            <p>
              Future reports for {department.name} will appear here after they
              are added through the module registry.
            </p>
          </div>
        ) : (
          modules.map((module) => (
            <a href={`#/modules/${module.id}`} key={module.id}>
              <strong>{module.title}</strong>
              <p>{module.description}</p>
              <span>{module.status}</span>
            </a>
          ))
        )}
      </section>
    </section>
  )
}
