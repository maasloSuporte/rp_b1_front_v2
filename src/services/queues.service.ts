import api from './api';
import type {
  IPaginationInputDto,
  IPaginationOutputDto,
  IQueueGetOutputDto,
  IQueueCreateInputDto,
  IQueueCreateOutputDto,
  IQueueUpdateInputDto,
  IQueueUpdateOutputDto,
  IQueueDeleteInputDto,
  IQueueDeleteOutputDto,
} from '../types/models';

export const queuesService = {
  getAllQueues: async (
    paginations: IPaginationInputDto
  ): Promise<IPaginationOutputDto<IQueueGetOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IQueueGetOutputDto>>(
      `/queues/all?PageNumber=${paginations.pageNumber}&PageSize=${paginations.pageSize}&SortField=id`
    );
    return response.data;
  },

  getByIdQueue: async (id: number): Promise<IQueueGetOutputDto> => {
    const response = await api.get<IQueueGetOutputDto>(`/queue/${id}`);
    return response.data;
  },

  createQueue: async (queue: IQueueCreateInputDto): Promise<IQueueCreateOutputDto> => {
    const response = await api.post<IQueueCreateOutputDto>('/queue', queue);
    return response.data;
  },

  updateQueue: async (id: number, queue: IQueueUpdateInputDto): Promise<IQueueUpdateOutputDto> => {
    const response = await api.patch<IQueueUpdateOutputDto>(`/queue/${id}`, queue);
    return response.data;
  },

  deleteQueue: async (queue: IQueueDeleteInputDto): Promise<IQueueDeleteOutputDto> => {
    const response = await api.delete<IQueueDeleteOutputDto>(`/queue/${queue.id}`);
    return response.data;
  },
};
