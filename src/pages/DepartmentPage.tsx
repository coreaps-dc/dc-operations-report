import { departments } from '../departments'
import type { DepartmentId } from '../departments'
import { Card } from '../foundation/design-system'
import { EmptyState, PageHeader, SectionHeader, StatusBadge } from '../foundation/shared-components'
import { moduleRegistry } from '../modules/registry'

type DepartmentPageProps = {
  departmentId: DepartmentId
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
        <PageHeader
          description={department.description}
          eyebrow={department.owner}
          title={department.name}
        />
      </header>

      <section className="module-list" aria-label={`${department.name} modules`}>
        <SectionHeader
          actions={<StatusBadge tone="brand">{modules.length} registered</StatusBadge>}
          title="Report Modules"
        />

        {modules.length === 0 ? (
          <EmptyState
            description={`Future reports for ${department.name} will appear here after they are added through the module registry.`}
            title="No modules registered yet"
          />
        ) : (
          modules.map((module) => (
            <Card as="article" key={module.id}>
              <strong>{module.title}</strong>
              <p>{module.description}</p>
              <StatusBadge>{module.status}</StatusBadge>
              <a href={`#/modules/${module.id}`}>Open module</a>
            </Card>
          ))
        )}
      </section>
    </section>
  )
}
