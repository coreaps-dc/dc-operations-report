import type { DcConfig, SlaCustomerRecord, SlaSummary } from './types'

const requiredHeaders = [
  'EXTERNORDERKEY',
  'STORERKEY',
  'TYPE',
  'DELAY TIME',
  'AREA PENGIRIMAN',
  'SHIPPED DATE',
]

function normalizeHeader(value: string) {
  return value.trim().toUpperCase()
}

function parseLine(line: string, separator: string) {
  const cells: string[] = []
  let current = ''
  let quoted = false

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted
    } else if (char === separator && !quoted) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells.map((cell) => cell.replace(/^"|"$/g, ''))
}

export function getDcNameFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim().toUpperCase()
}

export function parseSlaCustomerFile(content: string, fileName: string): SlaCustomerRecord[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length < 2) return []

  const separator = lines[0].includes('\t') ? '\t' : ','
  const headers = parseLine(lines[0], separator).map(normalizeHeader)
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required header: ${missingHeaders.join(', ')}`)
  }

  const dcName = getDcNameFromFileName(fileName)

  return lines.slice(1).map((line) => {
    const cells = parseLine(line, separator)
    const getValue = (header: string) => cells[headers.indexOf(header)]?.trim() ?? ''
    const delayText = getValue('DELAY TIME')
    const delayTime = Number(delayText.replace(',', '.')) || 0

    return {
      areaPengiriman: getValue('AREA PENGIRIMAN'),
      dcName,
      delayTime,
      externOrderKey: getValue('EXTERNORDERKEY'),
      shippedDate: getValue('SHIPPED DATE'),
      storerKey: getValue('STORERKEY'),
      type: getValue('TYPE'),
    }
  })
}

export function summarizeSla(records: SlaCustomerRecord[], configs: DcConfig[]): SlaSummary[] {
  const configByDc = new Map(configs.map((config) => [config.dcName, config]))
  const byDcBu = new Map<string, SlaCustomerRecord[]>()

  for (const record of records) {
    const configBu = configByDc.get(record.dcName)?.bu
    const bu = configBu || record.storerKey || 'UNMAPPED'
    const key = `${record.dcName}::${bu}`
    byDcBu.set(key, [...(byDcBu.get(key) ?? []), record])
  }

  return Array.from(byDcBu.entries()).map(([key, rows]) => {
    const [dcName, bu] = key.split('::')
    const uniqueOrders = new Map(rows.map((row) => [row.externOrderKey, row]))
    const orders = Array.from(uniqueOrders.values())
    const delay = orders.filter((row) => row.delayTime > 0).length
    const onTime = orders.length - delay
    const sla = orders.length === 0 ? 0 : (onTime / orders.length) * 100

    return { bu, dcName, delay, onTime, sla }
  })
}

export function filterRecords(
  records: SlaCustomerRecord[],
  filters: { type: string; area: string; bu: string; startDate: string; endDate: string },
) {
  return records.filter((record) => {
    const shippedTime = record.shippedDate ? new Date(record.shippedDate).getTime() : 0
    const startTime = filters.startDate ? new Date(filters.startDate).getTime() : 0
    const endTime = filters.endDate ? new Date(filters.endDate).getTime() : 0

    return (
      (!filters.type || record.type === filters.type) &&
      (!filters.bu || record.storerKey === filters.bu) &&
      (!filters.area || record.areaPengiriman === filters.area) &&
      (!startTime || shippedTime >= startTime) &&
      (!endTime || shippedTime <= endTime)
    )
  })
}

export function toSpreadsheetCsv(summary: SlaSummary[], configs: DcConfig[]) {
  const configByDc = new Map(configs.map((config) => [config.dcName, config]))
  const rows = [
    ['DC', 'BU', 'Territory', 'On Time', 'Delay', 'SLA'],
    ...summary.map((row) => {
      const config = configByDc.get(row.dcName)
      return [
        row.dcName,
        row.bu || config?.bu || '',
        config?.territory ?? '',
        String(row.onTime),
        String(row.delay),
        `${row.sla.toFixed(1)}%`,
      ]
    }),
  ]

  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
}
