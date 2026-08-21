export type DepartmentId = 'outbound' | 'inbound' | 'inventory' | 'storing'

export type DepartmentDefinition = {
  id: DepartmentId
  name: string
  description: string
  owner: string
}

export const departments: DepartmentDefinition[] = [
  {
    id: 'outbound',
    name: 'Outbound',
    description: 'Shipment, picking, checking, loading, and dispatch reports.',
    owner: 'Outbound Operations',
  },
  {
    id: 'inbound',
    name: 'Inbound',
    description: 'Receiving, unloading, putaway handoff, and supplier flow reports.',
    owner: 'Inbound Operations',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Stock accuracy, adjustment, cycle count, and inventory control reports.',
    owner: 'Inventory Control',
  },
  {
    id: 'storing',
    name: 'Storing',
    description: 'Storage capacity, location usage, replenishment, and slotting reports.',
    owner: 'Storing Operations',
  },
]

export function isDepartmentId(value: string): value is DepartmentId {
  return departments.some((department) => department.id === value)
}
