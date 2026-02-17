import api from './api';
import type {
  IPaginationOutputDto,
  IPackageGetOutputDto,
  IPackageGetByIdOutputDto,
  IPackageCreateInputDto,
  IPackageCreateOutputDto,
  IPackageCompanyGetOutputDto,
} from '../types/models';

export const packagesService = {
  createPackege: async (pkg: IPackageCreateInputDto): Promise<IPackageCreateOutputDto> => {
    const response = await api.post<IPackageCreateOutputDto>('/packages/create', pkg);
    return response.data;
  },

  getAllPackages: async (queryString: string): Promise<IPaginationOutputDto<IPackageGetOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IPackageGetOutputDto>>(
      `/packages/all?${queryString}`
    );
    return response.data;
  },

  getByIdPackage: async (id: number): Promise<IPackageGetByIdOutputDto> => {
    const response = await api.get<IPackageGetByIdOutputDto>(`/packages/${id}`);
    return response.data;
  },

  getPackageCompany: async (): Promise<IPackageCompanyGetOutputDto[]> => {
    const response = await api.get<IPackageCompanyGetOutputDto[]>('/packages/company-packages');
    return response.data;
  },

  deletePackage: async (id: number): Promise<void> => {
    await api.delete(`/packages/${id}`);
  },
};
