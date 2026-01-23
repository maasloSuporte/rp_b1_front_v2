import api from './api';
import type { IPermissionsGetOutputDto } from '../types/models';

export const permissionsService = {
  getAllPermissions: async (): Promise<IPermissionsGetOutputDto[]> => {
    const response = await api.get<IPermissionsGetOutputDto[]>('/permissions/all');
    return response.data;
  },
};
