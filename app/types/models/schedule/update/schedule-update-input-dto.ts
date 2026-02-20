export interface IScheduleUpdateInputDto {
  frequencyId: number
  name: string
  priority: number
  details: string
  /** Enviar null para desvincular (limpar a seleção). */
  projectId?: number | null
  /** Enviar null para desvincular (limpar a seleção). */
  machineId?: number | null
}
