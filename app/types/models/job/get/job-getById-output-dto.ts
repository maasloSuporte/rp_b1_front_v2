export interface IJobGetByIdOutputDto { 
    id: number
    projectId: number
    machineId: number
    state: string
    ended: string
    priority: string
    started: string
    name: string
    projectName: string
    machineName: string
    hostname: string
    priorityId: number
    processId: number
    packageVersion: string
    createdAt: string
    updatedAt: string
}
