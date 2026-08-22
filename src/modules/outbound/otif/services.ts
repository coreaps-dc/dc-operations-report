import type { QueryService, ServiceResult } from '../../../foundation/services'
import {
  aggregateOtifOrders,
  normalizeHeader,
  otifRequiredHeaders,
  parseOtifDate,
  toNumber,
} from './utils'
import type { OtifImportInput, OtifImportResult, OtifOrder } from './types'

export interface OtifModuleService extends QueryService<{ facilityId: string }, OtifOrder[]> {
  importFile(input: OtifImportInput): Promise<ServiceResult<OtifImportResult>>
}

/** Local import adapter only. A future API adapter will use FacilityOperationalDataAccessPort. */
export const browserOtifService: OtifModuleService = {
  async importFile({ facilityId, file }) {
    if (!facilityId.trim()) return { ok: false, code: 'FACILITY_REQUIRED', message: 'Facility ID is required.' }
    const XLSX = await import('xlsx')
    const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
    const headers = (matrix[0] ?? []).map(normalizeHeader)
    const missing = otifRequiredHeaders.filter((header) => !headers.includes(header))
    if (missing.length) return { ok: false, code: 'INVALID_HEADERS', message: `Missing headers: ${missing.join(', ')}` }

    const records = matrix.slice(1).flatMap((line) => {
      const value = (header: string) => line[headers.indexOf(header)]
      const externalOrderKey = String(value('EXTERNORDERKEY') ?? '').trim()
      if (!externalOrderKey) return []
      return [{
        facilityId,
        dc: String(value('DC') ?? workbook.SheetNames[0]).trim(),
        territory: String(value('TERITORI') ?? value('TERRITORY') ?? '').trim(),
        businessUnit: String(value('BUSINESSUNIT') ?? '').trim(),
        externalOrderKey,
        storerKey: String(value('STORERKEY') ?? '').trim(),
        type: String(value('TYPE') ?? '').trim().toUpperCase(),
        areaPengiriman: String(value('AREAPENGIRIMAN') ?? '').trim().toUpperCase(),
        originalQty: toNumber(value('ORIGINALQTY')),
        shippedQty: toNumber(value('SHIPPEDQTY')),
        addDate: parseOtifDate(value('ADDDATE')),
        shippedCompleteDate: parseOtifDate(value('SHIPPEDCOMPLETEDATE')),
        requestedShipDate: parseOtifDate(value('REQUESTEDSHIPDATE')),
        originalRequestShipDate: parseOtifDate(value('ORIGINALREQUESTSHIPDATE')),
      }]
    })
    return { ok: true, data: { orders: aggregateOtifOrders(records), sourceName: file.name } }
  },
  async query() {
    return { ok: true, data: [] }
  },
}
