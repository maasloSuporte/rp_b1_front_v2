export interface IQueueCreateInputDto { 
    name: string
    description: string
    storedEncrypt: boolean
    autoRetry: boolean
    maxRetry: number
}
