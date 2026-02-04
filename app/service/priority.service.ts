import api from './api';
import type { IPriorityGetOutputDto } from '../types/models';

export const priorityService = {
  getPriority: async (): Promise<IPriorityGetOutputDto[]> => {
    const response = await api.get<IPriorityGetOutputDto[]>('/priorities');
    return response.data;
  },
};
