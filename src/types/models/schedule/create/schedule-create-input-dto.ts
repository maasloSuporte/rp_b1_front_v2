import type { ICronInputDto } from "../../cron/create/cron-input-dto"
import type { IScheduleArgumentCreateInputDto } from "./scheduleArgument-create-input-dto"

export interface IScheduleCreateInputDto { 
    frequencyId: number
    name: string
    projectId: number
    machineId: number
    priority: number
    details: string
    arguments: IScheduleArgumentCreateInputDto[]
    cronSchedulling: ICronInputDto
}
