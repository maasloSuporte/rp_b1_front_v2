import api from './api';
import type { IFrequencyGetOutputDto } from '../types/models';

export const frequencyService = {
  getFrequency: async (): Promise<IFrequencyGetOutputDto[]> => {
    const response = await api.get<IFrequencyGetOutputDto[]>('/frequencies');
    return response.data;
  },
};
