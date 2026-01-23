export interface IJobGetAllOutputDto { 
  id: number
  name: string
  hostname: string
  machineUser: string
  state: number
  priority: string
  started: string
  ended: string
  robot: string
  packageVersion: string
  projectName: string
}
