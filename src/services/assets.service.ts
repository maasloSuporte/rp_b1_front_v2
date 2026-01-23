import api from './api';
import type {
  IPaginationOutputDto,
  IAssetGetOutputDto,
  IAssetGetAllOutputDto,
  IAssetCreateInputDto,
  IAssetCreateOutputDto,
  IAssetUpdateInputDto,
  IAssetUpdateOutputDto,
  IAssetDeleteInputDto,
  IAssetDeleteOutputDto,
  IAssetGetByIdOutputDto,
} from '../types/models';

export const assetsService = {
  getAllAssets: async (queryString: string): Promise<IPaginationOutputDto<IAssetGetAllOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IAssetGetAllOutputDto>>(
      `/assets?${queryString}`
    );
    return response.data;
  },

  getByIdAsset: async (id: number): Promise<IAssetGetByIdOutputDto> => {
    const response = await api.get<IAssetGetByIdOutputDto>(`/assets/${id}`);
    return response.data;
  },

  createAsset: async (asset: IAssetCreateInputDto): Promise<IAssetCreateOutputDto> => {
    const response = await api.post<IAssetCreateOutputDto>('/assets', asset);
    return response.data;
  },

  updateAsset: async (id: number, asset: IAssetUpdateInputDto): Promise<IAssetUpdateOutputDto> => {
    const response = await api.patch<IAssetUpdateOutputDto>(`/assets/${id}`, asset);
    return response.data;
  },

  deleteAsset: async (asset: IAssetDeleteInputDto): Promise<IAssetDeleteOutputDto> => {
    const response = await api.delete<IAssetDeleteOutputDto>(`/assets/${asset.id}`);
    return response.data;
  },
};
