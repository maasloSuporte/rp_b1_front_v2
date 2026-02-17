import type { ICronOutputDto } from "../../cron/get/cron-output-dto"
export interface IScheduleGetByIdOutputDto {
  id: number
  name: string
  process: string
  nextExecution: string
  frequency: string
  frequencyId: number
  projectId: number
  machineId: number
  priorityId: number
  schedule: ICronOutputDto
  machine: string
  priority: string
  details: string
  createdBy: string
  desactivatedBy: any
}
