import { departments } from '../departments'
import { Card } from '../foundation/design-system'
import { KpiCard, SectionHeader } from '../foundation/shared-components'
import { moduleRegistry } from '../modules/registry'

export function HomePage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <SectionHeader
          description="App Shell for operational reporting modules across Outbound, Inbound, Inventory, and Transport. This foundation intentionally contains no report business logic yet."
          eyebrow="Centralized DC reporting foundation"
          title="RDC SDC Ops Report"
        />
      </header>

      <section className="summary-grid" aria-label="Application summary">
        <KpiCard
          description="Primary DC operational domains are ready for module grouping."
          label="Departments"
          value={departments.length}
        />
        <KpiCard
          description="No legacy reports are migrated in this foundation phase."
          label="Report modules"
          tone="neutral"
          value={moduleRegistry.length}
        />
        <KpiCard
          description="Shared navigation, routing, and module boundaries live here."
          label="App Shell"
          value={1}
        />
      </section>

      <section className="department-grid" aria-label="Departments">
        {departments.map((department) => (
          <Card as="article" className="department-card" key={department.id}>
            <strong>{department.name}</strong>
            <p>{department.description}</p>
            <a href={`#/${department.id}`}>Open department</a>
          </Card>
        ))}
      </section>
    </section>
  )
}
