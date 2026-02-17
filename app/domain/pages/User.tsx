import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { usersService } from '../../service/users.service';
import { rolesService } from '../../service/roles.service';
import { companyUserService } from '../../service/companyUser.service';
import { userRoleService } from '../../service/userRole.service';
import { useNotificationStore } from '../../service/notification.service';
import type {
  IUserCreateInputDto,
  IUserUpdateInputDto,
  IRolesGetOutputDto,
} from '../../types/models';

interface UserFormData {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function User() {
  const { t } = useTranslation('translation');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
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
      showToast(t('common.states.error'), t('pages.user.passwordMismatch'), 'error');
      return;
    }

    if (selectedRoleIds.length === 0) {
      showToast(t('common.warning'), t('pages.user.selectOneRole'), 'warning');
      return;
    }

    try {
      if (isEditMode && id) {
        const updateUser: IUserUpdateInputDto = {
          name: data.name,
          phoneNumber: data.phoneNumber,
        };
        await usersService.updateUser(id, updateUser);
        showToast(t('common.states.success'), t('pages.user.updateSuccess'), 'success');
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

        showToast(t('common.states.success'), t('pages.user.createSuccess'), 'success');
        navigate('/users');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.user.saveError');
      showToast(t('common.states.error'), message, 'error');
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-indigo-600 hover:text-indigo-900 mb-4"
        >
          ← {t('pages.user.back')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? t('pages.user.titleEdit') : t('pages.user.titleCreate')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pages.user.name')}</label>
            <input
              type="text"
              {...register('name', { required: t('pages.user.nameRequired') })}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pages.user.cpf')}</label>
            <input
              type="text"
              {...register('cpf', { required: t('pages.user.cpfRequired') })}
              disabled={isEditMode}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            />
            {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pages.user.email')}</label>
            <input
              type="email"
              {...register('email', { required: t('pages.user.emailRequired') })}
              disabled={isEditMode}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pages.user.phone')}</label>
            <input
              type="text"
              {...register('phoneNumber', { required: t('pages.user.phoneRequired') })}
              className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {!isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('pages.user.password')}</label>
                <input
                  type="password"
                  {...register('password', { required: t('pages.user.passwordRequired') })}
                  className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('pages.user.confirmPassword')}
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', { required: t('pages.user.confirmPasswordRequired') })}
                  className="mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{t('pages.user.passwordMismatch')}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Role Selection */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">{t('pages.user.roles')}</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">{t('pages.user.availableRoles')}</h3>
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
              <h3 className="text-sm font-medium mb-2">{t('pages.user.selectedRoles')}</h3>
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
            {isEditMode ? t('common.buttons.save') : t('common.buttons.create')}
          </button>
        </div>
      </form>
    </div>
  );
}
