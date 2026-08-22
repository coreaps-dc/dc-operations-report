import { EmptyState, PageHeader } from '../foundation/shared-components'
import { moduleRegistry } from '../modules/registry'

type ModulePlaceholderPageProps = {
  moduleId: string
}

export function ModulePlaceholderPage({ moduleId }: ModulePlaceholderPageProps) {
  const module = moduleRegistry.find((item) => item.id === moduleId)
  const ModuleComponent = module?.Component

  if (!module) {
    return null
  }

  if (ModuleComponent) {
    return <ModuleComponent />
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <PageHeader
          description={module.description}
          eyebrow={module.department}
          title={module.title}
        />
      </header>
      <EmptyState
        description="This module has metadata but no report implementation yet."
        title="Module shell only"
      />
    </section>
  )
}
