export type OtifStatus = 'HIT' | 'MISS'

export type OtifOrder = {
  facilityId: string
  dc: string
  territory: string
  businessUnit: string
  externalOrderKey: string
  storerKey: string
  type: string
  areaPengiriman: string
  originalQty: number
  shippedQty: number
  addDate?: string
  shippedCompleteDate?: string
  requestedShipDate?: string
  originalRequestShipDate?: string
  status: OtifStatus
  causes: string[]
}

export type OtifSummary = {
  label: string
  total: number
  hit: number
  miss: number
  otif: number
}

export type OtifImportInput = {
  facilityId: string
  file: File
}

export type OtifImportResult = {
  orders: OtifOrder[]
  sourceName: string
}
