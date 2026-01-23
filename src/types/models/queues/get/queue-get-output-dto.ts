export interface IQueueGetOutputDto { 
    id: number
    name: string
    description: string
    storedEncrypt: boolean
    autoRetry: boolean
    maxRetry: number
}
