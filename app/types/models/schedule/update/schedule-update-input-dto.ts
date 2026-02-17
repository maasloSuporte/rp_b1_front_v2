export interface IScheduleUpdateInputDto {
  frequencyId: number
  name: string
  priority: number
  details: string
  projectId?: number
  machineId?: number
}
