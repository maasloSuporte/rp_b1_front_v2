import api from './api';
import type { ITechnologyGetOutputDto } from '../types/models';

function normalizeTechnologyList(data: unknown): ITechnologyGetOutputDto[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const arr = obj.data ?? obj.value ?? obj.items;
    if (Array.isArray(arr)) return arr;
  }
  return [];
}

export const technologyService = {
  getTechnology: async (): Promise<ITechnologyGetOutputDto[]> => {
    const response = await api.get<unknown>('/technologies/all');
    return normalizeTechnologyList(response.data);
  },
};
