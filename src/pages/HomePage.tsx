import { departments } from '../departments'
import { moduleRegistry } from '../modules/registry'

export function HomePage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Centralized DC reporting foundation</p>
        <h1>RDC SDC Ops Report</h1>
        <p>
          App Shell for operational reporting modules across Outbound, Inbound,
          Inventory, and Storing. This foundation intentionally contains no
          report business logic yet.
        </p>
      </header>

      <section className="summary-grid" aria-label="Application summary">
        <article>
          <span>{departments.length}</span>
          <strong>Departments</strong>
          <p>Primary DC operational domains are ready for module grouping.</p>
        </article>
        <article>
          <span>{moduleRegistry.length}</span>
          <strong>Report modules</strong>
          <p>No legacy reports are migrated in this foundation phase.</p>
        </article>
        <article>
          <span>1</span>
          <strong>App Shell</strong>
          <p>Shared navigation, routing, and module boundaries live here.</p>
        </article>
      </section>

      <section className="department-grid" aria-label="Departments">
        {departments.map((department) => (
          <a href={`#/${department.id}`} key={department.id}>
            <strong>{department.name}</strong>
            <p>{department.description}</p>
          </a>
        ))}
      </section>
    </section>
  )
}
