export type SlaCustomerRecord = {
  externOrderKey: string
  type: string
  delayTime: number
  areaPengiriman: string
  shippedDate: string
  dcName: string
}

export type DcConfig = {
  dcName: string
  territory: string
  bu: string
}

export type SlaSummary = {
  dcName: string
  onTime: number
  delay: number
  sla: number
}
