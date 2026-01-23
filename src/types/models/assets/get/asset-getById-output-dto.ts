export interface IAssetGetByIdOutputDto {
    id: number
    name: string
    type: string
    description: string
    userName: string | null
    value: string
    globalValue: boolean | null
    createdBy: string
    companyId: string
}