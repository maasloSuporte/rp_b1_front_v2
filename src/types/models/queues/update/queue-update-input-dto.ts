export interface IQueueUpdateInputDto { 
    name: string
    description: string
    storedEncrypt: boolean
    autoRetry: boolean
    maxRetry: number
}
