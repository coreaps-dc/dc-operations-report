import { departments } from '../../departments'

export const departmentNavigation = departments.map((department) => ({
  id: department.id,
  label: department.name,
  description: department.description,
}))
