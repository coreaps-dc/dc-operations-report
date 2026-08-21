export type SlaCustomerRecord = {
  externOrderKey: string
  type: string
  delayTime: number
  areaPengiriman: string
  shippedDate: string
  dcName: string
  storerKey: string
}

export type DcConfig = {
  dcName: string
  territory: string
  bu: string
}

export type SlaSummary = {
  bu: string
  dcName: string
  onTime: number
  delay: number
  sla: number
}
