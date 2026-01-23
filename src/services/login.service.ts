import api from './api';
import type { IAuthInputDto, IAuthOutputDto } from '../types/models';

export const loginService = {
  login: async (auth: IAuthInputDto): Promise<IAuthOutputDto> => {
    const response = await api.post<IAuthOutputDto>('/users/authenticate', auth);
    return response.data;
  },
};
