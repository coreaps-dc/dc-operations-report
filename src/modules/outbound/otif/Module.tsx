import { useMemo, useState } from 'react'
import { Button, Card, Input, Select } from '../../../foundation/design-system'
import { DataTable, EmptyState, FilterBar, KpiCard, PageHeader, SectionHeader } from '../../../foundation/shared-components'
import { browserOtifService } from './services'
import { summarizeOtif } from './utils'
import type { OtifOrder } from './types'
import './styles.css'

export function OtifModule() {
  const [facilityId, setFacilityId] = useState('')
  const [orders, setOrders] = useState<OtifOrder[]>([])
  const [sourceName, setSourceName] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [error, setError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const filteredOrders = useMemo(
    () => orders.filter((order) => (statusFilter === 'all' || order.status === statusFilter) && (typeFilter === 'all' || order.type === typeFilter)),
    [orders, statusFilter, typeFilter],
  )
  const overview = useMemo(() => summarizeOtif(orders, () => 'All orders')[0] ?? { total: 0, hit: 0, miss: 0, otif: 0 }, [orders])
  const dcSummary = useMemo(() => summarizeOtif(filteredOrders, (order) => order.dc), [filteredOrders])
  const typeOptions = useMemo(() => Array.from(new Set(orders.map((order) => order.type))).sort(), [orders])

  async function handleImport(file?: File) {
    if (!file) return
    setIsImporting(true)
    setError('')
    const result = await browserOtifService.importFile({ facilityId, file })
    setIsImporting(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setOrders(result.data.orders)
    setSourceName(result.data.sourceName)
  }

  return (
    <section className="page-stack otif-module">
      <PageHeader
        description="Facility-scoped OTIF processing. Imported data remains in this workspace until a Gateway-backed API adapter is configured."
        eyebrow="Outbound"
        title="OTIF"
      />

      <Card className="otif-import-card">
        <SectionHeader description="Facility ID is required. Physical Spreadsheet and partition selection remain in backend data access." title="Import source" />
        <div className="otif-import-card__controls">
          <Input id="otif-facility" label="Facility ID" onChange={(event) => setFacilityId(event.currentTarget.value)} placeholder="e.g. facility-tallo" value={facilityId} />
          <Input accept=".xlsx,.xls,.csv" disabled={isImporting} id="otif-file" label="Excel or CSV file" onChange={(event) => void handleImport(event.currentTarget.files?.[0])} type="file" />
        </div>
        {isImporting ? <p className="otif-import-card__status">Reading file and evaluating OTIF...</p> : null}
        {error ? <p className="otif-import-card__error">{error}</p> : null}
        {sourceName ? <p className="otif-import-card__status">Loaded: {sourceName}</p> : null}
      </Card>

      {orders.length === 0 ? (
        <EmptyState description="Import an OTIF Excel or CSV file for a facility to start reviewing orders." title="No OTIF data loaded" />
      ) : (
        <>
          <section className="summary-grid" aria-label="OTIF overview">
            <KpiCard label="Total orders" tone="neutral" value={overview.total.toLocaleString('id-ID')} />
            <KpiCard label="HIT" tone="success" value={overview.hit.toLocaleString('id-ID')} />
            <KpiCard label="MISS" tone="danger" value={overview.miss.toLocaleString('id-ID')} />
            <KpiCard label="OTIF" tone={overview.otif >= 95 ? 'success' : 'warning'} value={`${overview.otif.toFixed(1)}%`} />
          </section>

          <FilterBar actions={<Button onClick={() => { setStatusFilter('all'); setTypeFilter('all') }} size="sm" variant="ghost">Reset</Button>}>
            <Select id="otif-status" label="Status" onChange={(event) => setStatusFilter(event.currentTarget.value)} value={statusFilter}>
              <option value="all">All statuses</option>
              <option value="HIT">HIT</option>
              <option value="MISS">MISS</option>
            </Select>
            <Select id="otif-type" label="Order type" onChange={(event) => setTypeFilter(event.currentTarget.value)} value={typeFilter}>
              <option value="all">All types</option>
              {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
            </Select>
          </FilterBar>

          <Card>
            <SectionHeader title="OTIF by DC" />
            <DataTable columns={[
              { header: 'DC', key: 'label', render: (row) => row.label },
              { align: 'right', header: 'Total', key: 'total', render: (row) => row.total.toLocaleString('id-ID') },
              { align: 'right', header: 'HIT', key: 'hit', render: (row) => row.hit.toLocaleString('id-ID') },
              { align: 'right', header: 'MISS', key: 'miss', render: (row) => row.miss.toLocaleString('id-ID') },
              { align: 'right', header: 'OTIF', key: 'otif', render: (row) => `${row.otif.toFixed(1)}%` },
            ]} getRowKey={(row) => row.label} rows={dcSummary} />
          </Card>

          <Card>
            <SectionHeader title="Order detail" />
            <DataTable columns={[
              { header: 'DC', key: 'dc', render: (row) => row.dc },
              { header: 'BU', key: 'businessUnit', render: (row) => row.businessUnit || 'Unassigned' },
              { header: 'EXTERNORDERKEY', key: 'order', render: (row) => row.externalOrderKey },
              { header: 'Type', key: 'type', render: (row) => row.type },
              { align: 'right', header: 'Original', key: 'original', render: (row) => row.originalQty.toLocaleString('id-ID') },
              { align: 'right', header: 'Shipped', key: 'shipped', render: (row) => row.shippedQty.toLocaleString('id-ID') },
              { header: 'Status', key: 'status', render: (row) => row.status },
              { header: 'Causes', key: 'causes', render: (row) => row.causes.join(', ') || '-' },
            ]} getRowKey={(row) => `${row.type}-${row.externalOrderKey}`} rows={filteredOrders} />
          </Card>
        </>
      )}
    </section>
  )
}
