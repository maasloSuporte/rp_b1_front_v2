import api from './api';
import type {
  IPaginationOutputDto,
  IJobGetAllOutputDto,
  IJobGetByIdOutputDto,
  IJobCreateInputDto,
  IJobCreateOutputDto,
} from '../types/models';

export const jobService = {
  getAllJobs: async (queryString: string): Promise<IPaginationOutputDto<IJobGetAllOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IJobGetAllOutputDto>>(
      `/jobs?${queryString}`
    );
    return response.data;
  },

  getByIdJob: async (id: number): Promise<IJobGetByIdOutputDto> => {
    const response = await api.get<IJobGetByIdOutputDto>(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (job: IJobCreateInputDto): Promise<IJobCreateOutputDto> => {
    const response = await api.post<IJobCreateOutputDto>('/jobs', job);
    return response.data;
  },

  executeJob: async (id: number): Promise<void> => {
    await api.post(`/jobs/${id}/execute`);
  },

  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  deleteAllJobs: async (): Promise<{ deletedCount: number }> => {
    const response = await api.delete<{ deletedCount: number }>('/jobs/all');
    return response.data;
  },
};
