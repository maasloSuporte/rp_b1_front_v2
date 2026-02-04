import api from './api';
import type {
  IPaginationInputDto,
  IPaginationOutputDto,
  IApiResponseOutputDto,
  IQueueTriggerGetOutputDto,
  IQueueTriggerCreateInputDto,
  IQueueTriggerCreateOutputDto,
  IQueueTriggerUpdateInputDto,
  IQueueTriggerUpdateOutputDto,
  IQueueTriggerDeleteInputDto,
  IQueueTriggerDeleteOutputDto,
} from '../types/models';

export const queuesTriggerService = {
  getAllQueuesTrigger: async (
    paginations: IPaginationInputDto
  ): Promise<IApiResponseOutputDto<IPaginationOutputDto<IQueueTriggerGetOutputDto>>> => {
    const response = await api.get<IApiResponseOutputDto<IPaginationOutputDto<IQueueTriggerGetOutputDto>>>(
      `/queueTrigger/all?PageNumber=${paginations.pageNumber}&PageSize=${paginations.pageSize}`
    );
    return response.data;
  },

  getByIdQueueTrigger: async (id: number): Promise<IQueueTriggerGetOutputDto> => {
    const response = await api.get<IQueueTriggerGetOutputDto>(`/queueTrigger/${id}`);
    return response.data;
  },

  createQueueTrigger: async (
    queueTrigger: IQueueTriggerCreateInputDto
  ): Promise<IQueueTriggerCreateOutputDto> => {
    const response = await api.post<IQueueTriggerCreateOutputDto>('/queueTrigger', queueTrigger);
    return response.data;
  },

  updateQueueTrigger: async (
    id: number,
    queueTrigger: IQueueTriggerUpdateInputDto
  ): Promise<IQueueTriggerUpdateOutputDto> => {
    const response = await api.patch<IQueueTriggerUpdateOutputDto>(`/queueTrigger/${id}`, queueTrigger);
    return response.data;
  },

  deleteQueueTrigger: async (
    queueTrigger: IQueueTriggerDeleteInputDto
  ): Promise<IQueueTriggerDeleteOutputDto> => {
    const response = await api.delete<IQueueTriggerDeleteOutputDto>(`/queueTrigger/${queueTrigger.id}`);
    return response.data;
  },
};
