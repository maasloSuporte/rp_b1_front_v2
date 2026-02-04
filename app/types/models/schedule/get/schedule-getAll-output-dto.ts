export interface IScheduleGetAllOutputDto { 
    id: number
    frequencyId: number
    nextExecution: string
    name: string
    projectId: number
    machineId: number
    companyId: string
    priority: string
    details: string
    createdById: string
    deactivatedById: string
}
