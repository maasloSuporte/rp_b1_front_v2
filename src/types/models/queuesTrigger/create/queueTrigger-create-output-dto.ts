import { IQueueTriggerArgumentsCreateOutputDto } from "../../queuesTriggerArguments/create/queueTriggerArguments-create-output-dto"

export interface IQueueTriggerCreateOutputDto { 
    id: number
    name: string
    description: string
    queueId: number
    projectId: number
    machineId: number
    priority: string
    executionType: string
    companyId: string
    arguments: IQueueTriggerArgumentsCreateOutputDto[]
    enabled: boolean
}
