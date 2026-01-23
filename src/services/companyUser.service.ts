import api from './api';
import type {
  ICompanyUserCreateInputDto,
  ICompanyUserCreateOutputDto,
  ICompanyUserGetRolesOutputDto,
  ICompanyUserGetUsersOutputDto,
  IPaginationOutputDto,
} from '../types/models';

export const companyUserService = {
  createCompanyUser: async (
    companyUser: ICompanyUserCreateInputDto
  ): Promise<ICompanyUserCreateOutputDto> => {
    const response = await api.post<ICompanyUserCreateOutputDto>(
      '/companyUsers',
      companyUser
    );
    return response.data;
  },

  getAllUsers: async (queryString: string): Promise<IPaginationOutputDto<ICompanyUserGetUsersOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<ICompanyUserGetUsersOutputDto>>(
      `/companyUsers?${queryString}`
    );
    console.log(response.data);
    return response.data;
  },

  getRoles: async (): Promise<ICompanyUserGetRolesOutputDto[]> => {
    const response = await api.get<ICompanyUserGetRolesOutputDto[]>('/companyUsers/roles');
    return response.data;
  },
};
