import api from './api';
import type {
  IRolesGetOutputDto,
  IRolesCreateInputDto,
  IRolesCreateOutputDto,
  IRolesUpdateInputDto,
  IRolesUpdateOutputDto,
  IRolesDeleteInputDto,
  IRolesDeleteOutputDto,
  IPaginationOutputDto,
} from '../types/models';

export const rolesService = {
  getAllRoles: async (): Promise<IRolesGetOutputDto[]> => {
    const response = await api.get<IRolesGetOutputDto[]>('/roles/all');
    return response.data;
  },

  getAllRolesFilter: async (
    queryString: string
  ): Promise<IPaginationOutputDto<IRolesGetOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IRolesGetOutputDto>>(
      `/roles?${queryString}`
    );
    return response.data;
  },

  getRole: async (id: number): Promise<IRolesGetOutputDto> => {
    const response = await api.get<IRolesGetOutputDto>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (role: IRolesCreateInputDto): Promise<IRolesCreateOutputDto> => {
    const response = await api.post<IRolesCreateOutputDto>('/roles', role);
    return response.data;
  },

  updateRole: async (id: number, role: IRolesUpdateInputDto): Promise<IRolesUpdateOutputDto> => {
    const response = await api.patch<IRolesUpdateOutputDto>(`/roles/${id}`, role);
    return response.data;
  },

  deleteRole: async (role: IRolesDeleteInputDto): Promise<IRolesDeleteOutputDto> => {
    const response = await api.delete<IRolesDeleteOutputDto>(`/roles/${role.id}`);
    return response.data;
  },
};
