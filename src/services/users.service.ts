import api from './api';
import type {
  IUserCreateInputDto,
  IUserCreateOutputDto,
  IUserGetOutputDto,
  IUserGetByUserOutputDto,
  IUserUpdateInputDto,
  IUserUpdateOutputDto,
  IUserDeleteInputDto,
  IUserEnableInputDto,
} from '../types/models';

export const usersService = {
  getAllUsers: async (): Promise<IUserGetOutputDto[]> => {
    try{
      const response = await api.get<IUserGetOutputDto[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return [];
    }
  },

  getByIdUser: async (userId: string): Promise<IUserGetByUserOutputDto> => {
    const response = await api.get<IUserGetByUserOutputDto>(`/users/${userId}`);
    return response.data;
  },

  createUser: async (user: IUserCreateInputDto): Promise<IUserCreateOutputDto> => {
    
    console.log(user);
    const response = await api.post<IUserCreateOutputDto>('/users', user);
    return response.data;
  },

  updateUser: async (id: string, user: IUserUpdateInputDto): Promise<IUserUpdateOutputDto> => {
    const response = await api.patch<IUserUpdateOutputDto>(`/users/Update/${id}`, user);
    return response.data;
  },

  disabledUser: async (user: IUserDeleteInputDto): Promise<void> => {
    await api.patch<void>(
      `/users/disable/${user.id}?callerEmail=${encodeURIComponent(user.callerEmail)}`,
      {}
    );
  },

  enabledUser: async (user: IUserEnableInputDto): Promise<void> => {
    await api.patch<void>(
      `/users/enable/${user.id}?callerEmail=${encodeURIComponent(user.callerEmail)}`,
      {}
    );
  },
};
