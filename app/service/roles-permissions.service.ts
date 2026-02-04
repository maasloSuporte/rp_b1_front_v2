import api from './api';
import type {
  IRolesPermissionsCreateInputDto,
  IRolesPermissionsCreateOutputDto,
  IRolesPermissionsGetOutputDto,
} from '../types/models';

export const rolesPermissionsService = {
  createRolesPermissions: async (
    rolesPermissions: IRolesPermissionsCreateInputDto
  ): Promise<IRolesPermissionsCreateOutputDto> => {
    const response = await api.post<IRolesPermissionsCreateOutputDto>(
      '/rolePermissions',
      rolesPermissions,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  },

  getRolePermissions: async (roleId: number): Promise<IRolesPermissionsGetOutputDto> => {
    const response = await api.get<IRolesPermissionsGetOutputDto>(
      `/rolePermissions/RoleId${roleId}`
    );
    return response.data;
  },
};
