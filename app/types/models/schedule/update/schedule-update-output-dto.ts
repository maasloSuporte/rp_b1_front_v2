export interface IScheduleUpdateOutputDto { 
    id: number
    drequencyId: number
    nextExecution: string
    name: string
    projectId: number
    status: string
    machineId: number
    companyId: string
    priority: string
    details: string
    createById: string
    desactivateById: string
}
