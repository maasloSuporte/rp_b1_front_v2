export interface IQueueUpdateOutputDto { 
    id: number
    name: string
    description: string
    storedEncrypt: boolean
    autoRetry: boolean
    maxRetry: number
}
