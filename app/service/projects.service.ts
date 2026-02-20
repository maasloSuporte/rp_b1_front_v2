import api from './api';
import type {
  IPaginationInputDto,
  IPaginationOutputDto,
  IProjectsCreateInputDto,
  IProjectsCreateOutputDto,
  IProjectUpdateInputDto,
  IProjectUpdateOutputDto,
  IProjectGetOutputDto,
  IProjectGetAllOutputDto,
  IProjectGetSimpleOutputDto,
  IProjectDeleteInputDto,
  IProjectDeleteOutputDto,
} from '../types/models';

export const projectsService = {
  createProject: async (project: IProjectsCreateInputDto): Promise<IProjectsCreateOutputDto> => {
    const response = await api.post<IProjectsCreateOutputDto>('/projects', project);
    return response.data;
  },

  updateProject: async (id: number, project: IProjectUpdateInputDto): Promise<IProjectUpdateOutputDto> => {
    const response = await api.patch<IProjectUpdateOutputDto>(`/projects/${id}`, project);
    return response.data;
  },

  getAllProjects: async (paginations: IPaginationInputDto, queryParams?: string): Promise<IPaginationOutputDto<IProjectGetAllOutputDto>> => {
    const queryString = queryParams || `SortField=id&SortOrder=asc&PageNumber=${paginations.pageNumber}&PageSize=${paginations.pageSize}`;
    const response = await api.get<IPaginationOutputDto<IProjectGetAllOutputDto>>(
      `/projects/all?${queryString}`
    );
    return response.data;
  },

  getByIdProject: async (projectId: number): Promise<IProjectGetOutputDto> => {
    const response = await api.get<IProjectGetOutputDto>(`/projects/${projectId}`);
    return response.data;
  },

  getProjects: async (): Promise<IProjectGetSimpleOutputDto[]> => {
    const response = await api.get<IProjectGetSimpleOutputDto[]>('/projects/simple/all');
    return response.data;
  },

  deleteProject: async (project: IProjectDeleteInputDto): Promise<IProjectDeleteOutputDto> => {
    const url = `/projects/${project.id}`;
    console.log('[projects.service] deleteProject - URL:', url, 'payload id:', project.id);
    const response = await api.delete<IProjectDeleteOutputDto>(url);
    console.log('[projects.service] deleteProject - response status:', response.status);
    return response.data;
  },
};
