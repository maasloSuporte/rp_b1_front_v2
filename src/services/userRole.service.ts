import api from './api';
import type { IUserRoleCreateInputDto } from '../types/models';

export const userRoleService = {
  createUserRole: async (userRole: IUserRoleCreateInputDto): Promise<void> => {
    await api.post<void>('/userRoles', userRole);
  },
};
