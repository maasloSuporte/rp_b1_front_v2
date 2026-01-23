import api from './api';
import type {
  IPaginationOutputDto,
  IDevicesGetOutputDto,
  IDeviceGetAllOutputDto,
  IDeviceCreateInputDto,
  IDeviceCreateOutputDto,
  IDeviceUpdateInputDto,
  IDeviceUpdateOutputDto,
  IDeviceDeleteInputDto,
  IDeviceDeleteOutputDto,
} from '../types/models';

export const devicesService = {
  getAllDevices: async (queryString: string): Promise<IPaginationOutputDto<IDevicesGetOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IDevicesGetOutputDto>>(
      `/machines?${queryString}`
    );
    return response.data;
  },

  getDevices: async (): Promise<IDeviceGetAllOutputDto[]> => {
    const response = await api.get<IDeviceGetAllOutputDto[]>('/machines/all');
    return response.data;
  },

  getByIdDevices: async (id: number): Promise<IDevicesGetOutputDto> => {
    const response = await api.get<IDevicesGetOutputDto>(`/machines/${id}`);
    return response.data;
  },

  createDevice: async (device: IDeviceCreateInputDto): Promise<IDeviceCreateOutputDto> => {
    const response = await api.post<IDeviceCreateOutputDto>('/machines', device);
    return response.data;
  },

  updateDevice: async (id: number, device: IDeviceUpdateInputDto): Promise<IDeviceUpdateOutputDto> => {
    const response = await api.patch<IDeviceUpdateOutputDto>(`/machines/${id}`, device);
    return response.data;
  },

  deleteDevice: async (device: IDeviceDeleteInputDto): Promise<IDeviceDeleteOutputDto> => {
    const response = await api.delete<IDeviceDeleteOutputDto>(`/machines/${device.id}`);
    return response.data;
  },
};
