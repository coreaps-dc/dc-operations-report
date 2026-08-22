import type { OtifOrder, OtifStatus, OtifSummary } from './types'

type RawOtifOrder = Omit<OtifOrder, 'causes' | 'status'>

const customerTypes = new Set([
  'CUSTOMER',
  'TUGU',
  'ECOMMERCE ODI - 3PL',
  'ECOMMERCE ODI - OWN FLEET',
  'CUSTOMER SALES ORDER',
])
const grwTypes = new Set(['GRW', 'DAMAGE'])

export const otifRequiredHeaders = [
  'EXTERNORDERKEY',
  'TYPE',
  'STORERKEY',
  'ORIGINALQTY',
  'SHIPPEDQTY',
] as const

export function normalizeHeader(value: unknown) {
  return String(value ?? '').trim().toUpperCase().replace(/[\s_]+/g, '')
}

export function parseOtifDate(value: unknown) {
  if (!value) return undefined
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  if (typeof value === 'number') return new Date((value - 25569) * 86400 * 1000).toISOString()
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

export function toNumber(value: unknown) {
  const parsed = Number(String(value ?? '').replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function aggregateOtifOrders(rows: RawOtifOrder[]) {
  const grouped = new Map<string, RawOtifOrder>()

  for (const row of rows) {
    const key = `${row.type}::${row.externalOrderKey}`
    const current = grouped.get(key)
    if (!current) {
      grouped.set(key, { ...row })
      continue
    }
    current.originalQty += row.originalQty
    current.shippedQty += row.shippedQty
    current.addDate ??= row.addDate
    current.shippedCompleteDate ??= row.shippedCompleteDate
    current.requestedShipDate ??= row.requestedShipDate
    current.originalRequestShipDate ??= row.originalRequestShipDate
  }

  return Array.from(grouped.values()).map(evaluateOtifOrder)
}

export function evaluateOtifOrder(order: RawOtifOrder): OtifOrder {
  const causes: string[] = []
  const qtyOk = order.shippedQty >= order.originalQty
  let status: OtifStatus = 'MISS'
  const shippedAt = asDate(order.shippedCompleteDate)

  if (grwTypes.has(order.type)) {
    const addAt = asDate(order.addDate)
    const maxDays = order.areaPengiriman === 'DK' ? 4 : order.areaPengiriman === 'LK' ? 8 : undefined
    if (!addAt || !shippedAt || !maxDays) {
      causes.push('Tanggal atau area pengiriman untuk GRW/DAMAGE tidak lengkap')
    } else {
      const leadDays = (shippedAt.getTime() - addAt.getTime()) / 86400000
      status = leadDays < maxDays && qtyOk ? 'HIT' : 'MISS'
      if (leadDays >= maxDays) causes.push(`Lead time ${leadDays.toFixed(2)} hari melewati batas ${maxDays} hari`)
    }
  } else if (customerTypes.has(order.type)) {
    const requestedAt = asDate(order.requestedShipDate)
    if (!requestedAt || !shippedAt) {
      causes.push('Shipped Complete Date atau Requested Ship Date kosong')
    } else {
      status = startOfDay(shippedAt) <= startOfDay(requestedAt) && qtyOk ? 'HIT' : 'MISS'
      if (startOfDay(shippedAt) > startOfDay(requestedAt)) causes.push('Pengiriman melewati Requested Ship Date')
    }
  } else {
    causes.push(`TYPE/area tidak dikenali: ${order.type || '-'} / ${order.areaPengiriman || '-'}`)
  }

  if (!qtyOk) causes.push('Shipped Qty lebih kecil dari Original Qty')
  return { ...order, causes, status }
}

export function summarizeOtif(orders: OtifOrder[], selector: (order: OtifOrder) => string): OtifSummary[] {
  const groups = new Map<string, Omit<OtifSummary, 'otif'>>()
  for (const order of orders) {
    const label = selector(order) || 'Unassigned'
    const current = groups.get(label) ?? { label, total: 0, hit: 0, miss: 0 }
    current.total += 1
    current[order.status === 'HIT' ? 'hit' : 'miss'] += 1
    groups.set(label, current)
  }
  return Array.from(groups.values()).map((summary) => ({ ...summary, otif: summary.total ? summary.hit / summary.total * 100 : 0 }))
}

function asDate(value?: string) {
  if (!value) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}
