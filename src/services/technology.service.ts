import api from './api';
import type { ITechnologyGetOutputDto } from '../types/models';

export const technologyService = {
  getTechnology: async (): Promise<ITechnologyGetOutputDto[]> => {
    const response = await api.get<ITechnologyGetOutputDto[]>('/technologies/all');
    return response.data;
  },
};
