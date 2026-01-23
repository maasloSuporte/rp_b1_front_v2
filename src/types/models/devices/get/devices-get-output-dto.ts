export interface IDevicesGetOutputDto { 
  id: number
  machineName: string
  environment: string
  hostName: string
  ip: string
  token: string
  macAddress: string
  osVersion: string
  cpuUsagePercent: number
  ramTotalBytes: number
  diskFreeBytes: number
  diskTotalBytes: number
  agentVersion: string
  physicalCoreCount: number
  logicalCoreCount: number
}
