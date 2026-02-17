import api from './api';
import type {
  IPaginationOutputDto,
  IScheduleGetAllOutputDto,
  IScheduleGetByIdOutputDto,
  IScheduleCreateInputDto,
  IScheduleCreateOutputDto,
  IScheduleUpdateInputDto,
  IScheduleUpdateOutputDto,
  IScheduleDeleteInputDto,
} from '../types/models';

export const scheduleService = {
  getAllSchedule: async (queryString: string): Promise<IPaginationOutputDto<IScheduleGetAllOutputDto>> => {
    const response = await api.get<IPaginationOutputDto<IScheduleGetAllOutputDto>>(
      `/schedules?${queryString}`
    );
    return response.data;
  },

  getByIdSchedule: async (id: number): Promise<IScheduleGetByIdOutputDto> => {
    const response = await api.get<IScheduleGetByIdOutputDto>(`/schedules/${id}`);
    return response.data;
  },

  createSchedule: async (schedule: IScheduleCreateInputDto): Promise<IScheduleCreateOutputDto> => {
    const response = await api.post<IScheduleCreateOutputDto>('/schedules', schedule);
    return response.data;
  },

  updateSchedule: async (id: number, schedule: IScheduleUpdateInputDto): Promise<IScheduleUpdateOutputDto> => {
    const response = await api.patch<IScheduleUpdateOutputDto>(`/schedules/${id}`, schedule, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  deleteSchedule: async (schedule: IScheduleDeleteInputDto): Promise<void> => {
    await api.delete<void>(`/schedules/${schedule.id}`);
  },
};
