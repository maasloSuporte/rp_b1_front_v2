import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { usersService } from '../services/users.service';
import { rolesService } from '../services/roles.service';
import { companyUserService } from '../services/companyUser.service';
import { userRoleService } from '../services/userRole.service';
import type {
  IUserCreateInputDto,
  IUserUpdateInputDto,
  IRolesGetOutputDto,
} from '../types/models';

interface UserFormData {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function User() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [roles, setRoles] = useState<IRolesGetOutputDto[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    loadRoles();
    if (isEditMode && id) {
      loadUserById(id);
    }
  }, [id, isEditMode]);

  const loadUserById = async (userId: string) => {
    try {
      const user = await usersService.getByIdUser(userId);
      console.log(user);
      setValue('name', user.name);
      setValue('cpf', user.cpf);
      setValue('email', user.email);
      setValue('phoneNumber', user.phoneNumber);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await rolesService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const toggleTempSelection = (roleId: number) => {
    setTempSelected((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const addRole = (roleId: number) => {
    if (!selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds((prev) => [...prev, roleId]);
    }
    setTempSelected((prev) => prev.filter((id) => id !== roleId));
  };

  const removeRole = (roleId: number) => {
    setSelectedRoleIds((prev) => prev.filter((id) => id !== roleId));
    setTempSelected((prev) => prev.filter((id) => id !== roleId));
  };

  const moveSelectedToRight = () => {
    tempSelected.forEach((id) => {
      if (!selectedRoleIds.includes(id)) {
        setSelectedRoleIds((prev) => [...prev, id]);
      }
    });
    setTempSelected([]);
  };

  const moveSelectedToLeft = () => {
    setSelectedRoleIds((prev) => prev.filter((role) => !tempSelected.includes(role)));
    setTempSelected([]);
  };

  const getRoleName = (roleId: number): string => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : `Role ${roleId}`;
  };

  const availableRoles = roles.filter((r) => !selectedRoleIds.includes(r.id));

  const onSubmit = async (data: UserFormData) => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (selectedRoleIds.length === 0) {
      alert('Selecione pelo menos um role');
      return;
    }

    try {
      if (isEditMode && id) {
        const updateUser: IUserUpdateInputDto = {
          name: data.name,
          phoneNumber: data.phoneNumber,
        };
        await usersService.updateUser(id, updateUser);
        alert('Usuário atualizado com sucesso');
        navigate('/users');
      } else {
        const inputUser: IUserCreateInputDto = {
          name: data.name,
          cpf: data.cpf,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
        };

        const user = await usersService.createUser(inputUser);

        await companyUserService.createCompanyUser({ userId: user.id, active: true });

        await userRoleService.createUserRole({
          userId: user.id,
          roleId: selectedRoleIds,
        });

        alert('Usuário criado com sucesso');
        navigate('/users');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar usuário';
      alert(`Erro: ${message}`);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-indigo-600 hover:text-indigo-900 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit User' : 'Create User'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              {...register('cpf', { required: 'CPF é obrigatório' })}
              disabled={isEditMode}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            />
            {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email é obrigatório' })}
              disabled={isEditMode}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              {...register('phoneNumber', { required: 'Telefone é obrigatório' })}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {!isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Senha é obrigatória' })}
                  className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', { required: 'Confirmação de senha é obrigatória' })}
                  className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">As senhas não coincidem</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Role Selection */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Roles</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Available Roles</h3>
              <div className="border rounded-md p-2 h-64 overflow-y-auto">
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-2 mb-1 rounded cursor-pointer ${
                      tempSelected.includes(role.id) ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTempSelection(role.id)}
                    onDoubleClick={() => addRole(role.id)}
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <button
                type="button"
                onClick={moveSelectedToRight}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                →
              </button>
              <button
                type="button"
                onClick={moveSelectedToLeft}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                ←
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Selected Roles</h3>
              <div className="border rounded-md p-2 h-64 overflow-y-auto">
                {selectedRoleIds.map((roleId) => (
                  <div
                    key={roleId}
                    className={`p-2 mb-1 rounded cursor-pointer ${
                      tempSelected.includes(roleId) ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTempSelection(roleId)}
                    onDoubleClick={() => removeRole(roleId)}
                  >
                    {getRoleName(roleId)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
