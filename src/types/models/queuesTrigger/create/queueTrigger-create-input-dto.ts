import { IQueueTriggerArgumentsCreateInputDto } from "../../queuesTriggerArguments/create/queueTriggerArguments-create-input-dto"

export interface IQueueTriggerCreateInputDto { 
    name: string
    description: string
    queueId: number
    projectId: number
    machineId: number
    priority: string
    arguments: IQueueTriggerArgumentsCreateInputDto[]
    executionType: string
    enabled: boolean
}
