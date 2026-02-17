import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { companyUserService } from '../../service/companyUser.service';
import { usersService } from '../../service/users.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { ICompanyUserGetUsersOutputDto, IPaginationOutputDto } from '../../types/models';

export default function Users() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const confirmEnable = useModalStore((state) => state.confirmEnable);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('SortField=id&SortOrder=asc&PageNumber=1&PageSize=100');
  const [roleFilterOptions, setRoleFilterOptions] = useState<{ id: number; label: string }[]>([]);

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'email', sortKey: 'User.Email', label: t('pages.users.email'), filterable: true, sortable: true, filterType: 'text' },
      { key: 'role', label: t('pages.users.role'), filterable: true, sortable: false, filterType: 'select', selectMode: 'multiple', filterOptions: roleFilterOptions },
      {
        key: 'active',
        label: t('pages.automation.columnStatus'),
        filterable: true,
        filterType: 'select',
        selectMode: 'single',
        sortable: true,
        filterOptions: [
          { id: 'true', label: t('common.status.active') },
          { id: 'false', label: t('common.status.inactive') },
        ],
      },
      { key: 'actions', label: t('common.actions.label'), type: 'action' },
    ],
    [t, roleFilterOptions]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      { label: t('common.buttons.edit'), action: 'edit', icon: 'edit' },
      { label: t('pages.users.disable'), action: 'disable', icon: 'block', showCondition: (item: any) => item.activeValue },
      { label: t('pages.users.enable'), action: 'enable', icon: 'check_circle', showCondition: (item: any) => !item.activeValue },
    ],
    [t]
  );

  const loadRoles = async () => {
    try {
      const roles = await companyUserService.getRoles();
      setRoleFilterOptions(roles.map((role) => ({ id: role.id, label: role.name })));
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const result: IPaginationOutputDto<ICompanyUserGetUsersOutputDto> = await companyUserService.getAllUsers(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x: ICompanyUserGetUsersOutputDto) => ({
        id: x.userId,
        email: x.userEmail,
        role: x.userRoles.map((y: string) => y).join(', ') || '',
        rolesId: (x.userRoles as string[])?.map((y: string) => y).join(', ') || '',
        active: x.userActive ? t('common.status.active') : t('common.status.inactive'),
        activeValue: x.userActive,
      })));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/users/${event.item.id}`);
        break;
      case 'disable':
        const confirmedDelete = await confirmDelete({
          description: 'This action will permanently disable',
          itemName: event.item.email,
          buttonName: 'Yes, Disabled'
        });
        if (confirmedDelete) {
          try {
            await usersService.disabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast(t('common.states.success'), t('pages.users.disableSuccess'), 'success');
            loadUsers();
          } catch (error) {
            showToast(t('common.states.error'), t('pages.users.disableError'), 'error');
          }
        }
        break;
      case 'enable':
        const confirmedEnable = await confirmEnable({
          itemName: event.item.email,
        });
        if (confirmedEnable) {
          try {
            await usersService.enabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast(t('common.states.success'), t('pages.users.enableSuccess'), 'success');
            loadUsers();
          } catch (error) {
            showToast(t('common.states.error'), t('pages.users.enableError'), 'error');
          }
        }
        break;
    }
  };

  const loadfunctions = async () => {
    await loadRoles();
    await loadUsers();
  };

  useEffect(() => {
    loadfunctions().then();
  }, [queryString]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.users.title')}</h1>
        <button
          onClick={() => navigate('/users/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          {t('pages.users.createUser')}
        </button>
      </div>
      <section className="mt-6">
        <DynamicTable
          columns={columns}
          data={data}
          totalItems={totalItems}
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 100]}
          showFirstLastButtons={true}
          actionMenuItems={actionMenuItems}
          onActionClick={handleActionClick}
          onQueryParamsChange={setQueryString}
        />
      </section>
    </div>
  );
}
