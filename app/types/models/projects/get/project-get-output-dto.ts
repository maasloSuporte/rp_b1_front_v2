export interface IProjectGetOutputDto { 
  id: number
  name: string
  status: string
  active: boolean
  autoUpdate: boolean
  packageVersionId: number
  createdAt: string
  description: string
  packageName: string
}
