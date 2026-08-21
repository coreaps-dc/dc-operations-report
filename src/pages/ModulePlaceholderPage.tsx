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
        <p className="eyebrow">{module.department}</p>
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </header>
      <div className="empty-state">
        <strong>Module shell only</strong>
        <p>This module has metadata but no report implementation yet.</p>
      </div>
    </section>
  )
}
