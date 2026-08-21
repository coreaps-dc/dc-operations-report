import { useMemo, useState } from 'react'
import { Badge, Button, Card, Input, Select } from '../../../foundation/design-system'
import {
  DataTable,
  EmptyState,
  FilterBar,
  SectionHeader,
  StatusBadge,
} from '../../../foundation/shared-components'
import {
  filterRecords,
  parseSlaCustomerFile,
  summarizeSla,
  toSpreadsheetCsv,
} from './utils'
import type { DcConfig, SlaCustomerRecord } from './types'
import './styles.css'

const configStorageKey = 'rdc-sdc-sla-customer-dc-config'

function readConfig(): DcConfig[] {
  const raw = localStorage.getItem(configStorageKey)
  return raw ? (JSON.parse(raw) as DcConfig[]) : []
}

function downloadCsv(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function SlaCustomerModule() {
  const [records, setRecords] = useState<SlaCustomerRecord[]>([])
  const [configs, setConfigs] = useState<DcConfig[]>(readConfig)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    area: '',
    bu: '',
    endDate: '',
    startDate: '',
    type: '',
  })
  const [draftConfig, setDraftConfig] = useState<DcConfig>({
    bu: '',
    dcName: '',
    territory: '',
  })

  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters])
  const summary = useMemo(() => summarizeSla(filteredRecords, configs), [configs, filteredRecords])
  const totalOrders = summary.reduce((total, row) => total + row.onTime + row.delay, 0)
  const totalDelay = summary.reduce((total, row) => total + row.delay, 0)
  const totalOnTime = summary.reduce((total, row) => total + row.onTime, 0)
  const totalSla = totalOrders === 0 ? 0 : (totalOnTime / totalOrders) * 100
  const typeOptions = Array.from(new Set(records.map((record) => record.type).filter(Boolean)))
  const areaOptions = Array.from(
    new Set(records.map((record) => record.areaPengiriman).filter(Boolean)),
  )
  const buOptions = Array.from(new Set(records.map((record) => record.storerKey).filter(Boolean)))

  async function handleFiles(files: FileList | null) {
    if (!files) return
    setError('')

    try {
      const importedRows = await Promise.all(
        Array.from(files).map(async (file) => parseSlaCustomerFile(await file.text(), file.name)),
      )
      setRecords(importedRows.flat())
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to import file.')
    }
  }

  function saveConfig() {
    if (!draftConfig.dcName) return
    const nextConfigs = [
      ...configs.filter((config) => config.dcName !== draftConfig.dcName.toUpperCase()),
      { ...draftConfig, dcName: draftConfig.dcName.toUpperCase() },
    ]
    setConfigs(nextConfigs)
    localStorage.setItem(configStorageKey, JSON.stringify(nextConfigs))
    setDraftConfig({ bu: '', dcName: '', territory: '' })
  }

  return (
    <section className="sla-module page-stack">
      <SectionHeader
        actions={<Badge tone="brand">Outbound</Badge>}
        description="Import SLA customer data, filter shipment performance, and export spreadsheet-ready backup."
        eyebrow="SLA Customer"
        title="Outbound SLA Customer"
      />

      <Card className="sla-upload-panel">
        <div>
          <strong>Drag or import data</strong>
          <p>
            Required headers: EXTERNORDERKEY, STORERKEY, TYPE, DELAY TIME, AREA PENGIRIMAN,
            SHIPPED DATE.
          </p>
        </div>
        <label className="sla-file-drop">
          <input
            accept=".csv,.tsv,.txt"
            multiple
            onChange={(event) => void handleFiles(event.currentTarget.files)}
            type="file"
          />
          <span>Drop CSV/TSV here or choose file</span>
        </label>
        {error ? <StatusBadge tone="danger">{error}</StatusBadge> : null}
      </Card>

      <section className="sla-summary-grid">
        <Card className="sla-total-card sla-total-card--sla">
          <div>
            <span>{totalSla.toFixed(1)}%</span>
            <strong>SLA</strong>
            <p>{totalOrders} counted orders</p>
          </div>
          <div className="sla-sparkline" aria-label="dc-ontime-delay-sla-sparkline">
            <span style={{ height: `${Math.max(12, totalSla)}%` }} />
            <span style={{ height: `${Math.max(12, 100 - totalSla)}%` }} />
            <span style={{ height: `${Math.max(12, totalOrders ? 82 : 12)}%` }} />
          </div>
        </Card>
        <Card className="sla-total-card sla-total-card--success">
          <span>{totalOnTime}</span>
          <strong>On Time</strong>
          <p>Delay time equals 0</p>
        </Card>
        <Card className="sla-total-card sla-total-card--danger">
          <span>{totalDelay}</span>
          <strong>Delay</strong>
          <p>Delay time greater than 0</p>
        </Card>
      </section>

      <FilterBar
        actions={
          <Button
            disabled={summary.length === 0}
            onClick={() => downloadCsv('sla-customer-backup.csv', toSpreadsheetCsv(summary, configs))}
            variant="primary"
          >
            Backup Spreadsheet
          </Button>
        }
      >
        <Select
          label="TYPE"
          onChange={(event) => setFilters((value) => ({ ...value, type: event.target.value }))}
          value={filters.type}
        >
          <option value="">All type</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select
          label="STORERKEY / BU"
          onChange={(event) => setFilters((value) => ({ ...value, bu: event.target.value }))}
          value={filters.bu}
        >
          <option value="">All BU</option>
          {buOptions.map((bu) => (
            <option key={bu} value={bu}>
              {bu}
            </option>
          ))}
        </Select>
        <Select
          label="AREA PENGIRIMAN"
          onChange={(event) => setFilters((value) => ({ ...value, area: event.target.value }))}
          value={filters.area}
        >
          <option value="">All area</option>
          {areaOptions.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>
        <Input
          label="Start date"
          onChange={(event) => setFilters((value) => ({ ...value, startDate: event.target.value }))}
          type="date"
          value={filters.startDate}
        />
        <Input
          label="End date"
          onChange={(event) => setFilters((value) => ({ ...value, endDate: event.target.value }))}
          type="date"
          value={filters.endDate}
        />
      </FilterBar>

      <Card className="sla-config-panel">
        <SectionHeader
          description="Set DC territory and BU mapping from inside the app."
          title="DC Configuration"
        />
        <div className="sla-config-form">
          <Input
            label="DC Name"
            onChange={(event) =>
              setDraftConfig((value) => ({ ...value, dcName: event.target.value }))
            }
            value={draftConfig.dcName}
          />
          <Input
            label="Territory"
            onChange={(event) =>
              setDraftConfig((value) => ({ ...value, territory: event.target.value }))
            }
            value={draftConfig.territory}
          />
          <Input
            label="BU"
            onChange={(event) => setDraftConfig((value) => ({ ...value, bu: event.target.value }))}
            value={draftConfig.bu}
          />
          <Button onClick={saveConfig} variant="secondary">
            Save config
          </Button>
        </div>
      </Card>

      {summary.length === 0 ? (
        <EmptyState
          description="Import SLA customer data to generate DC on time, delay, and SLA summary."
          title="No SLA customer data yet"
        />
      ) : (
        <DataTable
          columns={[
            { header: 'DC', key: 'dcName', render: (row) => row.dcName },
            { header: 'BU', key: 'bu', render: (row) => row.bu },
            { align: 'right', header: 'On Time', key: 'onTime', render: (row) => row.onTime },
            { align: 'right', header: 'Delay', key: 'delay', render: (row) => row.delay },
            {
              align: 'right',
              header: 'SLA',
              key: 'sla',
              render: (row) => `${row.sla.toFixed(1)}%`,
            },
            {
              header: 'Sparkline',
              key: 'sparkline',
              render: (row) => (
                <div className="sla-row-sparkline" aria-label="dc-ontime-delay-sla-sparkline">
                  <span style={{ width: `${Math.max(8, row.sla)}%` }} />
                  <span style={{ width: `${Math.max(8, 100 - row.sla)}%` }} />
                </div>
              ),
            },
          ]}
          getRowKey={(row) => `${row.dcName}-${row.bu}`}
          rows={summary}
        />
      )}
    </section>
  )
}
